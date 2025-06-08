ALTER TABLE users ADD COLUMN password_hash TEXT;
-- Datos de prueba para usuarios con imagen
INSERT INTO users (name, email, avatar, password_hash)
VALUES 
  ('Enrique Plascencia', 'enrique@example.com', 'pc1.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('María Ramírez', 'maria@example.com', 'pc2.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Laura Torres', 'laura@example.com', 'pc3.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Carlos Mendoza', 'carlos@example.com', 'pc4.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Andrea López', 'andrea@example.com', 'pc5.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Jorge Salazar', 'jorge@example.com', 'pc6.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Luis Navarro', 'luis@example.com', 'pc7.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Fernando Reyes', 'fernando@example.com', 'pc8.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Ricardo Herrera', 'ricardo@example.com', 'pc9.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK'),
  ('Ana Morales', 'ana@example.com', 'pc10.jpg', '$2b$10$MGzduUOYY3MqSTlPP6uPtu/8XvMz4jZ24fQ/87Iwu1gIbyx3Xu.FK');


