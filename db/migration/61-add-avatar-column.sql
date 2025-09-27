-- Migración: Agregar columna avatar a la tabla users
-- Archivo: 61-add-avatar-column.sql

-- Agregar columna avatar si no existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT NULL;

-- Comentario para documentar el cambio
COMMENT ON COLUMN users.avatar IS 'Ruta relativa de la imagen de avatar del usuario';