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
--  GROUP_CONCAT(DISTINCT C.nombre_categoria SEPARATOR ', ') AS "Categorías" (En caso de agregar más de una categorías)
FROM libro L
JOIN libro_autor LA ON L.id_libro = LA.id_libro
JOIN autor A ON LA.id_autor = A.id_autor
JOIN libro_editorial LE ON L.id_libro = LE.id_libro
JOIN editorial E ON LE.id_editorial = E.id_editorial
JOIN libro_categoria LC ON L.id_libro = LC.id_libro
JOIN categoria C ON LC.id_libro = C.id_categoria
GROUP BY L.id_libro, E.nombre, C.nombre_categoria;

-- Consulta de un libro con toda la información completa por id
SELECT L.codigo,
L.titulo,
L.anio_publicacion,
L.idioma,
L.disponible,
A.nombre as "nombre_autor",
A.apellido as "apellido_autor",
A.nacionalidad as "nacionalidad_autor",
E.nombre as "nombre_editorial",
E.pais as "pais_editorial",
C.nombre_categoria
FROM libro L
LEFT JOIN libro_autor LA ON L.id_libro = LA.id_libro
LEFT JOIN autor A ON LA.id_autor = A.id_autor
LEFT JOIN libro_editorial LE ON L.id_libro = LE.id_libro
LEFT JOIN editorial E ON LE.id_editorial = E.id_editorial
LEFT JOIN libro_categoria LC ON L.id_libro = LC.id_libro
LEFT JOIN categoria C ON LC.id_categoria = C.id_categoria
WHERE L.id_libro = 5;
-- Otra forma de consulta un libro por id
SELECT L.id_libro AS "ID Libro",
L.codigo AS "Código ISBN",
L.titulo AS "Título",
L.anio_publicacion AS "Año de Publicación",
L.idioma AS "Idioma",
L.disponible AS "Disponible",
GROUP_CONCAT(DISTINCT CONCAT(A.nombre, ' ', A.apellido) SEPARATOR ', ') AS "Autor/es",
E.nombre AS "Editorial",
GROUP_CONCAT(DISTINCT C.nombre_categoria SEPARATOR ', ') AS "Categoría"
FROM Libro L 
LEFT JOIN Libro_autor LA ON L.id_libro = LA.id_libro
LEFT JOIN Autor A ON LA.id_autor = A.id_autor
LEFT JOIN Libro_editorial LE ON L.id_libro = LE.id_libro
LEFT JOIN Editorial E ON LE.id_editorial = E.id_editorial
LEFT JOIN Libro_categoria LC ON L.id_libro = LC.id_libro
LEFT JOIN Categoria C ON LC.id_categoria = C.id_categoria
WHERE L.id_libro = 5
GROUP BY  L.id_libro, L.codigo, L.titulo, L.anio_publicacion, L.idioma, L.disponible, E.nombre;

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

-- Consulta completa de todos los préstamos con los usuarios
SELECT p.*, u.nombre, u.apellido
      FROM Prestamo p
      JOIN Usuario u ON p.id_usuario = u.id_usuario;
      
-- Otra forma de consulta con el orden de las fechas
SELECT P.id_prestamo, P.fecha_prestamo, P.fecha_devolucion, P.estado, P.total_libros,
U.id_usuario, U.nombre AS nombre_usuario, U.apellido AS apellido_usuario
FROM Prestamo P
LEFT JOIN Usuario U ON P.id_usuario = U.id_usuario
ORDER BY P.fecha_prestamo DESC;

-- Consulta de todos los detalles de un préstamo específico
SELECT dp.*, l.titulo, l.autor
      FROM Detalles_prestamo dp
      JOIN Libro l ON dp.id_libro = l.id_libro
      WHERE dp.id_prestamo = 1;
      
