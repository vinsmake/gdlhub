-- init.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba
INSERT INTO users (name, email)
VALUES 
  ('John Doe', 'john@gmail.com'),
  ('Jane Doe', 'jane@gmail.com');

INSERT INTO restaurants (name, description, address)
VALUES 
  ('Tacos El Güero', 'Tacos al pastor y bistec', 'Av. Patria 234'),
  ('Mariscos El Chapo', 'Cocteles y ceviches', 'Calle Marlin 12');
