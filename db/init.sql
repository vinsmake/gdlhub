-- init.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  avatar VARCHAR(255),
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

-- Datos de prueba para usuarios con imagen
INSERT INTO users (name, email, avatar)
VALUES 
  ('Enrique Plascencia', 'Enrique@example.com', 'pc1.jpg'),
  ('Usuario 2', 'user2@example.com', 'pc2.jpg'),
  ('Usuario 3', 'user3@example.com', 'pc3.jpg'),
  ('Usuario 4', 'user4@example.com', 'pc4.jpg'),
  ('Usuario 5', 'user5@example.com', 'pc5.jpg'),
  ('Usuario 6', 'user6@example.com', 'pc6.jpg'),
  ('Usuario 7', 'user7@example.com', 'pc7.jpg'),
  ('Usuario 8', 'user8@example.com', 'pc8.jpg'),
  ('Usuario 9', 'user9@example.com', 'pc9.jpg');

-- Datos de prueba para restaurantes
INSERT INTO restaurants (name, description, address, maps)
VALUES 
  ('La Antigua Waffles', 'Waffles, chilaquiles, huevos y cafe', 'Calle Prisciliano Sánchez 1003, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.925599103906!2d-103.36371532390382!3d20.67260569991436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae024e19f1af%3A0x400e571a57c7efba!2sLa%20Antigua%20Waffles!5e0!3m2!1ses-419!2smx!4v1746637410380!5m2!1ses-419!2smx'),
  ('La Casa Del Waffle', 'Waffles y desayunos', 'Libertad 1705, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.9465829408123!2d-103.36535902390385!3d20.671752099943227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae03bf3bd315%3A0x2dda495087098309!2sLa%20Casa%20Del%20Waffle%20-%20Libertad!5e0!3m2!1ses-419!2smx!4v1746638245249!5m2!1ses-419!2smx'),
  ('La Cafetería (Casa fuera de casa)', 'Café, panadería artesanal y ambiente acogedor', 'Libertad 1700, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1866.4670123448298!2d-103.36277020068862!3d20.67226296017555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae03bbc15555%3A0x660efa125fe9bc13!2sLa%20Cafeter%C3%ADa%20(Casa%20fuera%20de%20casa)!5e0!3m2!1ses-419!2smx!4v1746639057207!5m2!1ses-419!2smx'),
  ('RinTinTin Café', 'Especialidad en café de origen y repostería casera', 'C. Venezuela 443, La Americana, Americana, 44170 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1866.4670118553306!2d-103.3627702!3d20.672263!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae1cb556644b%3A0x8c46942052abe1d7!2sRinTinTin%20Caf%C3%A9!5e0!3m2!1ses-419!2smx!4v1746639079259!5m2!1ses-419!2smx'),
  ('Membrillo Cocina', 'Desayunos mexicanos, cocina fusión y jugos naturales', 'Libertad 1760, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.925354482451!2d-103.3684639131526!3d20.67261565065393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428af02adac0ef5%3A0x313920ff9e99fddc!2sMembrillo%20Cocina!5e0!3m2!1ses-419!2smx!4v1746639133715!5m2!1ses-419!2smx'),
  ('El Terrible Juan Café', 'Café de especialidad, desayunos y ambiente urbano', 'C. Colonias 440, Col Americana, Americana, 44160 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3732.9447251087704!2d-103.37118214720336!3d20.671827675917307!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae06a535bd89%3A0x1d7fdbe2c158ed3e!2sEl%20Terrible%20Juan%20Caf%C3%A9!5e0!3m2!1ses-419!2smx!4v1746639156613!5m2!1ses-419!2smx'),
  ('En Punto. Barra de Café', 'Café de especialidad, repostería y espacio minimalista', 'C. Juan Ruiz de Alarcón 211, Col Americana, Obrera, 44140 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.964164061814!2d-103.3808608353138!3d20.671036892853262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae0c2090ccad%3A0xf046784f89bb440f!2sEn%20Punto.%20Barra%20de%20Caf%C3%A9!5e0!3m2!1ses-419!2smx!4v1746641095076!5m2!1ses-419!2smx'),
  ('Espacio Abierto', 'Cafetería artística con mobiliario compartido y relajado', 'C. Simón Bolívar 320, Col Americana, Obrera, 44140 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3732.9376383166427!2d-103.37236290021342!3d20.672115961778882!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428af07cf001fe9%3A0x38122fe76e32a3a7!2sEspacio%20Abierto!5e0!3m2!1ses-419!2smx!4v1746641117615!5m2!1ses-419!2smx'),
  ('Como si fuera Domingo', 'Desayunos lentos, pan artesanal y ambiente nostálgico', 'C. Manuel López Cotilla 1476, Col Americana, Arcos Vallarta, 44150 Guadalajara, Jal.', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3732.9376383166427!2d-103.37236290021342!3d20.672115961778882!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428ae056edcce37%3A0x15dcf2a2c25b977d!2sComo%20si%20fuera%20Domingo!5e0!3m2!1ses-419!2smx!4v1746641135163!5m2!1ses-419!2smx');

-- Especialidades por restaurante (máx 5)
CREATE TABLE IF NOT EXISTS specialties (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- Platillos favoritos de usuario (máx 5)
CREATE TABLE IF NOT EXISTS favorite_dishes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- Bebidas favoritas de usuario (máx 5)
CREATE TABLE IF NOT EXISTS favorite_drinks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- Usuario sigue a usuario
CREATE TABLE IF NOT EXISTS user_follows_user (
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, followed_id)
);

-- Usuario sigue a restaurante
CREATE TABLE IF NOT EXISTS user_follows_restaurant (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, restaurant_id)
);

INSERT INTO specialties (restaurant_id, name)
VALUES
  (1, 'Waffles'),
  (1, 'Chilaquiles'),
  (1, 'Huevos al gusto'),
  (1, 'Café de olla'),
  (1, 'Pan francés'),

  (2, 'Waffles clásicos'),
  (2, 'Jugos naturales'),
  (2, 'Molletes'),
  (2, 'Hot cakes'),
  (2, 'Frutas'),

  (3, 'Café artesanal'),
  (3, 'Panadería casera'),
  (3, 'Té matcha'),
  (3, 'Canelitas'),
  (3, 'Croissants'),

  (4, 'Repostería casera'),
  (4, 'Cold brew'),
  (4, 'Café de origen'),
  (4, 'Brownies'),
  (4, 'Tarta de nuez'),

  (5, 'Huevos a la mexicana'),
  (5, 'Jugo verde'),
  (5, 'Tamal de cazuela'),
  (5, 'Tostadas gourmet'),
  (5, 'Chai latte'),

  (6, 'Pan con aguacate'),
  (6, 'Expresso doble'),
  (6, 'Smoothie bowl'),
  (6, 'Sandwich de tocino'),
  (6, 'Huevos benedictinos'),

  (7, 'Macarons'),
  (7, 'Flat white'),
  (7, 'Café V60'),
  (7, 'Pan de elote'),
  (7, 'Café turco'),

  (8, 'Tisana'),
  (8, 'Pan de plátano'),
  (8, 'Café americano'),
  (8, 'Matcha latte'),
  (8, 'Croissant de almendra'),

  (9, 'Huevos rancheros'),
  (9, 'Café capuchino'),
  (9, 'Bollería dulce'),
  (9, 'Té negro'),
  (9, 'Sándwich mixto');

INSERT INTO favorite_dishes (user_id, name)
VALUES
  (1, 'Birria'),
  (1, 'Molletes'),
  (1, 'Tacos al pastor'),
  (1, 'Chilaquiles verdes'),
  (1, 'Torta ahogada'),

  (2, 'Enfrijoladas'),
  (2, 'Hot cakes'),
  (2, 'Huevos con jamón'),
  (2, 'Pan francés'),
  (2, 'Waffles de frutas'),

  (3, 'Tostadas de ceviche'),
  (3, 'Tamales'),
  (3, 'Huevos divorciados'),
  (3, 'Molletes'),
  (3, 'Pan dulce');

INSERT INTO favorite_drinks (user_id, name)
VALUES
  (1, 'Café americano'),
  (1, 'Té chai'),
  (1, 'Agua de horchata'),
  (1, 'Jugo de naranja'),
  (1, 'Latte'),

  (2, 'Té verde'),
  (2, 'Capuchino'),
  (2, 'Smoothie de fresa'),
  (2, 'Café helado'),
  (2, 'Agua mineral'),

  (3, 'Chocolate caliente'),
  (3, 'Espresso'),
  (3, 'Tisana frutal'),
  (3, 'Jugo detox'),
  (3, 'Café con leche');

INSERT INTO user_follows_user (follower_id, followed_id)
VALUES
  (1, 2),
  (1, 3),
  (1, 4),
  (2, 1),
  (3, 1),
  (4, 1),
  (2, 3),
  (3, 4),
  (4, 2);

INSERT INTO user_follows_restaurant (user_id, restaurant_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 4),
  (2, 5),
  (3, 2),
  (3, 3),
  (3, 6),
  (4, 1),
  (4, 7);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(6,2),
  category VARCHAR(50),
  image VARCHAR(255)   
);

-- Restaurante 1: La Antigua Waffles
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (1, 'Waffle Clásico', 'Waffle belga con miel de maple y mantequilla', 89.00, 'Desayuno'),
  (1, 'Chilaquiles Verdes', 'Tortilla crujiente con salsa verde, crema y queso fresco', 95.00, 'Desayuno'),
  (1, 'Huevos al gusto', 'Dos huevos al gusto con frijoles refritos y pan', 75.00, 'Desayuno'),
  (1, 'Café Americano', 'Taza de café de grano recién molido', 35.00, 'Bebida'),
  (1, 'Jugo de Naranja', 'Jugo exprimido al momento, 100% natural', 42.00, 'Bebida');

-- Restaurante 2: La Casa Del Waffle
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (2, 'Hot Cakes con fruta', 'Hot cakes acompañados de fruta de temporada', 78.00, 'Desayuno'),
  (2, 'Molletes', 'Bolillo con frijoles, queso gratinado y pico de gallo', 65.00, 'Desayuno'),
  (2, 'Capuchino', 'Café expreso con leche vaporizada', 45.00, 'Bebida'),
  (2, 'Huevos Rancheros', 'Huevos montados sobre tortilla y bañados en salsa roja', 88.00, 'Desayuno'),
  (2, 'Smoothie de Plátano', 'Bebida natural de plátano y leche vegetal', 52.00, 'Bebida');

-- Restaurante 3: La Cafetería (Casa fuera de casa)
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (3, 'Panadería Artesanal', 'Selección del día de pan dulce recién horneado', 25.00, 'Postre'),
  (3, 'Café de Olla', 'Café tradicional con canela y piloncillo', 38.00, 'Bebida'),
  (3, 'Té Chai', 'Té especiado con leche vaporizada', 48.00, 'Bebida'),
  (3, 'Ensalada Mediterránea', 'Mix de hojas verdes con aceitunas y queso feta', 79.00, 'Comida ligera'),
  (3, 'Tostadas de Aguacate', 'Pan artesanal con aguacate, tomate y huevo pochado', 72.00, 'Desayuno');

-- Restaurante 4: RinTinTin Café
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (4, 'Brownie Casero', 'Brownie de chocolate con nuez', 42.00, 'Postre'),
  (4, 'Cold Brew', 'Café extraído en frío por 12 horas', 49.00, 'Bebida'),
  (4, 'Café de Especialidad', 'Grano seleccionado por finca y método', 55.00, 'Bebida'),
  (4, 'Bagel con Salmón', 'Bagel con queso crema, salmón y alcaparras', 98.00, 'Comida ligera'),
  (4, 'Yogurt con granola', 'Yogurt natural, fruta fresca y granola casera', 58.00, 'Desayuno');

-- Restaurante 5: Membrillo Cocina
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (5, 'Tamal de cazuela', 'Tamal tradicional con carne de cerdo en salsa', 69.00, 'Desayuno'),
  (5, 'Jugo Verde', 'Nopal, piña, apio y limón', 42.00, 'Bebida'),
  (5, 'Tostadas de tinga', 'Tinga de pollo sobre tostada crujiente', 65.00, 'Comida ligera'),
  (5, 'Agua de Jamaica', 'Infusión de flor de jamaica natural', 30.00, 'Bebida'),
  (5, 'Chilaquiles con arrachera', 'Chilaquiles rojos acompañados de arrachera', 115.00, 'Desayuno');

-- Restaurante 6: El Terrible Juan Café
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (6, 'Latte', 'Café con leche suave y cremoso', 42.00, 'Bebida'),
  (6, 'Tostada Francesa', 'Pan brioche con canela, miel y fruta fresca', 69.00, 'Desayuno'),
  (6, 'Club Sandwich', 'Sándwich triple con jamón, queso y vegetales', 85.00, 'Comida'),
  (6, 'Brownie con helado', 'Brownie tibio con bola de vainilla', 58.00, 'Postre'),
  (6, 'Limonada', 'Bebida cítrica natural con toque de hierbabuena', 35.00, 'Bebida');

-- Restaurante 7: En Punto. Barra de Café
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (7, 'Flat White', 'Café con leche texturizada estilo australiano', 45.00, 'Bebida'),
  (7, 'Pan de Plátano', 'Rebanada de pan de plátano casero', 28.00, 'Postre'),
  (7, 'Espresso', 'Shot de café intenso', 30.00, 'Bebida'),
  (7, 'Sandwich de Pavo', 'Pavo natural, lechuga y aderezo de mostaza miel', 78.00, 'Comida'),
  (7, 'Té Matcha', 'Infusión verde con leche vegetal', 52.00, 'Bebida');

-- Restaurante 8: Espacio Abierto
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (8, 'Café Americano', 'Taza de café filtrado', 32.00, 'Bebida'),
  (8, 'Croissant de Almendra', 'Croissant relleno y horneado con almendra', 46.00, 'Postre'),
  (8, 'Tisana de Frutas', 'Infusión caliente de frutos rojos', 40.00, 'Bebida'),
  (8, 'Tostada de Hummus', 'Hummus, jitomate cherry y paprika', 64.00, 'Comida ligera'),
  (8, 'Ensalada Fresca', 'Hojas verdes con vinagreta cítrica', 59.00, 'Comida');

-- Restaurante 9: Como si fuera Domingo
INSERT INTO menu_items (restaurant_id, name, description, price, category)
VALUES
  (9, 'Huevos Rancheros', 'Huevos sobre tortilla con salsa roja y frijoles', 88.00, 'Desayuno'),
  (9, 'Pan artesanal', 'Rebanadas de pan recién horneado', 22.00, 'Postre'),
  (9, 'Chocolate caliente', 'Chocolate espeso estilo tradicional', 48.00, 'Bebida'),
  (9, 'Panque de Nuez', 'Rebanada de panque casero con nuez', 34.00, 'Postre'),
  (9, 'Café con leche', 'Café con leche vaporizada', 36.00, 'Bebida');
