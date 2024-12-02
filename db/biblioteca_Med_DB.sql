DROP DATABASE IF EXISTS biblioteca_med;
CREATE DATABASE biblioteca_med;
USE biblioteca_med;

-- TABLAS
-- Tabla Libros
CREATE TABLE Libro(
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
	codigo VARCHAR(20) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    anio_publicacion YEAR NOT NULL,
    idioma VARCHAR(50) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
    );
    
-- Tabla Usuarios (socios)
CREATE TABLE Usuario(
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
direccion VARCHAR(255),
telefono VARCHAR(20),
correo VARCHAR(100),
fecha_registro DATE NOT NULL
);
-- Tabla Autor
CREATE TABLE Autor(
    id_autor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50)
);

CREATE TABLE Editorial (
    id_editorial INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pais VARCHAR(50)
);

CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE Prestamo (
    id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_prestamo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion TIMESTAMP NOT NULL,
    estado ENUM('activo', 'devuelto','atrasado') NOT NULL DEFAULT 'activo',
    total_libros INT DEFAULT 0,
	id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
    );

CREATE TABLE Detalles_prestamo(
 id_detalles INT AUTO_INCREMENT PRIMARY KEY,
 id_libro INT NOT NULL,
 id_prestamo INT NOT NULL,
 FOREIGN KEY (id_libro) REFERENCES Libro(id_libro),
 FOREIGN KEY (id_prestamo) REFERENCES Prestamo(id_prestamo)
);

-- Tablas intermedias
-- Libro - Autor (un libro puede tener varios autores y un autor puede haber escrito varios libros)

CREATE TABLE Libro_autor(
id_libro INT NOT NULL,
id_autor INT NOT NULL,
PRIMARY KEY (id_libro, id_autor),
FOREIGN KEY (id_libro) REFERENCES Libro(id_libro),
FOREIGN KEY (id_autor) REFERENCES Autor(id_autor)
);

CREATE TABLE Libro_categoria (
    id_libro INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_libro, id_categoria),
    FOREIGN KEY (id_libro) REFERENCES Libro(id_libro),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
);

CREATE TABLE Libro_editorial (
    id_libro INT NOT NULL,
    id_editorial INT NOT NULL,
    PRIMARY KEY (id_libro, id_editorial),
    FOREIGN KEY (id_libro) REFERENCES Libro(id_libro),
    FOREIGN KEY (id_editorial) REFERENCES Editorial(id_editorial)
);

-- Insertar datos --
INSERT INTO Usuario (nombre, apellido, direccion, telefono, correo, fecha_registro) 
VALUES 
('Juan', 'Pérez', 'Av. Siempre Viva 123', '123456789', 'juan.perez@mail.com', '2023-01-15'),
('María', 'González', 'Calle Falsa 456', '987654321', 'maria.gonzalez@mail.com', '2023-02-10'),
('Luis', 'Rodríguez', 'Pasaje Los Olivos 789', '456789123', 'luis.rodriguez@mail.com', '2023-03-20'),
('Ana', 'Martínez', 'Boulevard Central 321', '321654987', 'ana.martinez@mail.com', '2023-05-25');

INSERT INTO Libro(codigo, titulo, anio_publicacion, idioma, disponible) 
VALUES 
('LIB001', 'Principios de Anatomía y Fisiología', 2019, 'Español', TRUE),
('LIB002', 'Hitology', 2020, 'Inglés', TRUE),
('LIB003', 'Manual de Enfermería', 2018, 'Español', TRUE),
('LIB004', 'Cardiología Clínica', 2021, 'Español', TRUE),
('LIB005', 'Microbiology Fundamentals', 2017, 'Inglés', FALSE);

INSERT INTO Autor(nombre, apellido, nacionalidad)
VALUES 
('Gerard', 'Tortora', 'Estadounidense'),
('Richard', 'Drake', 'Británico'),
('Karen', 'Whalen', 'Canadiense'),
('Robert', 'Bonow', 'Estadounidense'),
('Facundo', 'Manes', 'Argentino');

INSERT INTO Editorial(nombre, pais)
VALUES
('Editorial Médica Panamericana', 'España'),
('Elsevier', 'Reino Unido'),
('McGraw-Hill', 'Estados Unidos'),
('Springer', 'Alemania');

INSERT INTO Categoria(nombre_categoria)
VALUES 
('Patología'),
('Anatomía'),
('Fisiología'),
('Enfermería'),
('Cardiología'),
('Microbiología');

INSERT INTO Prestamo (fecha_prestamo, fecha_devolucion, estado, total_libros, id_usuario) 
VALUES
('2024-11-01 10:30:00', '2024-11-15 10:30:00', 'activo', 2, 1);

INSERT INTO Detalles_prestamo(id_libro, id_prestamo)
VALUES 
(5,1);

-- Tablas intermedias (Datos)

INSERT INTO Libro_autor (id_libro, id_autor) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 1);

INSERT INTO Libro_categoria (id_libro, id_categoria) 
VALUES 
(1, 1),
(2, 1),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO Libro_editorial (id_libro, id_editorial) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 1);

-- Consultas----
SELECT * FROM libro;
SELECT * FROM usuario;
SELECT * FROM autor;
SELECT * FROM editorial;
SELECT * FROM prestamo;
SELECT * FROM libro_autor;
SELECT * FROM libro_categoria;

-- Consulta completa de todos los libros (Listar/Read) 
SELECT L.codigo as "Código ISBN", 
L.titulo as "Titulo",
L.anio_publicacion as "Año de publicación",
L.idioma as "Idioma", 
L.disponible as "Disponible", 
group_concat(concat(A.nombre, ' ', A.apellido) separator ', ') as "Autor/es", 
E.nombre as "Editorial",
C.nombre_categoria as "Categoría"
FROM libro L
JOIN libro_autor LA ON L.id_libro = LA.id_libro
JOIN autor A ON LA.id_autor = A.id_autor
JOIN libro_editorial LE ON L.id_libro = LE.id_libro
JOIN editorial E ON LE.id_editorial = E.id_editorial
JOIN libro_categoria LC ON L.id_libro = LC.id_libro
JOIN categoria C ON LC.id_libro = C.id_categoria
GROUP BY L.id_libro, E.nombre, C.nombre_categoria;

-- Consulta completa de todos los préstamos existentes
SELECT P.id_prestamo,
 P.Fecha_prestamo as "Fecha de préstamo" ,
 P.Fecha_devolucion as "Fecha de devolución",
 P.Estado, P.total_libros as "Total de libros" FROM prestamo P
JOIN detalles_prestamo DP ON P.id_prestamo = DP.id_prestamo
JOIN Libro L ON DP.id_libro = L.id_libro;

-- Consulta completa de todos los préstamos activos de un usuario
SELECT P.id_prestamo,
 P.Fecha_prestamo as "Fecha de préstamo" ,
 P.Fecha_devolucion as "Fecha de devolución",
 P.Estado, P.total_libros as "Total de libros" FROM prestamo P
JOIN detalles_prestamo DP ON P.id_prestamo = DP.id_prestamo
JOIN Libro L ON DP.id_libro = L.id_libro
WHERE P.id_usuario = 1 AND P.Estado = 'Activo';

-- Consulta completa de todos los préstamos activos existentes
SELECT P.id_prestamo,
 P.Fecha_prestamo as "Fecha de préstamo" ,
 P.Fecha_devolucion as "Fecha de devolución",
 P.Estado, P.total_libros as "Total de libros" FROM prestamo P
JOIN detalles_prestamo DP ON P.id_prestamo = DP.id_prestamo
JOIN Libro L ON DP.id_libro = L.id_libro
WHERE P.Estado = 'Activo';

-- Procedimientos --
-- -------------------------------------------------------------LIBROS------------------------------------------------------------------
-- CREATE LIBROS - Registrar libros (ingreso de nuevos libros)
DELIMITER //
CREATE PROCEDURE registrar_libro(
    IN p_codigo VARCHAR(20),
    IN p_titulo VARCHAR(200),
    IN p_anio_publicacion YEAR,
    IN p_idioma VARCHAR(50),
    IN p_disponible BOOLEAN,
    IN p_nombre_autor VARCHAR(100),
    IN p_apellido_autor VARCHAR(100),
    IN p_nacionalidad_autor VARCHAR(50),
    IN p_nombre_editorial VARCHAR(100),
    IN p_pais_editorial VARCHAR(50),
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
DECLARE v_id_libro INT;
DECLARE v_id_autor INT;
DECLARE v_id_editorial INT;
DECLARE v_id_categoria INT;

INSERT INTO Libro (codigo, titulo, anio_publicacion, idioma, disponible)
VALUES (p_codigo, p_titulo, p_anio_publicacion, p_idioma, p_disponible);
SET v_id_libro = LAST_INSERT_ID();

-- Insertar autor si no existe
INSERT INTO Autor(nombre,apellido,nacionalidad)
VALUES (p_nombre_autor, p_apellido_autor, p_nacionalidad_autor)
ON DUPLICATE KEY UPDATE id_autor= LAST_INSERT_ID(id_autor);
SET v_id_autor = LAST_INSERT_ID();

-- Insertar editorial si no existe
INSERT INTO Editorial(nombre, pais)
VALUES (p_nombre_editorial, p_pais_editorial)
ON DUPLICATE KEY UPDATE id_editorial = LAST_INSERT_ID(id_editorial);
SET v_id_editorial = LAST_INSERT_ID();

-- Insertar cateogorías si no existe
INSERT INTO Categoria(nombre_categoria)
VALUES(p_nombre_categoria)
ON DUPLICATE KEY UPDATE id_categoria = LAST_INSERT_ID(id_categoria);
SET v_id_categoria = LAST_INSERT_ID();

-- Insertar en las tablas intermedias (relaciones)
INSERT INTO Libro_autor (id_libro, id_autor)
VALUES (v_id_libro, v_id_autor);

INSERT INTO Libro_editorial (id_libro, id_editorial)
VALUES (v_id_libro, v_id_editorial);

INSERT INTO Libro_categoria(id_libro, id_categoria)
VALUES (v_id_libro, v_id_categoria);
END;
// DELIMITER ;

-- UPDATE LIBROS - Actualizar datos de libros existentes
DELIMITER //
CREATE PROCEDURE actualizar_libro(
IN p_id_libro INT,
IN p_codigo VARCHAR(20),
IN p_titulo VARCHAR(200),
IN p_anio_publicacion YEAR,
IN p_idioma VARCHAR(50),
IN p_disponible BOOLEAN,
IN p_nombre_autor VARCHAR(100),
IN p_apellido_autor VARCHAR(100),
IN p_nacionalidad_autor VARCHAR(50),
IN p_nombre_editorial VARCHAR(100),
IN p_pais_editorial VARCHAR(50),
IN p_nombre_categoria VARCHAR(100)
)
BEGIN
DECLARE v_id_autor INT;
DECLARE v_id_editorial INT;
DECLARE v_id_categoria INT;

UPDATE Libro
SET codigo = p_codigo,
titulo = p_titulo,
anio_publicacion = p_anio_publicacion,
idioma = p_idioma,
disponible = p_disponible
WHERE id_libro = p_id_libro;

-- Insertar autor si no existe, o actualizar si ya existe
INSERT INTO Autor(nombre, apellido, nacionalidad)
VALUES (p_nombre_autor, p_apellido_autor, p_nacionalidad_autor)
ON DUPLICATE KEY UPDATE id_autor = LAST_INSERT_ID(id_autor);
SET v_id_autor = LAST_INSERT_ID();

-- Insertar editorial si no existe, o actualizar si ya existe
INSERT INTO Editorial(nombre, pais)
VALUES (p_nombre_editorial, p_pais_editorial)
ON DUPLICATE KEY UPDATE id_editorial = LAST_INSERT_ID(id_editorial);
SET v_id_editorial = LAST_INSERT_ID();

-- Insertar categoría si no existe, o actualizar si ya existe
INSERT INTO Categoria(nombre_categoria)
VALUES (p_nombre_categoria)
ON DUPLICATE KEY UPDATE id_categoria = LAST_INSERT_ID(id_categoria);
SET v_id_categoria = LAST_INSERT_ID();

-- Actualizar las tablas intermedias
UPDATE Libro_autor
SET id_autor = v_id_autor
WHERE id_libro = p_id_libro;

UPDATE Libro_editorial
SET id_editorial = v_id_editorial
WHERE id_libro = p_id_libro;

UPDATE Libro_categoria
SET id_categoria = v_id_categoria
WHERE id_libro = p_id_libro;
END
// DELIMITER

-- Ver lista de libros no disponibles (Consulta)
DELIMITER //
CREATE PROCEDURE lista_nodisponible(
p_libro_no_disp INT
)
BEGIN SELECT * FROM Libro WHERE disponible = FALSE;
END
//DELIMITER ;

