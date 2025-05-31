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
  const client = await pool.connect();
  try {
    const { name, description, address, maps, specialties = [], menu = [] } = req.body;

    await client.query("BEGIN");

    // 1. Insertar restaurante
    const { rows } = await client.query(
      'INSERT INTO restaurants (name, description, address, maps) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, address, maps]
    );
    const restaurant = rows[0];

    // 2. Insertar especialidades (si hay)
    for (const spec of specialties) {
      if (spec.trim()) {
        await client.query(
          'INSERT INTO specialties (restaurant_id, name) VALUES ($1, $2)',
          [restaurant.id, spec.trim()]
        );
      }
    }

    // 3. Insertar elementos del menú (si hay)
    for (const item of menu) {
      if (item.name.trim()) {
        await client.query(
          `INSERT INTO menu_items (restaurant_id, name, description, price, category)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            restaurant.id,
            item.name.trim(),
            item.description || "",
            item.price ? parseFloat(item.price) : null,
            item.category || "",
          ]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json(restaurant);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Error creating restaurant" });
  } finally {
    client.release();
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
  const { name, description, address, maps, specialties = [], menu = [] } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Actualizar datos básicos
    await client.query(
      `UPDATE restaurants
       SET name = $1, description = $2, address = $3, maps = $4
       WHERE id = $5`,
      [name, description, address, maps, rid]
    );

    // 2. Reemplazar especialidades
    await client.query("DELETE FROM specialties WHERE restaurant_id = $1", [rid]);

    for (const spec of specialties) {
      if (spec.trim()) {
        await client.query(
          "INSERT INTO specialties (restaurant_id, name) VALUES ($1, $2)",
          [rid, spec.trim()]
        );
      }
    }

    // 3. Reemplazar menú
    await client.query("DELETE FROM menu_items WHERE restaurant_id = $1", [rid]);

    for (const item of menu) {
      if (item.name.trim()) {
        await client.query(
          `INSERT INTO menu_items (restaurant_id, name, description, price, category, image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            rid,
            item.name.trim(),
            item.description || "",
            item.price ? parseFloat(item.price) : null,
            item.category || "",
            item.image || null,
          ]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "Restaurante actualizado correctamente" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error actualizando restaurante:", err);
    res.status(500).json({ message: "Error actualizando restaurante" });
  } finally {
    client.release();
  }
};

