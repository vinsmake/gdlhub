import { pool } from "../db.js";

export const getRestaurants = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.*,
        COALESCE(
          json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
          '[]'
        ) AS specialties
      FROM restaurants r
      LEFT JOIN specialties s ON s.restaurant_id = r.id
      GROUP BY r.id
      ORDER BY r.name
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener restaurantes:", error.message);
    res.status(500).json({ message: "Error al obtener restaurantes" });
  }
};


export const getRestaurantById = async (req, res) => {
  const { rid } = req.params;

  try {
    // 1. Restaurante con calificación promedio
    const { rows: restaurantRows } = await pool.query(
      `SELECT 
        r.*,
        COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
        COUNT(rt.rating) as total_ratings
      FROM restaurants r
      LEFT JOIN restaurant_ratings rt ON r.id = rt.restaurant_id
      WHERE r.id = $1
      GROUP BY r.id`,
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
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const { name, description, address, maps, specialties = [], menu = [] } = req.body;

    await client.query("BEGIN");

    // 1. Insertar restaurante con user_id
    const { rows } = await client.query(
      'INSERT INTO restaurants (name, description, address, maps, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, address, maps, userId]
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
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating restaurant:", err);
    res.status(500).json({ message: "Error al crear restaurante" });
  } finally {
    client.release();
  }
};




export const deleteRestaurant = async (req, res) => {
  const { rid } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  // Verificar si el restaurante pertenece al usuario
  const { rowCount: owned } = await pool.query(
    `SELECT 1 FROM restaurants WHERE id = $1 AND user_id = $2`,
    [rid, userId]
  );

  if (owned === 0) {
    return res.status(403).json({ message: "No autorizado para eliminar este restaurante" });
  }

  // Eliminar
  const { rowCount } = await pool.query(
    `DELETE FROM restaurants WHERE id = $1`,
    [rid]
  );

  if (rowCount === 0) {
    return res.status(404).json({ message: "Restaurante no encontrado" });
  }

  res.sendStatus(204);
};


export const updateRestaurant = async (req, res) => {
  const { rid } = req.params;
  const userId = req.user?.id;
  const { name, description, address, maps, specialties = [], menu = [] } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const client = await pool.connect();
  try {
    // Verificar propiedad del restaurante
    const { rows } = await client.query(
      "SELECT user_id FROM restaurants WHERE id = $1",
      [rid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }
    if (rows[0].user_id !== userId) {
      return res.status(403).json({ message: "No tienes permiso para editar este restaurante" });
    }

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

    // 3. Reemplazar relaciones de menú
    const { rows: existingItems } = await client.query(
      "SELECT id FROM menu_items WHERE restaurant_id = $1",
      [rid]
    );
    const itemIds = existingItems.map((item) => item.id);

    if (itemIds.length > 0) {
      await client.query("DELETE FROM menu_item_categories WHERE menu_item_id = ANY($1)", [itemIds]);
      await client.query("DELETE FROM menu_item_tags WHERE menu_item_id = ANY($1)", [itemIds]);
    }

    await client.query("DELETE FROM menu_items WHERE restaurant_id = $1", [rid]);

    // 4. Insertar nuevo menú
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


export const getRestaurantsBySpecialties = async (req, res) => {
  const { tags } = req.query; // Ejemplo: "birria,sushi"

  if (!tags) return res.status(400).json({ message: "Faltan etiquetas de especialidad" });

  const tagList = tags.split(",").map(t => t.trim().toLowerCase());

  try {
    const { rows } = await pool.query(`
      SELECT r.*, ARRAY_AGG(s.name) AS specialties
      FROM restaurants r
      JOIN specialties s ON s.restaurant_id = r.id
      WHERE LOWER(s.name) = ANY($1)
      GROUP BY r.id
    `, [tagList]);

    res.json(rows);
  } catch (error) {
    console.error("Error buscando restaurantes por especialidad:", error);
    res.status(500).json({ message: "Error buscando restaurantes" });
  }
};

export const searchRestaurants = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: "Falta término de búsqueda" });
  }

  try {
    const search = `%${q.trim()}%`;

    const { rows } = await pool.query(`
      SELECT 
        r.id, r.name, r.description, r.address, r.maps, r.image, r.created_at,
        COALESCE(
          json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
          '[]'
        ) AS specialties
      FROM restaurants r
      LEFT JOIN specialties s ON s.restaurant_id = r.id
      LEFT JOIN menu_items mi ON mi.restaurant_id = r.id
      WHERE
        unaccent(LOWER(s.name)) LIKE unaccent(LOWER($1))
        OR unaccent(LOWER(mi.name)) LIKE unaccent(LOWER($1))
        OR unaccent(LOWER(r.name)) LIKE unaccent(LOWER($1))
      GROUP BY r.id, r.name, r.description, r.address, r.maps, r.image, r.created_at
    `, [search]);

    res.json(rows);
  } catch (err) {
    console.error("🔴 Error en búsqueda:", err.message);
    res.status(500).json({ message: "Error al buscar", error: err.message });
  }
};

export const getMenuMeta = async (req, res) => {
  try {
    const { rows: categories } = await pool.query("SELECT id, name FROM menu_categories ORDER BY name");
    const { rows: tags } = await pool.query("SELECT id, name FROM menu_tags ORDER BY name");

    res.json({ categories, tags });
  } catch (error) {
    console.error("Error al obtener metadatos del menú:", error.message);
    res.status(500).json({ message: "Error al obtener metadatos" });
  }
};