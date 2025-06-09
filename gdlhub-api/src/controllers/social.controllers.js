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
  const userId = req.user?.id;
  const { rid } = req.params;
  const { content } = req.body;

  if (!userId) return res.status(401).json({ message: "No autenticado" });
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "El comentario no puede estar vacío." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO comments (user_id, restaurant_id, content)
   VALUES ($1, $2, $3)
   RETURNING id, content, created_at`,
      [userId, rid, content.trim()]
    );

    const comment = rows[0];

    // Obtener nombre y avatar del usuario
    const userRes = await pool.query(
      `SELECT name AS user_name, avatar FROM users WHERE id = $1`,
      [userId]
    );

    res.status(201).json({
      ...comment,
      user_name: userRes.rows[0].user_name,
      avatar: userRes.rows[0].avatar,
    });

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
        c.content,
        r.image AS restaurant_image,
        r.description AS restaurant_description,
        r.address AS restaurant_address
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
        NULL AS content,
        r.image AS restaurant_image,
        r.description AS restaurant_description,
        r.address AS restaurant_address
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
        u2.name AS content,
        NULL AS restaurant_image,
        NULL AS restaurant_description,
        NULL AS restaurant_address
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
      SELECT 
        r.*,
        COALESCE(
          json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
          '[]'
        ) AS specialties
      FROM favorite_restaurants fr
      JOIN restaurants r ON r.id = fr.restaurant_id
      LEFT JOIN specialties s ON s.restaurant_id = r.id
      WHERE fr.user_id = $1
      GROUP BY r.id
    `, [id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorite restaurants" });
  }
};


export const getGlobalFeed = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      -- Comentarios globales
      SELECT
        'comment' AS type,
        c.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        c.content,
        r.image AS restaurant_image,
        r.description AS restaurant_description,
        r.address AS restaurant_address
      FROM comments c
      JOIN users u ON u.id = c.user_id
      JOIN restaurants r ON r.id = c.restaurant_id

      UNION

      -- Favoritos globales
      SELECT
        'favorite' AS type,
        fr.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        NULL AS content,
        r.image AS restaurant_image,
        r.description AS restaurant_description,
        r.address AS restaurant_address
      FROM favorite_restaurants fr
      JOIN users u ON u.id = fr.user_id
      JOIN restaurants r ON r.id = fr.restaurant_id

      UNION

      -- Follows globales
      SELECT
        'followed' AS type,
        uf.created_at,
        u1.id AS user_id,
        u1.name AS user_name,
        u1.avatar,
        NULL AS restaurant_id,
        NULL AS restaurant_name,
        u2.name AS content,
        NULL AS restaurant_image,
        NULL AS restaurant_description,
        NULL AS restaurant_address
      FROM user_follows uf
      JOIN users u1 ON u1.id = uf.follower_id
      JOIN users u2 ON u2.id = uf.followed_id

      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching global feed:", err);
    res.status(500).json({ message: "Error retrieving feed" });
  }
};

export const getMutualFeed = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(`
      WITH mutuals AS (
        SELECT uf1.followed_id AS friend_id
        FROM user_follows uf1
        JOIN user_follows uf2
          ON uf1.followed_id = uf2.follower_id
         AND uf1.follower_id = uf2.followed_id
        WHERE uf1.follower_id = $1
      )

      -- Comentarios
      SELECT
        'comment' AS type,
        c.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.avatar,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        c.content,
        r.image AS restaurant_image,
        r.description AS restaurant_description,
        r.address AS restaurant_address
      FROM mutuals m
      JOIN users u ON u.id = m.friend_id
      JOIN comments c ON c.user_id = u.id
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
        NULL AS content,
        r.image AS restaurant_image,
        r.description AS restaurant_description,
        r.address AS restaurant_address
      FROM mutuals m
      JOIN users u ON u.id = m.friend_id
      JOIN favorite_restaurants fr ON fr.user_id = u.id
      JOIN restaurants r ON r.id = fr.restaurant_id

      ORDER BY created_at DESC
      LIMIT 50
    `, [id]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching mutual feed:", err);
    res.status(500).json({ message: "Error retrieving mutual feed" });
  }
};

export const followUser = async (req, res) => {
  const followerId = req.user.id;
  const { id } = req.params;

  if (parseInt(id) === followerId) {
    return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
  }

  try {
    await pool.query(
      `INSERT INTO user_follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [followerId, id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al seguir usuario:", err);
    res.status(500).json({ message: "Error interno" });
  }
};


export const unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM user_follows WHERE follower_id = $1 AND followed_id = $2`,
      [followerId, id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al dejar de seguir:", err);
    res.status(500).json({ message: "Error interno" });
  }
};


export const isFollowing = async (req, res) => {
  const followerId = req.user.id;
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      `SELECT 1 FROM user_follows WHERE follower_id = $1 AND followed_id = $2`,
      [followerId, id]
    );
    res.json({ following: rowCount > 0 });
  } catch (err) {
    console.error("Error al verificar follow:", err);
    res.status(500).json({ message: "Error interno" });
  }
};


export const saveRestaurant = async (req, res) => {
  const userId = req.user?.id;
  const { rid } = req.params;

  if (!userId) return res.status(401).json({ message: "No autenticado" });

  try {
    await pool.query(
      `INSERT INTO favorite_restaurants (user_id, restaurant_id) 
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, rid]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al guardar restaurante:", err);
    res.status(500).json({ message: "Error al guardar restaurante" });
  }
};


export const unsaveRestaurant = async (req, res) => {
  const userId = req.user?.id;
  const { rid } = req.params;

  if (!userId) return res.status(401).json({ message: "No autenticado" });

  try {
    await pool.query(
      `DELETE FROM favorite_restaurants WHERE user_id = $1 AND restaurant_id = $2`,
      [userId, rid]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al eliminar favorito:", err);
    res.status(500).json({ message: "Error al eliminar favorito" });
  }
};


export const isSavedRestaurant = async (req, res) => {
  const userId = req.user?.id;
  const { rid } = req.params;

  if (!userId) return res.status(401).json({ message: "No autenticado" });

  try {
    const { rowCount } = await pool.query(
      `SELECT 1 FROM favorite_restaurants WHERE user_id = $1 AND restaurant_id = $2`,
      [userId, rid]
    );
    res.json({ saved: rowCount > 0 });
  } catch (err) {
    console.error("Error al verificar favorito:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: "No autorizado o comentario no existe" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Error al eliminar comentario:", err);
    res.status(500).json({ message: "Error al eliminar comentario" });
  }
};