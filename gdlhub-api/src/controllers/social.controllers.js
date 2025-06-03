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
