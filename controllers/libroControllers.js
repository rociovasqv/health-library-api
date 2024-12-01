import connectDB from "../config/db.js";

// CREATE - Crear/registrar nuevos libros

const registrarLibro = async (req,res) => {
    const {
        codigo,
        titulo,
        anio_publicacion,
        idioma,
        disponible,
        nombre_autor,
        apellido_autor,
        nacionalidad_autor,
        nombre_editorial,
        pais_editorial,
        nombre_categoria,
    } = req.body

 // Validación de datos
 if (
    !codigo ||
    !titulo ||
    !anio_publicacion ||
    !idioma ||
    disponible === undefined ||
    !nombre_autor ||
    !apellido_autor ||
    !nacionalidad_autor ||
    !nombre_editorial ||
    !pais_editorial ||
    !nombre_categoria
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios para registrar un libro." });
  }
  
    try{
        const query = `CALL registrar_libro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `
        await connectDB.query(query, [
            codigo,
            titulo,
            anio_publicacion,
            idioma,
            disponible,
            nombre_autor,
            apellido_autor,
            nacionalidad_autor,
            nombre_editorial,
            pais_editorial,
            nombre_categoria,
          ])
          res.status(201).json({ message: 'Libro registrado correctamente.' });
    }
    catch(error){
        console.error("Error al registrar un libro", error);
        res.status(500).json({ error: 'Error al registrar el libro.' });
    }
}


//READ - Listar libros 

const listarLibros = async (req, res) => {
  try {
    const query = `
      SELECT 
          L.id_libro AS "ID Libro",
          L.codigo AS "Código ISBN",
          L.titulo AS "Título",
          L.anio_publicacion AS "Año de Publicación",
          L.idioma AS "Idioma",
          L.disponible AS "Disponible",
          GROUP_CONCAT(DISTINCT CONCAT(A.nombre, ' ', A.apellido) SEPARATOR ', ') AS "Autor/es",
          E.nombre AS "Editorial",
          GROUP_CONCAT(DISTINCT C.nombre_categoria SEPARATOR ', ') AS "Categorías"
      FROM 
          Libro L
      LEFT JOIN 
          Libro_autor LA ON L.id_libro = LA.id_libro
      LEFT JOIN 
          Autor A ON LA.id_autor = A.id_autor
      LEFT JOIN 
          Libro_editorial LE ON L.id_libro = LE.id_libro
      LEFT JOIN 
          Editorial E ON LE.id_editorial = E.id_editorial
      LEFT JOIN 
          Libro_categoria LC ON L.id_libro = LC.id_libro
      LEFT JOIN 
          Categoria C ON LC.id_categoria = C.id_categoria
      GROUP BY 
          L.id_libro, L.codigo, L.titulo, L.anio_publicacion, L.idioma, L.disponible, E.nombre
      ORDER BY 
          L.titulo;
    `;

    connectDB.query(query, (err, results) => {
      if (err) {
        console.error("Error ejecutando la consulta:", err);
        return res.status(500).json({ error: "Error al obtener los libros" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// UPDATE - Editar/actualizar libros

const editarLibro = async (req,res) =>
{
    const id_libro = req.params.id
    const {
        codigo,
        titulo,
        anio_publicacion,
        idioma,
        disponible,
        nombre_autor,
        apellido_autor,
        nacionalidad_autor,
        nombre_editorial,
        pais_editorial,
        nombre_categoria,
    } = req.body

    try{
        const query = `CALL actualizar_libro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        await connectDB.query(query, [
            id_libro,
            codigo,
            titulo,
            anio_publicacion,
            idioma,
            disponible,
            nombre_autor,
            apellido_autor,
            nacionalidad_autor,
            nombre_editorial,
            pais_editorial,
            nombre_categoria,
        ]);
        res.status(200).json({ message: 'Libro actualizado correctamente.' });
    }
    catch(error){
    console.error("Error al actualizar un libro", error);
    res.status(500).json({ error: 'Error al actualizar el libro. Intente de nuevo' });
    }
}

const eliminarLibro = async (req,res) => {
    const id_libro = req.params.id
    const query = `DELETE FROM Libro WHERE id_libro = ?`
    await connectDB.query(query, id_libro)
}

export default { registrarLibro, listarLibros, editarLibro, eliminarLibro };