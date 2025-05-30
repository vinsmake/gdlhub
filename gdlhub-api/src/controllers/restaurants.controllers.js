import { pool } from "../db.js";

export const getRestaurants = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM restaurants");
  res.json(rows);
};

export const getRestaurantById = async (req, res) => {
  const { rid } = req.params;

  try {
    // 1. Restaurante
    const { rows: restaurantRows } = await pool.query(
      "SELECT * FROM restaurants WHERE id = $1",
      [rid]
    );
    if (restaurantRows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant = restaurantRows[0];

    // 2. Especialidades
    const { rows: specialties } = await pool.query(
      "SELECT name FROM specialties WHERE restaurant_id = $1",
      [rid]
    );

    // 3. Menú
    const { rows: menu } = await pool.query(
      "SELECT id, name, description, price, category, image FROM menu_items WHERE restaurant_id = $1 ORDER BY category, name",
      [rid]
    );

    // 4. Respuesta combinada
    res.json({
      ...restaurant,
      specialties: specialties.map(s => s.name),
      menu
    });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, maps } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO restaurants (name, description, address, maps) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, address, maps]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

export const deleteRestaurant = async (req, res) => {
  const { rid } = req.params;
  const { rowCount } = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [rid]);
  if (rowCount === 0) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  res.sendStatus(204);
};

export const updateRestaurant = async (req, res) => {
  const { rid } = req.params;
  const { name, description, address } = req.body;
  await pool.query(
    'UPDATE restaurants SET name = $1, description = $2, address = $3 WHERE id = $4',
    [name, description, address, rid]
  );
  res.send("Restaurant updated");
};
