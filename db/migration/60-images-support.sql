-- Migración para añadir soporte de imágenes
-- Agregar columna INE a restaurantes
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS ine_document VARCHAR(255);

-- Agregar columna imagen a menu_items (si no existe)
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Agregar columnas de perfil a usuarios
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255);

-- Agregar índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_ine ON restaurants(ine_document);
CREATE INDEX IF NOT EXISTS idx_menu_items_image ON menu_items(image);