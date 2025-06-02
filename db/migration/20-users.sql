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
