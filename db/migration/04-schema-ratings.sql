-- Relación muchos-a-muchos: users x menu_items (favoritos)
CREATE TABLE IF NOT EXISTS restaurant_ratings (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, restaurant_id)
);