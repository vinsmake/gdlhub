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

    // 3. Menú con categorías y etiquetas
    const { rows: menuItems } = await pool.query(
      `
SELECT 
  mi.id,
  mi.name,
  mi.description,
  mi.price,
  COALESCE(
    json_agg(DISTINCT mc.name) FILTER (WHERE mc.name IS NOT NULL),
    '[]'
  ) AS categories,
  COALESCE(
    json_agg(DISTINCT mic.category_id) FILTER (WHERE mic.category_id IS NOT NULL),
    '[]'
  ) AS category_ids,
  COALESCE(
    json_agg(DISTINCT mt.name) FILTER (WHERE mt.name IS NOT NULL),
    '[]'
  ) AS tags,
  COALESCE(
    json_agg(DISTINCT mit.tag_id) FILTER (WHERE mit.tag_id IS NOT NULL),
    '[]'
  ) AS tag_ids
FROM menu_items mi
LEFT JOIN menu_item_categories mic ON mic.menu_item_id = mi.id
LEFT JOIN menu_categories mc ON mc.id = mic.category_id
LEFT JOIN menu_item_tags mit ON mit.menu_item_id = mi.id
LEFT JOIN menu_tags mt ON mt.id = mit.tag_id
WHERE mi.restaurant_id = $1
GROUP BY mi.id
ORDER BY mi.name

      `,
      [rid]
    );

    // 4. Listado completo de categorías y etiquetas
    const { rows: allCategories } = await pool.query(
      "SELECT id, name FROM menu_categories ORDER BY name"
    );
    const { rows: allTags } = await pool.query(
      "SELECT id, name FROM menu_tags ORDER BY name"
    );

    // 5. Respuesta combinada
    res.json({
      ...restaurant,
      specialties: specialties.map((s) => s.name),
      menu: menuItems,
      categories: allCategories,
      tags: allTags
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
        const { rows: itemRows } = await client.query(
          `INSERT INTO menu_items (restaurant_id, name, description, price)
       VALUES ($1, $2, $3, $4) RETURNING id`,
          [
            restaurant.id,
            item.name.trim(),
            item.description || "",
            item.price ? parseFloat(item.price) : null,
          ]
        );
        const menuItemId = itemRows[0].id;

        // Insertar categorías
        if (Array.isArray(item.category_ids)) {
          for (const categoryId of item.category_ids) {
            await client.query(
              `INSERT INTO menu_item_categories (menu_item_id, category_id)
           VALUES ($1, $2)`,
              [menuItemId, categoryId]
            );
          }
        }

        // Insertar etiquetas
        if (Array.isArray(item.tag_ids)) {
          for (const tagId of item.tag_ids) {
            await client.query(
              `INSERT INTO menu_item_tags (menu_item_id, tag_id)
           VALUES ($1, $2)`,
              [menuItemId, tagId]
            );
          }
        }
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

    // 1. Actualizar datos básicos del restaurante
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

    // 3. Reemplazar relaciones y menú
    const { rows: existingItems } = await client.query(
      "SELECT id FROM menu_items WHERE restaurant_id = $1",
      [rid]
    );
    const itemIds = existingItems.map((item) => item.id);

    if (itemIds.length > 0) {
      await client.query("DELETE FROM menu_item_categories WHERE menu_item_id = ANY($1)", [itemIds]);
      await client.query("DELETE FROM menu_item_tags WHERE menu_item_id = ANY($1)", [itemIds]);
    }

    // Eliminar los platillos (después de eliminar sus relaciones)
    await client.query("DELETE FROM menu_items WHERE restaurant_id = $1", [rid]);

    // 4. Insertar nuevos platillos y sus relaciones
    for (const item of menu) {
      if (item.name.trim()) {
        const { rows: itemRows } = await client.query(
          `INSERT INTO menu_items (restaurant_id, name, description, price)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [
            rid,
            item.name.trim(),
            item.description || "",
            item.price ? parseFloat(item.price) : null,
          ]
        );
        const menuItemId = itemRows[0].id;

        if (Array.isArray(item.category_ids)) {
          for (const categoryId of item.category_ids) {
            await client.query(
              `INSERT INTO menu_item_categories (menu_item_id, category_id)
               VALUES ($1, $2)`,
              [menuItemId, categoryId]
            );
          }
        }

        if (Array.isArray(item.tag_ids)) {
          for (const tagId of item.tag_ids) {
            await client.query(
              `INSERT INTO menu_item_tags (menu_item_id, tag_id)
               VALUES ($1, $2)`,
              [menuItemId, tagId]
            );
          }
        }
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

