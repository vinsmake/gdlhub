-- Agregar coordenadas geográficas a la tabla restaurants
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);

-- Crear índice para búsquedas geográficas
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude);

-- Comentarios para documentar los campos
COMMENT ON COLUMN restaurants.latitude IS 'Latitud de la ubicación del restaurante';
COMMENT ON COLUMN restaurants.longitude IS 'Longitud de la ubicación del restaurante';