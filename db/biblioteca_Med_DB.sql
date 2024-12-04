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
('LIB005', 'Microbiology Fundamentals', 2017, 'Inglés', TRUE);

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
