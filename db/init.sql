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
