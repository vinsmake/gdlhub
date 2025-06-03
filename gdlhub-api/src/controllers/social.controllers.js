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
