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
  maps TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba
INSERT INTO users (name, email)
VALUES 
  ('John Doe', 'john@gmail.com'),
  ('Jane Doe', 'jane@gmail.com');

INSERT INTO restaurants (name, description, address, maps)
VALUES 
  ('La Antigua Waffles', 'Waffles, chilaquiles, huevos y cafe', 'Calle Prisciliano Sánchez 1003, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://maps.app.goo.gl/u7pCGtMWL6aWgqnR6'),
  ('La Casa Del Waffle', 'Waffles y desayunos', 'Libertad 1705, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://maps.app.goo.gl/zT2noWM2GaikWYpF9');

