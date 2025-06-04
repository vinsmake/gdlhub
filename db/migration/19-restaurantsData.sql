
-- Menú extenso para ID 1 "La Antigua Waffles"
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayunos
(1, 'Waffle Clásico', 'Waffle belga con miel de maple y mantequilla', 89.00, 'Desayuno'),
(1, 'Waffle de Nutella', 'Waffle con Nutella, fresas y plátano', 99.00, 'Desayuno'),
(1, 'Hotcakes', '3 hotcakes con mantequilla y miel', 85.00, 'Desayuno'),
(1, 'Molletes', 'Pan con frijoles refritos, queso gratinado y pico de gallo', 79.00, 'Desayuno'),
(1, 'Omelette Vegetariano', 'Huevos, champiñones, espinaca y queso panela', 90.00, 'Desayuno'),
(1, 'Tostadas Francesas', 'Rebanadas de pan empapadas en huevo y canela, con miel', 95.00, 'Desayuno'),
(1, 'Chilaquiles Verdes', 'Tortilla frita en salsa verde, crema, queso fresco y cebolla', 95.00, 'Desayuno'),
(1, 'Chilaquiles Rojos', 'Con salsa roja, crema, queso y cebolla', 95.00, 'Desayuno'),
(1, 'Huevos al gusto', 'Dos huevos al gusto con frijoles refritos y pan', 75.00, 'Desayuno'),
(1, 'Enmoladas', '3 tortillas rellenas bañadas en mole casero', 99.00, 'Desayuno'),
(1, 'Enfrijoladas', 'Rellenas de queso y bañadas en frijol con crema y cebolla', 89.00, 'Desayuno'),

-- Comidas
(1, 'Hamburguesa de Res', 'Pan artesanal con carne de res, lechuga, jitomate y papas', 130.00, 'Comida'),
(1, 'Hamburguesa Vegetariana', 'Con portobello asado, espinaca y aderezo chipotle', 125.00, 'Comida'),
(1, 'Ensalada César', 'Lechuga romana, aderezo césar, crotones y parmesano', 99.00, 'Comida'),
(1, 'Club Sándwich', 'Pollo, jamón, queso, lechuga y tomate en pan integral', 110.00, 'Comida'),
(1, 'Wrap de Pollo', 'Pollo a la parrilla, lechuga, jitomate y aderezo en tortilla', 105.00, 'Comida'),

-- Repostería
(1, 'Cheesecake de Zarzamora', 'Rebanada de cheesecake artesanal con coulis de zarzamora', 65.00, 'Repostería'),
(1, 'Brownie con Nuez', 'Brownie tibio con nuez y bola de helado', 70.00, 'Repostería'),
(1, 'Panqué de Plátano', 'Con nuez y chispas de chocolate', 60.00, 'Repostería'),

-- Bebidas sin alcohol
(1, 'Café Americano Helado', 'Taza de café de grano recién molido', 35.00, 'Bebida'),
(1, 'Café Latte', 'Espresso con leche vaporizada', 45.00, 'Bebida'),
(1, 'Jugo de Naranja', 'Natural, exprimido al momento', 42.00, 'Bebida'),
(1, 'Té Verde', 'Infusión caliente con miel', 30.00, 'Bebida'),
(1, 'Smoothie de Mango', 'Bebida fría de mango con yogurt natural', 50.00, 'Bebida'),

-- Bebidas con alcohol
(1, 'Carajillo', 'Licor 43 con espresso', 70.00, 'Bebida con alcohol'),
(1, 'Mimosa', 'Jugo de naranja con vino espumoso', 75.00, 'Bebida con alcohol');

-- Categorías
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Waffle Clásico', 'Waffle de Nutella', 'Hotcakes', 'Molletes', 'Omelette Vegetariano',
  'Tostadas Francesas', 'Chilaquiles Verdes', 'Chilaquiles Rojos', 'Huevos al gusto',
  'Enmoladas', 'Enfrijoladas'
) AND restaurant_id = 1;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Hamburguesa de Res', 'Hamburguesa Vegetariana', 'Ensalada César', 'Club Sándwich', 'Wrap de Pollo'
) AND restaurant_id = 1;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Cheesecake de Zarzamora', 'Brownie con Nuez', 'Panqué de Plátano'
) AND restaurant_id = 1;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Café Americano', 'Café Latte', 'Jugo de Naranja', 'Té Verde', 'Smoothie de Mango'
) AND restaurant_id = 1;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Carajillo', 'Mimosa'
) AND restaurant_id = 1;

-- Etiquetas
-- Vegetariano (2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Omelette Vegetariano', 'Hamburguesa Vegetariana', 'Ensalada César', 'Panqué de Plátano'
) AND restaurant_id = 1;

-- Vegano (3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Jugo de Naranja', 'Té Verde', 'Smoothie de Mango'
) AND restaurant_id = 1;

-- Diabética (4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Molletes', 'Enfrijoladas'
) AND restaurant_id = 1;

-- Menú extenso para restaurante con ID 2
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayunos
(2, 'Huevos Rancheros', 'Huevos estrellados sobre tortilla con salsa roja y frijoles refritos', 90.00, 'Desayuno'),
(2, 'Molletes con Tocino', 'Pan bolillo con frijoles, queso, tocino y pico de gallo', 85.00, 'Desayuno'),
(2, 'Hotcakes con Frutas', 'Tres hotcakes con plátano, fresa y miel de maple', 89.00, 'Desayuno'),
(2, 'Omelette de Espinaca', 'Omelette con espinaca, champiñones y queso panela', 92.00, 'Desayuno'),
(2, 'Chilaquiles con Pollo', 'Chilaquiles verdes con crema, queso, cebolla y pollo deshebrado', 98.00, 'Desayuno'),

-- Comidas
(2, 'Ensalada Mediterránea', 'Lechugas mixtas, jitomate cherry, aceituna negra, queso feta', 105.00, 'Comida'),
(2, 'Tacos de Bistec', 'Tres tacos con carne de res asada y guacamole', 110.00, 'Comida'),
(2, 'Hamburguesa Vegana', 'Pan artesanal, medallón de garbanzo, jitomate y lechuga', 120.00, 'Comida'),
(2, 'Bowl Asiático', 'Arroz jazmín, vegetales salteados, tofu y salsa de soya', 108.00, 'Comida'),

-- Cenas
(2, 'Crema de Calabaza', 'Crema de calabaza con crotones y toque de nuez moscada', 75.00, 'Cena'),
(2, 'Pasta Pesto', 'Pasta corta con pesto casero y jitomates deshidratados', 118.00, 'Cena'),
(2, 'Wrap de Pollo al Chipotle', 'Pollo con lechuga, queso y aderezo chipotle en tortilla integral', 100.00, 'Cena'),

-- Repostería
(2, 'Galletas de Mantequilla', 'Galletas caseras con esencia de vainilla', 40.00, 'Repostería'),
(2, 'Pastel de Zanahoria', 'Pastel casero con betún de queso crema', 70.00, 'Repostería'),
(2, 'Brownie Vegano', 'Brownie sin huevo con cocoa, nuez y dátil', 65.00, 'Repostería'),

-- Bebidas sin alcohol
(2, 'Jugo Verde', 'Apio, manzana, piña y espinaca', 48.00, 'Bebida'),
(2, 'Agua de Jamaica', 'Agua fresca natural de flor de jamaica', 25.00, 'Bebida'),
(2, 'Té Chai', 'Té negro con especias y leche caliente', 38.00, 'Bebida'),
(2, 'Smoothie de Fresa', 'Fresa, yogurt y hielo', 52.00, 'Bebida'),

-- Bebidas con alcohol
(2, 'Cerveza Artesanal', 'Botella 355ml de cerveza local', 60.00, 'Bebida con alcohol'),
(2, 'Mezcal con Toronja', 'Mezcal joven con jugo de toronja y escarchado', 85.00, 'Bebida con alcohol'),

-- Entradas
(2, 'Guacamole con Totopos', 'Guacamole casero con totopos de maíz', 70.00, 'Entrada'),
(2, 'Sopa Azteca', 'Tiras de tortilla frita en caldo de jitomate con queso y aguacate', 78.00, 'Entrada'),

-- Temporada
(2, 'Pan de Muerto', 'Pan tradicional azucarado de temporada', 35.00, 'Temporada'),
(2, 'Rosca de Reyes Individual', 'Rebanada individual de rosca rellena de nata', 45.00, 'Temporada');

-- Categorías (ID del 1 al 8)
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Huevos Rancheros', 'Molletes con Tocino', 'Hotcakes con Frutas', 'Omelette de Espinaca', 'Chilaquiles con Pollo'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Ensalada Mediterránea', 'Tacos de Bistec', 'Hamburguesa Vegana', 'Bowl Asiático'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Crema de Calabaza', 'Pasta Pesto', 'Wrap de Pollo al Chipotle'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Galletas de Mantequilla', 'Pastel de Zanahoria', 'Brownie Vegano'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Jugo Verde', 'Agua de Jamaica', 'Té Chai', 'Smoothie de Fresa'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Cerveza Artesanal', 'Mezcal con Toronja'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Guacamole con Totopos', 'Sopa Azteca'
) AND restaurant_id = 2;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Pan de Muerto', 'Rosca de Reyes Individual'
) AND restaurant_id = 2;

-- Opción vegana (ID 1)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Brownie Vegano', 'Hamburguesa Vegana', 'Bowl Asiático'
) AND restaurant_id = 2;

-- Opción vegetariana (ID 2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Pasta Pesto', 'Omelette de Espinaca', 'Galletas de Mantequilla'
) AND restaurant_id = 2;

-- Opción sin gluten (ID 3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Crema de Calabaza', 'Jugo Verde', 'Bowl Asiático'
) AND restaurant_id = 2;

-- Opción diabética (ID 4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Ensalada Mediterránea', 'Guacamole con Totopos', 'Té Chai'
) AND restaurant_id = 2;

-- Menú extenso para restaurante con ID 3
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(3, 'Molletes Integrales', 'Bolillo integral con frijoles, queso panela y pico de gallo', 82.00, 'Desayuno'),
(3, 'Hotcakes de Avena', 'Hotcakes sin harina, con frutas y miel natural', 87.00, 'Desayuno'),
(3, 'Huevos Florentina', 'Huevos pochados sobre espinaca y muffin inglés', 96.00, 'Desayuno'),
(3, 'Tostadas de Aguacate', 'Pan artesanal con aguacate, jitomate y huevo pochado', 93.00, 'Desayuno'),

-- Comida
(3, 'Tacos de Coliflor', 'Coliflor empanizada con col morada y aderezo vegano', 100.00, 'Comida'),
(3, 'Pollo al Limón', 'Pechuga a la plancha con arroz y vegetales al vapor', 125.00, 'Comida'),
(3, 'Ensalada de Garbanzo', 'Garbanzo, espinaca, jitomate, aceitunas y limón', 95.00, 'Comida'),
(3, 'Bowl Mediterráneo', 'Arroz integral, hummus, pepino, jitomate y tofu grillado', 105.00, 'Comida'),

-- Cena
(3, 'Sopa Thai de Coco', 'Leche de coco, champiñones, chile y albahaca', 88.00, 'Cena'),
(3, 'Wrap de Vegetales Asados', 'Tortilla integral con vegetales y hummus', 92.00, 'Cena'),
(3, 'Pasta al Pomodoro', 'Espagueti con salsa de jitomate, albahaca y parmesano', 102.00, 'Cena'),

-- Repostería
(3, 'Brownie de Camote', 'Brownie sin azúcar con camote y cocoa', 66.00, 'Repostería'),
(3, 'Tarta de Manzana', 'Tarta casera con manzana caramelizada y canela', 69.00, 'Repostería'),
(3, 'Galletas de Coco', 'Galletas crujientes hechas con coco rayado', 45.00, 'Repostería'),

-- Bebidas sin alcohol
(3, 'Golden Milk', 'Leche vegetal con cúrcuma, jengibre y canela', 50.00, 'Bebida'),
(3, 'Té de Hierbabuena', 'Infusión natural con hoja fresca de menta', 30.00, 'Bebida'),
(3, 'Smoothie Verde', 'Espinaca, piña, pepino y agua de coco', 55.00, 'Bebida'),
(3, 'Agua de Pepino con Limón', 'Agua fresca natural', 28.00, 'Bebida'),

-- Bebidas con alcohol
(3, 'Clericot Blanco', 'Vino blanco con frutas cítricas', 78.00, 'Bebida con alcohol'),
(3, 'Sangría Artesanal', 'Vino tinto con frutas y toques de especias', 82.00, 'Bebida con alcohol'),

-- Entrada
(3, 'Ensalada Caprese', 'Mozzarella, jitomate y albahaca con aceite de oliva', 75.00, 'Entrada'),
(3, 'Pan Pita con Hummus', 'Pan horneado servido con hummus de garbanzo', 70.00, 'Entrada'),

-- Temporada
(3, 'Tamales Veganos', 'Tamales de elote y rajas sin lácteos', 50.00, 'Temporada'),
(3, 'Ponche Navideño', 'Infusión de frutas de temporada con canela y piloncillo', 40.00, 'Temporada');

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Molletes Integrales', 'Hotcakes de Avena', 'Huevos Florentina', 'Tostadas de Aguacate'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tacos de Coliflor', 'Pollo al Limón', 'Ensalada de Garbanzo', 'Bowl Mediterráneo'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Sopa Thai de Coco', 'Wrap de Vegetales Asados', 'Pasta al Pomodoro'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Brownie de Camote', 'Tarta de Manzana', 'Galletas de Coco'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Golden Milk', 'Té de Hierbabuena', 'Smoothie Verde', 'Agua de Pepino con Limón'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Clericot Blanco', 'Sangría Artesanal'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Ensalada Caprese', 'Pan Pita con Hummus'
) AND restaurant_id = 3;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Tamales Veganos', 'Ponche Navideño'
) AND restaurant_id = 3;

-- Opción vegana (ID 1)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Tacos de Coliflor', 'Brownie de Camote', 'Smoothie Verde', 'Tamales Veganos'
) AND restaurant_id = 3;

-- Opción vegetariana (ID 2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tarta de Manzana', 'Wrap de Vegetales Asados', 'Galletas de Coco'
) AND restaurant_id = 3;

-- Opción sin gluten (ID 3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Sopa Thai de Coco', 'Smoothie Verde', 'Golden Milk'
) AND restaurant_id = 3;

-- Opción diabética (ID 4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Ensalada de Garbanzo', 'Agua de Pepino con Limón', 'Pan Pita con Hummus'
) AND restaurant_id = 3;

-- Menú extenso para restaurante con ID 4
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(4, 'Waffle de Matcha', 'Waffle verde con frutas frescas y miel de agave', 98.00, 'Desayuno'),
(4, 'Tostadas Francesas Integrales', 'Pan integral remojado en leche con canela, horneado', 90.00, 'Desayuno'),
(4, 'Huevos a la Mexicana', 'Huevos revueltos con jitomate, cebolla y chile', 85.00, 'Desayuno'),
(4, 'Parfait de Yogurt', 'Yogurt con granola y frutas de temporada', 72.00, 'Desayuno'),

-- Comida
(4, 'Sándwich de Falafel', 'Pan pita con falafel, lechuga, jitomate y salsa tahini', 105.00, 'Comida'),
(4, 'Burrito Vegetariano', 'Tortilla rellena de arroz, frijoles, aguacate y vegetales', 102.00, 'Comida'),
(4, 'Tostadas de Tinga', 'Tinga de pollo con lechuga, crema y queso', 97.00, 'Comida'),
(4, 'Ensalada de Quinoa', 'Quinoa, pepino, jitomate cherry y limón', 94.00, 'Comida'),

-- Cena
(4, 'Sopa de Lentejas', 'Sopa casera con lentejas, zanahoria y papa', 78.00, 'Cena'),
(4, 'Pizza de Vegetales', 'Base delgada con pimientos, champiñón y cebolla', 115.00, 'Cena'),
(4, 'Pasta Alfredo Vegano', 'Pasta en salsa cremosa de anacardos', 110.00, 'Cena'),

-- Repostería
(4, 'Cheesecake Vegano', 'Hecho con base de nuez y relleno de tofu', 70.00, 'Repostería'),
(4, 'Panqué de Limón', 'Pastelito suave con glaseado de limón natural', 60.00, 'Repostería'),
(4, 'Galletas Integrales', 'Galletas crujientes de avena, sin azúcar añadida', 45.00, 'Repostería'),

-- Bebidas sin alcohol
(4, 'Jugo de Betabel', 'Betabel, manzana y jengibre fresco', 42.00, 'Bebida'),
(4, 'Tisana Fría', 'Infusión natural de frutos rojos servida fría', 38.00, 'Bebida'),
(4, 'Smoothie de Plátano', 'Plátano, leche vegetal y cacao', 48.00, 'Bebida'),
(4, 'Licuado de Papaya', 'Papaya natural con leche baja en grasa', 40.00, 'Bebida'),

-- Bebidas con alcohol
(4, 'Mojito', 'Ron blanco con hierbabuena, azúcar y agua mineral', 75.00, 'Bebida con alcohol'),
(4, 'Michelada de Tamarindo', 'Cerveza preparada con chamoy y tamarindo', 80.00, 'Bebida con alcohol'),

-- Entrada
(4, 'Hummus con Pan Árabe', 'Crema de garbanzo con pimentón y aceite de oliva', 68.00, 'Entrada'),
(4, 'Croquetas de Espinaca', 'Croquetas al horno con espinaca y queso', 74.00, 'Entrada'),

-- Temporada
(4, 'Pan de Cempasúchil', 'Pan suave con flor de cempasúchil y toque de naranja', 50.00, 'Temporada'),
(4, 'Bebida de Ponche Vegano', 'Ponche navideño sin azúcar, con frutas naturales', 45.00, 'Temporada');

-- Categorías (ID 1-8)
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Waffle de Matcha', 'Tostadas Francesas Integrales', 'Huevos a la Mexicana', 'Parfait de Yogurt'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Sándwich de Falafel', 'Burrito Vegetariano', 'Tostadas de Tinga', 'Ensalada de Quinoa'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Sopa de Lentejas', 'Pizza de Vegetales', 'Pasta Alfredo Vegano'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Cheesecake Vegano', 'Panqué de Limón', 'Galletas Integrales'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Jugo de Betabel', 'Tisana Fría', 'Smoothie de Plátano', 'Licuado de Papaya'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Mojito', 'Michelada de Tamarindo'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Hummus con Pan Árabe', 'Croquetas de Espinaca'
) AND restaurant_id = 4;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Pan de Cempasúchil', 'Bebida de Ponche Vegano'
) AND restaurant_id = 4;

-- Etiquetas (ID 1-4)
-- Vegano
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Bowl Mediterráneo', 'Cheesecake Vegano', 'Pasta Alfredo Vegano', 'Bebida de Ponche Vegano'
) AND restaurant_id = 4;

-- Vegetariano
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Parfait de Yogurt', 'Pizza de Vegetales', 'Croquetas de Espinaca'
) AND restaurant_id = 4;

-- Sin gluten
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Jugo de Betabel', 'Smoothie de Plátano', 'Hummus con Pan Árabe'
) AND restaurant_id = 4;

-- Diabético
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Ensalada de Quinoa', 'Galletas Integrales', 'Tisana Fría'
) AND restaurant_id = 4;

-- Menú extenso para restaurante con ID 5
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(5, 'Molletes Veganos', 'Pan integral con frijoles refritos, pico de gallo y aguacate', 82.00, 'Desayuno'),
(5, 'Waffle de Plátano', 'Waffle casero con plátano y miel de agave', 88.00, 'Desayuno'),
(5, 'Hotcakes de Avena', 'Hotcakes integrales con canela y manzana', 90.00, 'Desayuno'),
(5, 'Chilaquiles Morita', 'Tortilla en salsa morita, crema y queso', 92.00, 'Desayuno'),

-- Comida
(5, 'Bowl de Buddha', 'Quinoa, garbanzo, zanahoria y vinagreta', 105.00, 'Comida'),
(5, 'Tacos de Champiñón', 'Champiñón al ajillo en tortilla de maíz', 98.00, 'Comida'),
(5, 'Wrap Mediterráneo', 'Wrap de hummus, pepino, aceituna y espinaca', 100.00, 'Comida'),
(5, 'Ensalada de Couscous', 'Couscous, jitomate, pepino y limón', 95.00, 'Comida'),

-- Cena
(5, 'Crema de Zanahoria', 'Con jengibre y cúrcuma', 70.00, 'Cena'),
(5, 'Pasta Primavera', 'Pasta con vegetales salteados y aceite de oliva', 110.00, 'Cena'),
(5, 'Tostadas de Aguacate', 'Tostadas horneadas con puré de aguacate y lechuga', 85.00, 'Cena'),

-- Repostería
(5, 'Brownie Keto', 'Brownie sin azúcar, con almendra y cocoa', 65.00, 'Repostería'),
(5, 'Panqué de Zanahoria', 'Panqué casero con zanahoria rallada y nuez', 62.00, 'Repostería'),
(5, 'Barritas de Amaranto', 'Amaranto, miel y semilla de girasol', 55.00, 'Repostería'),

-- Bebidas sin alcohol
(5, 'Limonada con Chía', 'Limonada natural con semillas de chía', 30.00, 'Bebida'),
(5, 'Té Blanco', 'Infusión antioxidante suave y natural', 34.00, 'Bebida'),
(5, 'Smoothie Tropical', 'Piña, mango y agua de coco', 52.00, 'Bebida'),
(5, 'Agua de Fresa Natural', 'Infusión fresca sin azúcar', 28.00, 'Bebida'),

-- Bebidas con alcohol
(5, 'Sangría Blanca', 'Vino blanco con frutas tropicales', 80.00, 'Bebida con alcohol'),
(5, 'Gin con Pepino', 'Gin tonic con pepino fresco y menta', 85.00, 'Bebida con alcohol'),

-- Entrada
(5, 'Palitos de Pan Integral', 'Servidos con dip de ajo y oliva', 50.00, 'Entrada'),
(5, 'Mini Ensalada de Espinaca', 'Espinaca, nuez y aderezo balsámico', 58.00, 'Entrada'),

-- Temporada
(5, 'Buñuelos al Horno', 'Buñuelos horneados con azúcar de coco', 45.00, 'Temporada'),
(5, 'Atole de Avena', 'Bebida caliente espesa, sin azúcar refinada', 40.00, 'Temporada');

-- Categorías
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Molletes Veganos', 'Waffle de Plátano', 'Hotcakes de Avena', 'Chilaquiles Morita'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Bowl de Buddha', 'Tacos de Champiñón', 'Wrap Mediterráneo', 'Ensalada de Couscous'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Crema de Zanahoria', 'Pasta Primavera', 'Tostadas de Aguacate'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Brownie Keto', 'Panqué de Zanahoria', 'Barritas de Amaranto'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Limonada con Chía', 'Té Blanco', 'Smoothie Tropical', 'Agua de Fresa Natural'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Sangría Blanca', 'Gin con Pepino'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Palitos de Pan Integral', 'Mini Ensalada de Espinaca'
) AND restaurant_id = 5;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Buñuelos al Horno', 'Atole de Avena'
) AND restaurant_id = 5;

-- Etiquetas
-- Vegano (ID 1)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Molletes Veganos', 'Bowl de Buddha', 'Wrap Mediterráneo', 'Brownie Keto'
) AND restaurant_id = 5;

-- Vegetariano (ID 2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tacos de Champiñón', 'Panqué de Zanahoria', 'Mini Ensalada de Espinaca'
) AND restaurant_id = 5;

-- Sin gluten (ID 3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Crema de Zanahoria', 'Smoothie Tropical', 'Té Blanco'
) AND restaurant_id = 5;

-- Diabético (ID 4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Ensalada de Couscous', 'Barritas de Amaranto', 'Atole de Avena'
) AND restaurant_id = 5;

-- Menú extenso para restaurante con ID 6
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(6, 'Huevos Divorciados', 'Dos huevos con salsa roja y verde, acompañados de frijoles', 85.00, 'Desayuno'),
(6, 'Hotcakes Veganos', 'Hotcakes de avena con plátano y miel de agave', 90.00, 'Desayuno'),
(6, 'Tostadas de Ricotta', 'Tostadas con queso ricotta, espinaca y tomate', 88.00, 'Desayuno'),
(6, 'Smoothie Bowl', 'Base de plátano congelado con toppings de fruta y granola', 95.00, 'Desayuno'),

-- Comida
(6, 'Tacos de Jamaica', 'Flor de jamaica sazonada con cebolla y limón', 89.00, 'Comida'),
(6, 'Curry de Garbanzo', 'Curry suave con arroz integral', 108.00, 'Comida'),
(6, 'Sopa de Tortilla', 'Caldo de jitomate con tiras fritas, aguacate y queso', 92.00, 'Comida'),
(6, 'Lasaña de Calabaza', 'Lasaña vegetal con calabaza y queso vegano', 115.00, 'Comida'),

-- Cena
(6, 'Ramen Vegetariano', 'Fideos en caldo miso con vegetales y huevo cocido', 120.00, 'Cena'),
(6, 'Crema de Espárragos', 'Crema ligera con crotones', 80.00, 'Cena'),
(6, 'Pita de Falafel', 'Pan pita con falafel, lechuga, jitomate y aderezo', 95.00, 'Cena'),

-- Repostería
(6, 'Tarta de Cacao Amargo', 'Tarta con chocolate 70% y base de almendra', 72.00, 'Repostería'),
(6, 'Brownie de Nuez', 'Brownie casero con nuez tostada', 68.00, 'Repostería'),
(6, 'Galletas de Miel', 'Galletas suaves con miel natural', 50.00, 'Repostería'),

-- Bebidas sin alcohol
(6, 'Jugo Antioxidante', 'Zanahoria, naranja y jengibre', 38.00, 'Bebida'),
(6, 'Té Rojo', 'Infusión digestiva natural', 32.00, 'Bebida'),
(6, 'Smoothie de Kiwi', 'Kiwi, plátano y agua de coco', 52.00, 'Bebida'),
(6, 'Limonada con Albahaca', 'Limonada casera con hoja fresca de albahaca', 30.00, 'Bebida'),

-- Bebidas con alcohol
(6, 'Margarita de Pepino', 'Tequila, limón y pepino', 82.00, 'Bebida con alcohol'),
(6, 'Clericot de Sandía', 'Vino rosado con sandía y hierbabuena', 80.00, 'Bebida con alcohol'),

-- Entrada
(6, 'Rollitos de Verdura', 'Rollitos de arroz rellenos de vegetales frescos', 65.00, 'Entrada'),
(6, 'Mini Croquetas de Papa', 'Papa y queso en costra de panko', 68.00, 'Entrada'),

-- Temporada
(6, 'Chiles en Nogada Veganos', 'Pimiento relleno con nogada de nuez y granada', 130.00, 'Temporada'),
(6, 'Pan de Nuez Navideño', 'Bizcocho con nueces y especias de invierno', 55.00, 'Temporada');

-- Categorías
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Huevos Divorciados', 'Hotcakes Veganos', 'Tostadas de Ricotta', 'Smoothie Bowl'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tacos de Jamaica', 'Curry de Garbanzo', 'Sopa de Tortilla', 'Lasaña de Calabaza'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Ramen Vegetariano', 'Crema de Espárragos', 'Pita de Falafel'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Tarta de Cacao Amargo', 'Brownie de Nuez', 'Galletas de Miel'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Jugo Antioxidante', 'Té Rojo', 'Smoothie de Kiwi', 'Limonada con Albahaca'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Margarita de Pepino', 'Clericot de Sandía'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Rollitos de Verdura', 'Mini Croquetas de Papa'
) AND restaurant_id = 6;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Chiles en Nogada Veganos', 'Pan de Nuez Navideño'
) AND restaurant_id = 6;

-- Etiquetas
-- Vegano
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Hotcakes Veganos', 'Tacos de Jamaica', 'Chiles en Nogada Veganos'
) AND restaurant_id = 6;

-- Vegetariano
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Lasaña de Calabaza', 'Ramen Vegetariano', 'Tarta de Cacao Amargo'
) AND restaurant_id = 6;

-- Sin gluten
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Jugo Antioxidante', 'Smoothie Bowl', 'Rollitos de Verdura'
) AND restaurant_id = 6;

-- Diabético
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Galletas de Miel', 'Limonada con Albahaca', 'Pita de Falafel'
) AND restaurant_id = 6;

-- Menú extenso para restaurante con ID 7
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(7, 'Enfrijoladas Caseras', 'Tortillas rellenas de queso con salsa de frijol negro', 88.00, 'Desayuno'),
(7, 'Waffle de Coco', 'Waffle artesanal con crema de coco y frutos rojos', 95.00, 'Desayuno'),
(7, 'Avena Horneada', 'Avena con manzana y canela horneada', 78.00, 'Desayuno'),
(7, 'Huevos Revueltos con Espinaca', 'Huevos con espinaca y jitomate', 85.00, 'Desayuno'),

-- Comida
(7, 'Tacos de Setas', 'Setas al ajillo con guacamole en tortilla de maíz', 92.00, 'Comida'),
(7, 'Ensalada de Betabel y Naranja', 'Betabel asado con naranja, nuez y arúgula', 99.00, 'Comida'),
(7, 'Hamburguesa de Lentejas', 'Pan integral, lentejas y aderezo vegano', 110.00, 'Comida'),
(7, 'Wrap de Pollo Asado', 'Wrap con pollo, lechuga y aderezo de yogurt', 105.00, 'Comida'),

-- Cena
(7, 'Sopa de Tomate y Albahaca', 'Crema ligera con jitomate asado y albahaca fresca', 80.00, 'Cena'),
(7, 'Pizza de Hummus', 'Base delgada con hummus, aceitunas y pimiento', 115.00, 'Cena'),
(7, 'Quiche de Espinaca', 'Tarta salada con espinaca, huevo y queso', 95.00, 'Cena'),

-- Repostería
(7, 'Trufas de Dátiles', 'Bolas de dátil, cacao y nuez', 45.00, 'Repostería'),
(7, 'Muffin de Arándano', 'Muffin artesanal con arándanos frescos', 55.00, 'Repostería'),
(7, 'Galletas de Almendra', 'Galletas sin gluten con almendra molida', 48.00, 'Repostería'),

-- Bebidas sin alcohol
(7, 'Matcha Latte Vegano', 'Matcha con leche de almendra y toque de vainilla', 50.00, 'Bebida'),
(7, 'Té de Limón y Menta', 'Infusión relajante con hierbabuena fresca', 28.00, 'Bebida'),
(7, 'Smoothie de Mora Azul', 'Moras, plátano y yogurt griego', 52.00, 'Bebida'),
(7, 'Agua de Pepino y Chía', 'Agua fresca con rodajas de pepino y semillas de chía', 30.00, 'Bebida'),

-- Bebidas con alcohol
(7, 'Cerveza Artesanal IPA', 'Botella de 355ml con lúpulo intenso', 65.00, 'Bebida con alcohol'),
(7, 'Tinto de Verano', 'Vino tinto con agua mineral y limón', 70.00, 'Bebida con alcohol'),

-- Entrada
(7, 'Dip de Zanahoria Asada', 'Zanahoria con comino y ajo, acompañado de pan', 60.00, 'Entrada'),
(7, 'Capresse en Palillos', 'Mini brochetas con mozzarella, tomate cherry y albahaca', 65.00, 'Entrada'),

-- Temporada
(7, 'Rosca de Reyes Vegana', 'Rosca tradicional sin lácteos ni huevo', 55.00, 'Temporada'),
(7, 'Atole de Guayaba', 'Bebida caliente con guayaba y avena', 40.00, 'Temporada');

-- Categorías
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Enfrijoladas Caseras', 'Waffle de Coco', 'Avena Horneada', 'Huevos Revueltos con Espinaca'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tacos de Setas', 'Ensalada de Betabel y Naranja', 'Hamburguesa de Lentejas', 'Wrap de Pollo Asado'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Sopa de Tomate y Albahaca', 'Pizza de Hummus', 'Quiche de Espinaca'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Trufas de Dátiles', 'Muffin de Arándano', 'Galletas de Almendra'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Matcha Latte Vegano', 'Té de Limón y Menta', 'Smoothie de Mora Azul', 'Agua de Pepino y Chía'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Cerveza Artesanal IPA', 'Tinto de Verano'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Dip de Zanahoria Asada', 'Capresse en Palillos'
) AND restaurant_id = 7;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Rosca de Reyes Vegana', 'Atole de Guayaba'
) AND restaurant_id = 7;

-- Etiquetas
-- Vegano (ID 1)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Tacos de Setas', 'Trufas de Dátiles', 'Matcha Latte Vegano', 'Rosca de Reyes Vegana'
) AND restaurant_id = 7;

-- Vegetariano (ID 2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Enfrijoladas Caseras', 'Pizza de Hummus', 'Quiche de Espinaca'
) AND restaurant_id = 7;

-- Sin gluten (ID 3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Atole de Guayaba', 'Galletas de Almendra', 'Smoothie de Mora Azul'
) AND restaurant_id = 7;

-- Diabético (ID 4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Agua de Pepino y Chía', 'Ensalada de Betabel y Naranja', 'Wrap de Pollo Asado'
) AND restaurant_id = 7;

-- Menú extenso para restaurante con ID 8
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(8, 'Huevos con Nopal', 'Huevos revueltos con nopal y cebolla morada', 85.00, 'Desayuno'),
(8, 'Pan Francés de Canela', 'Pan dorado con miel y rodajas de plátano', 88.00, 'Desayuno'),
(8, 'Avena con Almendras', 'Avena cocida con leche vegetal y almendras tostadas', 78.00, 'Desayuno'),
(8, 'Tamal de Elote', 'Tamal dulce tradicional con crema y queso', 72.00, 'Desayuno'),

-- Comida
(8, 'Tacos Dorados de Papa', 'Tacos fritos con lechuga, crema y salsa verde', 90.00, 'Comida'),
(8, 'Hamburguesa de Garbanzo', 'Pan integral con medallón de garbanzo y mayonesa vegana', 105.00, 'Comida'),
(8, 'Curry Verde con Tofu', 'Curry tailandés suave con tofu y arroz jazmín', 110.00, 'Comida'),
(8, 'Ensalada Thai', 'Col morada, cacahuate, pepino y vinagreta de tamarindo', 95.00, 'Comida'),

-- Cena
(8, 'Pasta Alfredo con Champiñón', 'Pasta en salsa cremosa de almendra con champiñón', 108.00, 'Cena'),
(8, 'Sopa de Nopal', 'Caldo ligero con nopal, jitomate y epazote', 80.00, 'Cena'),
(8, 'Bowl de Verduras Asadas', 'Zanahoria, calabaza y brócoli con aderezo de mostaza', 92.00, 'Cena'),

-- Repostería
(8, 'Galletas de Avena y Plátano', 'Galletas suaves sin azúcar añadida', 45.00, 'Repostería'),
(8, 'Mousse de Chocolate Vegano', 'Postre frío de chocolate con aguacate', 65.00, 'Repostería'),
(8, 'Pan de Dátiles', 'Rebanada de pan dulce con dátiles y nuez', 55.00, 'Repostería'),

-- Bebidas sin alcohol
(8, 'Licuado de Cacao y Coco', 'Cacao natural, leche de coco y plátano', 50.00, 'Bebida'),
(8, 'Té de Cúrcuma', 'Infusión digestiva y antiinflamatoria', 32.00, 'Bebida'),
(8, 'Smoothie Verde Detox', 'Espinaca, pepino, manzana y limón', 52.00, 'Bebida'),
(8, 'Infusión de Lavanda', 'Tisana relajante de lavanda y miel de agave', 30.00, 'Bebida'),

-- Bebidas con alcohol
(8, 'Carajillo Vegano', 'Licor con espresso sobre leche de almendra', 85.00, 'Bebida con alcohol'),
(8, 'Spritz de Toronja', 'Vino espumoso, soda y jugo de toronja', 80.00, 'Bebida con alcohol'),

-- Entrada
(8, 'Dip de Betabel', 'Betabel horneado con aceite de oliva y ajo', 60.00, 'Entrada'),
(8, 'Hojas de Parra Rellenas', 'Arroz, especias y aceite de oliva envueltos en hoja de parra', 70.00, 'Entrada'),

-- Temporada
(8, 'Pan de Muerto Integral', 'Versión integral sin azúcar refinada', 50.00, 'Temporada'),
(8, 'Ponche de Frutas Vegano', 'Infusión caliente de caña, jamaica y frutas de temporada', 42.00, 'Temporada');

-- Categorías
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Huevos con Nopal', 'Pan Francés de Canela', 'Avena con Almendras', 'Tamal de Elote'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tacos Dorados de Papa', 'Hamburguesa de Garbanzo', 'Curry Verde con Tofu', 'Ensalada Thai'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Pasta Alfredo con Champiñón', 'Sopa de Nopal', 'Bowl de Verduras Asadas'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Galletas de Avena y Plátano', 'Mousse de Chocolate Vegano', 'Pan de Dátiles'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Licuado de Cacao y Coco', 'Té de Cúrcuma', 'Smoothie Verde Detox', 'Infusión de Lavanda'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Carajillo Vegano', 'Spritz de Toronja'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Dip de Betabel', 'Hojas de Parra Rellenas'
) AND restaurant_id = 8;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Pan de Muerto Integral', 'Ponche de Frutas Vegano'
) AND restaurant_id = 8;

-- Etiquetas
-- Vegano (ID 1)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Hamburguesa de Garbanzo', 'Mousse de Chocolate Vegano', 'Ponche de Frutas Vegano'
) AND restaurant_id = 8;

-- Vegetariano (ID 2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tamal de Elote', 'Pasta Alfredo con Champiñón', 'Pan Francés de Canela'
) AND restaurant_id = 8;

-- Sin gluten (ID 3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Smoothie Verde Detox', 'Té de Cúrcuma', 'Huevos con Nopal'
) AND restaurant_id = 8;

-- Diabético (ID 4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Avena con Almendras', 'Pan de Dátiles', 'Dip de Betabel'
) AND restaurant_id = 8;

-- Menú extenso para restaurante con ID 9
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
-- Desayuno
(9, 'Tostadas de Aguacate y Huevo', 'Pan artesanal con aguacate, huevo pochado y semillas', 90.00, 'Desayuno'),
(9, 'Omelette de Champiñones', 'Omelette relleno con champiñones salteados y queso', 88.00, 'Desayuno'),
(9, 'Pan de Plátano y Almendra', 'Rebanada dulce servida con crema de cacahuate', 75.00, 'Desayuno'),
(9, 'Yogurt con Fruta y Semillas', 'Natural con frutos rojos, semillas de chía y granola', 80.00, 'Desayuno'),

-- Comida
(9, 'Tacos de Berenjena', 'Tacos suaves con berenjena al grill y salsa de yogurt', 95.00, 'Comida'),
(9, 'Ensalada de Cítricos', 'Toronja, naranja, menta y queso de cabra', 100.00, 'Comida'),
(9, 'Bowl Mediterráneo', 'Arroz integral, hummus, tomate seco y aceitunas negras', 110.00, 'Comida'),
(9, 'Wrap de Ensalada César', 'Pollo, lechuga romana, parmesano y aderezo ligero', 105.00, 'Comida'),

-- Cena
(9, 'Sopa de Elote Asado', 'Crema suave de elote con perejil fresco', 82.00, 'Cena'),
(9, 'Pasta con Salsa Arrabiata', 'Pasta al dente con salsa de jitomate picante', 105.00, 'Cena'),
(9, 'Panini Capresse', 'Pan ciabatta con mozzarella, albahaca y tomate', 92.00, 'Cena'),

-- Repostería
(9, 'Pay de Mango', 'Base de avena con mousse de mango', 60.00, 'Repostería'),
(9, 'Barritas de Dátiles', 'Dátiles, avena, nuez y cocoa prensadas en frío', 50.00, 'Repostería'),
(9, 'Pastel de Chocolate sin Harina', 'Bizcocho intenso sin harina, con cacao amargo', 65.00, 'Repostería'),

-- Bebidas sin alcohol
(9, 'Té Verde con Limón', 'Té ligero con toque cítrico', 32.00, 'Bebida'),
(9, 'Smoothie de Frutas Rojas', 'Fresa, arándano y frambuesa con yogurt', 50.00, 'Bebida'),
(9, 'Agua de Piña con Menta', 'Agua natural infusionada con piña y hoja fresca', 30.00, 'Bebida'),
(9, 'Chocoavena', 'Leche vegetal, cacao, avena y dátil', 48.00, 'Bebida'),

-- Bebidas con alcohol
(9, 'Clericot Cítrico', 'Vino tinto con naranja, limón y toronja', 85.00, 'Bebida con alcohol'),
(9, 'Mojito de Frambuesa', 'Ron, frambuesa, hierbabuena y soda', 82.00, 'Bebida con alcohol'),

-- Entrada
(9, 'Guacamole con Granada', 'Aguacate molido con jugo de limón y granada fresca', 68.00, 'Entrada'),
(9, 'Bruschettas de Tomate Seco', 'Pan tostado con tomate seco, ajo y albahaca', 70.00, 'Entrada'),

-- Temporada
(9, 'Pay de Calabaza', 'Postre de calabaza especiada sobre base crujiente', 55.00, 'Temporada'),
(9, 'Chocolate Caliente Artesanal', 'Chocolate espeso con canela y vainilla', 45.00, 'Temporada');

-- Categorías
INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Tostadas de Aguacate y Huevo', 'Omelette de Champiñones', 'Pan de Plátano y Almendra', 'Yogurt con Fruta y Semillas'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Tacos de Berenjena', 'Ensalada de Cítricos', 'Bowl Mediterráneo', 'Wrap de Ensalada César'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Sopa de Elote Asado', 'Pasta con Salsa Arrabiata', 'Panini Capresse'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Pay de Mango', 'Barritas de Dátiles', 'Pastel de Chocolate sin Harina'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 5 FROM menu_items WHERE name IN (
  'Té Verde con Limón', 'Smoothie de Frutas Rojas', 'Agua de Piña con Menta', 'Chocoavena'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 6 FROM menu_items WHERE name IN (
  'Clericot Cítrico', 'Mojito de Frambuesa'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 7 FROM menu_items WHERE name IN (
  'Guacamole con Granada', 'Bruschettas de Tomate Seco'
) AND restaurant_id = 9;

INSERT INTO menu_item_categories (menu_item_id, category_id) SELECT id, 8 FROM menu_items WHERE name IN (
  'Pay de Calabaza', 'Chocolate Caliente Artesanal'
) AND restaurant_id = 9;

-- Etiquetas
-- Vegano (ID 1)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 1 FROM menu_items WHERE name IN (
  'Bowl Mediterráneo', 'Barritas de Dátiles', 'Chocoavena'
) AND restaurant_id = 9;

-- Vegetariano (ID 2)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 2 FROM menu_items WHERE name IN (
  'Ensalada de Cítricos', 'Pay de Mango', 'Panini Capresse'
) AND restaurant_id = 9;

-- Sin gluten (ID 3)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 3 FROM menu_items WHERE name IN (
  'Pastel de Chocolate sin Harina', 'Agua de Piña con Menta', 'Chocolate Caliente Artesanal'
) AND restaurant_id = 9;

-- Diabético (ID 4)
INSERT INTO menu_item_tags (menu_item_id, tag_id) SELECT id, 4 FROM menu_items WHERE name IN (
  'Tostadas de Aguacate y Huevo', 'Barritas de Dátiles', 'Té Verde con Limón'
) AND restaurant_id = 9;
