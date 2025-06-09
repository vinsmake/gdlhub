import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";


export const getUsers = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users")
    res.json(rows);
}

export const getUserById = async (req, res) => {
    const { uid } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
}

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, avatar`,
      [name, email, hash]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: "Email ya registrado" });
    }
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [uid]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
}

export const updateUser = async (req, res) => {
    const { uid } = req.params;
    const data = req.body;
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [data.name, data.email, uid]);
    res.send("actualizando usuario con id: " + uid);
}

export const getUserRecommendations = async (req, res) => {
  const { uid } = req.params;

  try {
    const { rows } = await pool.query(
      `
SELECT 
  r2.restaurant_id,
  res.name,
  res.image,
  ROUND(AVG(r2.rating), 1) AS avg_rating,
  COUNT(DISTINCT r_common.user_id) AS similar_votes,
  ARRAY_AGG(DISTINCT u.name) AS similar_users,
  MIN(res_common.name) AS common_restaurant,
  (
    SELECT COALESCE(json_agg(s.name), '[]')
    FROM specialties s
    WHERE s.restaurant_id = res.id
  ) AS specialties
FROM restaurant_ratings r1
JOIN restaurant_ratings r_common ON r1.user_id <> r_common.user_id
  AND r1.restaurant_id = r_common.restaurant_id
JOIN restaurant_ratings r2 ON r_common.user_id = r2.user_id
JOIN restaurants res ON res.id = r2.restaurant_id
JOIN restaurants res_common ON res_common.id = r_common.restaurant_id
JOIN users u ON u.id = r_common.user_id
WHERE r1.user_id = $1
  AND r2.restaurant_id NOT IN (
    SELECT restaurant_id FROM restaurant_ratings WHERE user_id = $1
  )
GROUP BY r2.restaurant_id, res.id
ORDER BY avg_rating DESC, similar_votes DESC
LIMIT 10;
      `,
      [uid]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error in recommendation query:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generateToken(user); // ← genera JWT

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Error al hacer login:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

