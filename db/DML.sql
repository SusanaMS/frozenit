-- frozenit.users
INSERT INTO frozenit.users (email, pass, username) VALUES
('anasus@gmail.com', '12345', 'Susana'),
('prueba@gmail.com', '54321', 'Maria');
INSERT INTO frozenit.users VALUES
('administrador@gmail.com', 'adm123', 'Admin', NULL, NULL, TRUE, NULL, TRUE);

-- frozenit.freezer
INSERT INTO frozenit.freezer (users_email) VALUES ('anasus@gmail.com');
INSERT INTO frozenit.freezer VALUES
(NULL, 'prueba@gmail.com', 'Congelador Casa', 'Siemens', '4502B', 5, 4, 'Slot 2 roto');

-- frozenit.categories
INSERT INTO  frozenit.categories VALUES
('Verduras', 180, 'Evitar piezas completas'),
('Carne', 360, NULL);

-- frozenit.foods
INSERT INTO frozenit.foods VALUES
(NULL, 'Pimientos', 'Verduras',  'Trocear'),
(NULL, 'Pollo', 'Carne', NULL);

-- frozenit.records
INSERT INTO frozenit.records VALUES
(NULL, 'anasus@gmail.com', 1, 1, 1, CURDATE(), CURDATE() + INTERVAL 180 DAY, CURDATE(), FALSE, NULL);

-- frozenit.alerts
INSERT INTO frozenit.alerts VALUES
    ('CRITICAL', 7, 'alimento muy cerca de la fecha de caducidad'),
    ('WARNING', 30, 'alimento a planificar para descongelar');
