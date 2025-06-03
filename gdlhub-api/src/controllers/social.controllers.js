import { pool } from "../db.js";

// Obtener comentarios de un restaurante
export const getRestaurantComments = async (req, res) => {
  const { rid } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT c.id, c.content, c.created_at, u.name AS user_name, u.avatar
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.restaurant_id = $1
      ORDER BY c.created_at DESC
    `, [rid]);

    res.json(rows);
  } catch (err) {
    console.error("Error getting comments:", err);
    res.status(500).json({ message: "Error retrieving comments" });
  }
};

export const addRestaurantComment = async (req, res) => {
  const userId = 1; // Simulado: usuario loggeado
  const { rid } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "El comentario no puede estar vacío." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO comments (user_id, restaurant_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, rid, content.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error al agregar comentario" });
  }
};

export const getUserFeed = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(`
      -- Comentarios
      SELECT
        'comment' AS type,
        c.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        c.content
      FROM user_follows uf
      JOIN users u ON u.id = uf.followed_id
      JOIN comments c ON c.user_id = u.id
      JOIN restaurants r ON r.id = c.restaurant_id
      WHERE uf.follower_id = $1

      UNION

      -- Favoritos
      SELECT
        'favorite' AS type,
        fr.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        NULL AS content
      FROM user_follows uf
      JOIN users u ON u.id = uf.followed_id
      JOIN favorite_restaurants fr ON fr.user_id = u.id
      JOIN restaurants r ON r.id = fr.restaurant_id
      WHERE uf.follower_id = $1

      UNION

      -- Nuevos follows
      SELECT
        'followed' AS type,
        uf2.created_at,
        u1.id AS user_id,
        u1.name AS user_name,
        u1.avatar,
        NULL AS restaurant_id,
        NULL AS restaurant_name,
        u2.name AS content  -- quien fue seguido
      FROM user_follows uf
      JOIN users u1 ON u1.id = uf.followed_id
      JOIN user_follows uf2 ON uf2.follower_id = u1.id
      JOIN users u2 ON u2.id = uf2.followed_id
      WHERE uf.follower_id = $1

      ORDER BY created_at DESC
      LIMIT 50
    `, [id]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching full feed:", err);
    res.status(500).json({ message: "Error retrieving feed" });
  }
};

export const getFollowingUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.name, u.email, u.avatar
      FROM user_follows uf
      JOIN users u ON u.id = uf.followed_id
      WHERE uf.follower_id = $1
    `, [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching followed users" });
  }
};

export const getFavoriteRestaurants = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT r.*
      FROM favorite_restaurants fr
      JOIN restaurants r ON r.id = fr.restaurant_id
      WHERE fr.user_id = $1
    `, [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorite restaurants" });
  }
};

export const getGlobalFeed = async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      -- Comentarios
      SELECT
        'comment' AS type,
        c.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        c.content
      FROM comments c
      JOIN users u ON u.id = c.user_id
      JOIN restaurants r ON r.id = c.restaurant_id

      UNION

      -- Favoritos
      SELECT
        'favorite' AS type,
        fr.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        NULL AS content
      FROM favorite_restaurants fr
      JOIN users u ON u.id = fr.user_id
      JOIN restaurants r ON r.id = fr.restaurant_id

      UNION

      -- Follows
      SELECT
        'followed' AS type,
        f.created_at,
        u1.id AS user_id,
        u1.name AS user_name,
        u1.avatar,
        NULL AS restaurant_id,
        NULL AS restaurant_name,
        u2.name AS content
      FROM user_follows f
      JOIN users u1 ON u1.id = f.follower_id
      JOIN users u2 ON u2.id = f.followed_id

      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error in global feed:", err);
    res.status(500).json({ message: "Error retrieving global activity" });
  }
};
