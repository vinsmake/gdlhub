CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  maps TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Especialidades por restaurante (máx 5)
CREATE TABLE IF NOT EXISTS specialties (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(6,2),
  category VARCHAR(50),
  image VARCHAR(255)   
);


-- Categorías de menú
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Etiquetas de tipo dietético / extra
CREATE TABLE IF NOT EXISTS menu_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Relación muchos-a-muchos: menu_items x categories
CREATE TABLE IF NOT EXISTS menu_item_categories (
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, category_id)
);

-- Relación muchos-a-muchos: menu_items x tags
CREATE TABLE IF NOT EXISTS menu_item_tags (
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES menu_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, tag_id)
);
