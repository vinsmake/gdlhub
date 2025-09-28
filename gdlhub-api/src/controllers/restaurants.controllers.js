import { pool } from "../db.js";
import path from "path";
import fs from "fs";

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
    let { name, description, address, maps, specialties, menu } = req.body;
    
    console.log('🍽️ [RESTAURANT] Iniciando creación de restaurante:', name);
    console.log('🍽️ [RESTAURANT] Archivos recibidos:', req.files?.length || 0);
    console.log('🍽️ [RESTAURANT] Fieldnames de archivos:', req.files?.map(f => f.fieldname) || []);
    
    // Procesar datos JSON si vienen como string
    if (typeof specialties === 'string') {
      specialties = JSON.parse(specialties);
    }
    if (typeof menu === 'string') {
      menu = JSON.parse(menu);
    }

    // Validar que existe el archivo INE
    const ineFile = req.files?.find(file => file.fieldname === 'ineDocument');
    if (!ineFile) {
      return res.status(400).json({ message: "Es obligatorio subir una copia de tu INE" });
    }

    await client.query("BEGIN");

    // Guardar archivo INE
    const ineDir = path.join(process.cwd(), 'uploads', 'ine');
    if (!fs.existsSync(ineDir)) {
      fs.mkdirSync(ineDir, { recursive: true });
    }
    const ineFilename = `ine-${userId}-${Date.now()}${path.extname(ineFile.originalname)}`;
    const ineFullPath = path.join(ineDir, ineFilename);
    const inePath = `uploads/ine/${ineFilename}`;
    fs.writeFileSync(ineFullPath, ineFile.buffer);

    // Manejar imagen principal del restaurante
    const restaurantImageFile = req.files?.find(file => file.fieldname === 'image');
    let restaurantImagePath = null;

    console.log('📸 [RESTAURANT] Buscando imagen del restaurante...');
    if (restaurantImageFile) {
      console.log('📸 [RESTAURANT] Imagen encontrada:', restaurantImageFile.originalname);
      const restaurantDir = path.join(process.cwd(), 'uploads', 'restaurants');
      if (!fs.existsSync(restaurantDir)) {
        fs.mkdirSync(restaurantDir, { recursive: true });
        console.log('📁 [RESTAURANT] Directorio creado:', restaurantDir);
      }
      const restaurantFilename = `restaurant-${userId}-${Date.now()}${path.extname(restaurantImageFile.originalname)}`;
      const restaurantFullPath = path.join(restaurantDir, restaurantFilename);
      restaurantImagePath = `uploads/restaurants/${restaurantFilename}`;
      fs.writeFileSync(restaurantFullPath, restaurantImageFile.buffer);
      console.log('✅ [RESTAURANT] Imagen guardada en:', restaurantImagePath);
    } else {
      console.log('❌ [RESTAURANT] No se encontró imagen del restaurante');
    }

    // 1. Insertar restaurante con user_id, ruta del INE e imagen
    const { rows } = await client.query(
      'INSERT INTO restaurants (name, description, address, maps, user_id, ine_document, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, address, maps, userId, inePath, restaurantImagePath]
    );
    const restaurant = rows[0];

    // 2. Insertar especialidades
    if (Array.isArray(specialties)) {
      for (const spec of specialties) {
        if (spec && spec.trim()) {
          await client.query(
            'INSERT INTO specialties (restaurant_id, name) VALUES ($1, $2)',
            [restaurant.id, spec.trim()]
          );
        }
      }
    }

    // 3. Insertar elementos del menú con imágenes
    if (Array.isArray(menu)) {
      for (let i = 0; i < menu.length; i++) {
        const item = menu[i];
        if (item.name && item.name.trim()) {
          // Buscar imagen correspondiente al platillo
          const dishImageFile = req.files?.find(file => file.fieldname === `menuImage_${i}`);
          let imagePath = null;

          if (dishImageFile) {
            // Crear directorio si no existe
            const dishesDir = path.join(process.cwd(), 'uploads', 'dishes');
            if (!fs.existsSync(dishesDir)) {
              fs.mkdirSync(dishesDir, { recursive: true });
            }
            const filename = `dish-${restaurant.id}-${i}-${Date.now()}${path.extname(dishImageFile.originalname)}`;
            const fullPath = path.join(dishesDir, filename);
            imagePath = `uploads/dishes/${filename}`;
            fs.writeFileSync(fullPath, dishImageFile.buffer);
          }

          const { rows: itemRows } = await client.query(
            `INSERT INTO menu_items (restaurant_id, name, description, price, image)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [
              restaurant.id,
              item.name.trim(),
              item.description || "",
              item.price ? parseFloat(item.price) : null,
              imagePath
            ]
          );
          const menuItemId = itemRows[0].id;

          // Asociar categorías
          if (Array.isArray(item.category_ids)) {
            for (const categoryId of item.category_ids) {
              await client.query(
                `INSERT INTO menu_item_categories (menu_item_id, category_id)
                 VALUES ($1, $2)`,
                [menuItemId, categoryId]
              );
            }
          }

          // Asociar etiquetas
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
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Restaurante creado exitosamente", restaurant });
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

  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const client = await pool.connect();
  try {
    let { name, description, address, maps, specialties, menu } = req.body;
    
    console.log('🔄 [RESTAURANT_UPDATE] Iniciando actualización de restaurante:', rid);
    console.log('🔄 [RESTAURANT_UPDATE] Archivos recibidos:', req.files?.length || 0);
    
    // Procesar datos JSON si vienen como string
    if (typeof specialties === 'string') {
      specialties = JSON.parse(specialties);
    }
    if (typeof menu === 'string') {
      menu = JSON.parse(menu);
    }
    
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

    // Manejar nueva imagen del restaurante si se proporciona
    let updateQuery = `UPDATE restaurants SET name = $1, description = $2, address = $3, maps = $4`;
    let updateParams = [name, description, address, maps];
    
    const restaurantImageFile = req.files?.find(file => file.fieldname === 'image');
    if (restaurantImageFile) {
      const restaurantDir = path.join(process.cwd(), 'uploads', 'restaurants');
      if (!fs.existsSync(restaurantDir)) {
        fs.mkdirSync(restaurantDir, { recursive: true });
      }
      const restaurantFilename = `restaurant-${userId}-${Date.now()}${path.extname(restaurantImageFile.originalname)}`;
      const restaurantFullPath = path.join(restaurantDir, restaurantFilename);
      const restaurantImagePath = `uploads/restaurants/${restaurantFilename}`;
      fs.writeFileSync(restaurantFullPath, restaurantImageFile.buffer);
      
      updateQuery += `, image = $5 WHERE id = $6`;
      updateParams = [...updateParams, restaurantImagePath, rid];
    } else {
      updateQuery += ` WHERE id = $5`;
      updateParams = [...updateParams, rid];
    }

    // 1. Actualizar datos básicos del restaurante
    await client.query(updateQuery, updateParams);

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

    // 4. Insertar nuevo menú con imágenes
    for (let i = 0; i < menu.length; i++) {
      const item = menu[i];
      if (item.name.trim()) {
        // Buscar imagen nueva para este platillo
        const dishImageFile = req.files?.find(file => file.fieldname === `menuImage_${i}`);
        let imagePath = item.image; // Mantener imagen existente por defecto

        if (dishImageFile) {
          // Crear directorio si no existe
          const dishesDir = path.join(process.cwd(), 'uploads', 'dishes');
          if (!fs.existsSync(dishesDir)) {
            fs.mkdirSync(dishesDir, { recursive: true });
          }
          const filename = `dish-${rid}-${i}-${Date.now()}${path.extname(dishImageFile.originalname)}`;
          const fullPath = path.join(dishesDir, filename);
          imagePath = `uploads/dishes/${filename}`;
          fs.writeFileSync(fullPath, dishImageFile.buffer);
          console.log(`🍽️ [RESTAURANT_UPDATE] Nueva imagen de platillo ${i}:`, imagePath);
        }
        
        const { rows: itemRows } = await client.query(
          `INSERT INTO menu_items (restaurant_id, name, description, price, image)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [
            rid,
            item.name.trim(),
            item.description || "",
            item.price ? parseFloat(item.price) : null,
            imagePath
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