import connectDB from "../config/db.js";
import editorialControllers from "./editorialControllers.js";
import autorControllers from "./autorControllers.js";
import categoriaControllers from "./categoriaControllers.js";

// CREATE - Crear/registrar nuevos libros --------------------------------------------------------------------------------------------------------------------------

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
    disponible === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios para registrar un libro." });
  }
  
    try{
        const db = req.app.get('db');

        // Agregar autor, editorial y categoría
        const id_autor = await autorControllers.agregarAutor(db, nombre_autor, apellido_autor, nacionalidad_autor);
        const id_editorial = await editorialControllers.agregarEditorial(db, nombre_editorial, pais_editorial);
        const id_categoria = await categoriaControllers.agregarCategoria(db, nombre_categoria);

        // Insertar el libro
        const [result] = await db.query(
            "INSERT INTO Libro (codigo, titulo, anio_publicacion, idioma, disponible) VALUES (?, ?, ?, ?, ?)",
            [codigo, titulo, anio_publicacion, idioma, disponible]
        );

        const id_libro = result.insertId;

        // Relacionar el libro con autor, editorial y categoría
        await autorControllers.relacionarLA(db, id_libro, id_autor);
        await editorialControllers.relacionarLE(db, id_libro, id_editorial);
        await categoriaControllers.relacionarLC(db, id_libro, id_categoria);

        res.status(201).json({ message: 'Libro registrado correctamente.' });
    }
    catch(error){
        console.error("Error al registrar un libro", error);
        res.status(500).json({ error: 'Error al registrar el libro.' });
    }
};
//READ / GET ALL - Listar libros --------------------------------------------------------------------------------------------------------------------------
const listarLibros = async (req, res) => {
    try {
      const db = req.app.get('db');
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
            L.id_libro, L.codigo, L.titulo, L.anio_publicacion, L.idioma, L.disponible, E.nombre;
      `;
      const [results] = await db.query(query);        // Usa await correctamente sin callbacks
      res.status(200).json(results);
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
//READ - GET ONE - Mostrar un libro --------------------------------------------------------------------------------------------------------------------------
const buscarLibro = async (req,res) =>
{
    try{
        const db = req.app.get('db');
        const id_libro = req.params.id;
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
            WHERE L.id_libro = ?
            GROUP BY 
                L.id_libro, L.codigo, L.titulo, L.anio_publicacion, L.idioma, L.disponible, E.nombre;
          `;
          const [results] = await db.query(query, [id_libro]);
          if (results.length === 0) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }
        res.status(200).json(results);
    }
    catch(error){
        console.error("Error al buscar el libro", error);
        res.status(500).json({ error: 'Error al buscar el libro.' });
    }
};

//READ - GET ONE FOR EDIT (UPDATE) - Mostrar un libro para la edición --------------------------------------------------------------------------------------------------------------------------
const getLibro = async (req,res) =>
{
    try{
        const db = req.app.get('db');
        const id_libro = req.params.id;
        const query = `
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
        WHERE L.id_libro = ?`;
        const [results] = await db.query(query, [id_libro]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }
        res.status(200).json(results);
    }catch(error){
        console.error("Error al obtener el libro para editar", error);
        res.status(500).json({ error: 'Error al obtener el libro.' });
    }
    };

// UPDATE - Editar/actualizar libros --------------------------------------------------------------------------------------------------------------------------
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
    } = req.body;
     // Validación de datos
     if (!id_libro || !codigo || !titulo || !anio_publicacion || !idioma || disponible === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios para actualizar un libro." });
    }

    try{
        const db = req.app.get('db');
        await db.query(
            "UPDATE Libro SET codigo = ?, titulo = ?, anio_publicacion = ?, idioma = ?, disponible = ? WHERE id_libro = ?",
            [codigo, titulo, anio_publicacion, idioma, disponible, id_libro]
        );
        // Verificar y actualizar autor
        let id_autor = await autorControllers.verificarAutor(db,nombre_autor, apellido_autor);
        if (!id_autor){
            id_autor = await autorControllers.agregarAutor(db, nombre_autor, apellido_autor, nacionalidad_autor);
        }
        await autorControllers.relacionarLA(db, id_libro, id_autor);
    
        // Verificar y actualizar editorial
        let id_editorial = await editorialControllers.verificarEditorial(db,nombre_editorial,pais_editorial);
        if(!id_editorial){
            id_editorial = await editorialControllers.agregarEditorial(db, nombre_editorial, pais_editorial);
        }
        await editorialControllers.relacionarLE(db, id_libro, id_editorial);

        // Verificar y actualizar categoría
        let id_categoria = await categoriaControllers.verificarCategoria(db,nombre_categoria);
        if(!id_categoria){
            id_categoria = await categoriaControllers.agregarCategoria(db, nombre_categoria);
        }
        await categoriaControllers.relacionarLC(db, id_libro, id_categoria);
        res.status(200).json({ message: 'Libro actualizado correctamente.' });
    }
    catch(error){
    console.error("Error al actualizar un libro", error);
    res.status(500).json({ error: 'Error al actualizar el libro. Intente de nuevo' });
    }
};
// DELETE - Eliminar libro --------------------------------------------------------------------------------------------------------------------------
const eliminarLibro = async (req, res) => {
    const db = req.app.get('db');
    const id_libro = req.params.id;
    try {
        //Eliminar relaciones intermedias
        await db.query("DELETE FROM libro_autor WHERE id_libro = ?", [id_libro]);
        await db.query("DELETE FROM libro_editorial WHERE id_libro = ?", [id_libro]);
        await db.query("DELETE FROM libro_categoria WHERE id_libro = ?", [id_libro]);

        //Eliminar el libro
        const [result] = await db.query("DELETE FROM Libro WHERE id_libro = ?", [id_libro]);

        // Verificar si se eliminó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Libro no encontrado." });
        }
        res.status(200).json({ message: "Libro eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar el libro:", error);
        res.status(500).json({ error: "Error al eliminar el libro." });
    }
};
export default { registrarLibro, listarLibros, getLibro, buscarLibro, editarLibro, eliminarLibro };
