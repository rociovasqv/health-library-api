//CREATE PRESTAMO - Crear un nuevo prestamo ---------------------------------------------------------------------------------------------------------
const crearPrestamo = async (req,res) =>
    {
        const db = req.app.get('db');
        const {
            fecha_devolucion,
            nombre_usuario,
            apellido_usuario,
            libros
        } = req.body;
    
        if (!fecha_devolucion || !nombre_usuario || !apellido_usuario || !Array.isArray(libros) || libros.length === 0) {
            return res.status(400).json({ error: "La fecha de devolucion, los libros (detalles) y el nombre completo del usuario son obligatorios para realizar el préstamo." });
        }
        //Verificar disponibilidad de los libros
    
        const listaLibros = libros.map(libro => libro.id_libro);
        const queryDisponible = `SELECT id_libro, disponible FROM Libro WHERE id_libro IN (?) AND disponible = 0`;
        const [noDisponible] = await db.query(queryDisponible, [listaLibros]);
        
        if (noDisponible.length > 0) {
            const librosNo = noDisponible.map(libro => libro.id_libro);
            return res.status(400).json({
                error: `Los siguientes libros no están disponibles: ${librosNo.join(", ")}`
            });
        }
        const connection = await db.getConnection();
        try{
            await connection.beginTransaction();
    
            //Verificación - Buscar id_usuario a partir del nombre y apellido del usuario
            const queryU = `SELECT id_usuario FROM Usuario WHERE nombre = ? AND apellido = ? LIMIT 1`;
            const [ resultU] = await connection.query(queryU, [nombre_usuario, apellido_usuario]);
            
            if (resultU.length === 0) {
                await connection.rollback();
                return res.status(404).json({ error: "Usuario no encontrado." });
              }
              const id_usuario = resultU[0].id_usuario;
              
            //Operación del total de libros solitados para el prestamo
            const total_libros = libros.length;
    
            //Crear préstamo
            const queryP = `INSERT INTO Prestamo (fecha_devolucion, id_usuario, total_libros) VALUES (?, ?, ?)`
            const [results] = await connection.query(queryP, [fecha_devolucion, id_usuario, total_libros]);
            const id_prestamo = results.insertId;
    
            // Agregar los libros del préstamo (detalles)
            const queryD = `INSERT INTO Detalles_prestamo (id_libro, id_prestamo) VALUES ?` ;
            const valoresDetalles = libros.map((id_libro) => [id_libro, id_prestamo]);
            await connection.query(queryD, [valoresDetalles]);
    
            //Actualizar estado de los libros
            const actualDisponible = `UPDATE Libro SET disponible = 0 WHERE id_libro IN (?)` ;
            await connection.query(actualDisponible, [listaLibros]);
    
            await connection.commit();               //Confirmar transacción
            res.status(201).json({ message: "Préstamo creado con éxito.", id_prestamo });
    
            }catch(error){
                await connection.rollback();
                console.error("Error al crear préstamo:", error);
                res.status(500).json({ error: "Error al crear el préstamo." });
            }
            finally{
                connection.release();
            }
        };

//GET ALL - Listar para ver todos los préstamos ------------------------------------------------------------------------------------------------------------------------------------------------
const mostrarPrestamos = async (req,res) =>
{
    try{
        const db = req.app.get('db');
        const query = `SELECT P.id_prestamo, P.fecha_prestamo, P.fecha_devolucion, P.estado, P.total_libros,
        U.id_usuario, U.nombre AS nombre_usuario, U.apellido AS apellido_usuario
        FROM Prestamo P
        LEFT JOIN Usuario U ON P.id_usuario = U.id_usuario
        ORDER BY P.fecha_prestamo DESC;`;
        const [results] = await db.query(query);
        res.status(200).json(results);
    }
    catch(error){
        console.error('Error al listar préstamos con los usuarios', error);
        res.status(500).json({error: "Error interno del servidor al listar préstamos con los usuarios"})
    }
};

//GET ONE - Ver detalles de préstamo de un usuario ----------------------------------------------------------------------------------------------------------------

const getPrestamo = async (req, res) => {
    const db = req.app.get("db");
    const id_prestamo = parseInt(req.params.id, 10);

    if (isNaN(id_prestamo)) {
        return res.status(400).json({ error: "El ID del préstamo debe ser un número válido." });
    }
    try {
        const query = `SELECT dp.id_detalles, dp.id_libro,
                l.titulo, CONCAT(a.nombre, ' ', a.apellido) AS autor, 
                p.fecha_prestamo, p.fecha_devolucion, p.estado
                FROM Detalles_prestamo dp
                JOIN Libro l ON dp.id_libro = l.id_libro
                LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
                LEFT JOIN autor a ON la.id_autor = a.id_autor
                JOIN Prestamo p ON dp.id_prestamo = p.id_prestamo
                WHERE dp.id_prestamo = ?`
                ;
                const [detalles] = await db.query(query, [id_prestamo]);

        if (detalles.length === 0) {
            return res.status(404).json({ error: "No se encontraron detalles para este préstamo." });
        }
        // Formatear la respuesta agrupando por préstamo
        const resp = {
            id_prestamo,
            fecha_prestamo: detalles[0].fecha_prestamo,
            fecha_devolucion: detalles[0].fecha_devolucion,
            estado: detalles[0].estado,
            libros: detalles.map(detalle => ({
                id_detalles: detalle.id_detalles,
                id_libro: detalle.id_libro,
                titulo: detalle.titulo,
                autor: detalle.autor,
            })),
        };
        res.status(200).json(resp);
    } catch (error) {
        console.error("Error al obtener los detalles del préstamo:", error);
        res.status(500).json({ error: "Error al obtener los detalles del préstamo." });
    }
};

const editarPrestamo = async (req,res) =>
{
    const {
        fecha_devolucion,
        estado,
        nombre_usuario,
        apellido_usuario,
        detalles
    } = req.body;

    const id_prestamo = parseInt(req.params.id, 10);

    if (!id_prestamo || !fecha_devolucion || !estado || !nombre_usuario || !apellido_usuario || !Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({ error: "La fecha de devolucion, los detalles y el nombre completo del usuario son obligatorios para actualizar el préstamo." });
    }
    const db = req.app.get('db');
    const connection = await db.getConnection();

    try{
        await connection.beginTransaction();

        //Verificación - Buscar id_usuario a partir del nombre y apellido del usuario
        const queryU = `SELECT id_usuario FROM Usuario WHERE nombre = ? AND apellido = ? LIMIT 1`;
        const [resultU] = await connection.query(queryU, [nombre_usuario, apellido_usuario]);
        
        if (resultU.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Usuario no encontrado." });
          }
          const id_usuario = resultU[0].id_usuario;

        //Actualizar datos de préstamo
        const queryP = `UPDATE Prestamo
        SET fecha_devolucion = ?, estado = ?, id_usuario = ?, total_libros = ? WHERE id_prestamo = ?`;
        const total_libros = detalles.length;
        const [resultsP] = await connection.query(queryP, [fecha_devolucion, estado, id_usuario, total_libros, id_prestamo]);

        if (resultsP.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Préstamo no encontrado." });
          }
          // Eliminar detalles existentes
          const queryED = `DELETE FROM Detalles_prestamo WHERE id_prestamo = ?`;
          await connection.query(queryED, [id_prestamo]);
          
          // Insertar nuevos detalles
          const queryD = `INSERT INTO Detalles_prestamo (id_libro, id_prestamo) VALUES ?`;
          const valoresDetalles = detalles.map((id_libro) => [id_libro, id_prestamo]);
          await connection.query(queryD, [valoresDetalles]);

          await connection.commit();
          res.status(200).json({message: "Préstamo actualizado con éxito. "});
    }
    catch(error){
        await connection.rollback();
        console.error('Error al acutalizar el préstamo', error);
        res.status(500).json({error: 'Error al actualizar préstamo. '});
    }
    finally{
        connection.release();
    }
};

const eliminarPrestamo = async (req,res) =>
    {
        const db = req.app.get('db');
        const id_prestamo = parseInt(req.params.id, 10);

    if (isNaN(id_prestamo)) {
        return res.status(400).json({ error: "El ID del préstamo debe ser un número válido." });
      }
      const connection = await db.getConnection();
      try{
        await connection.beginTransaction();
        //Eliminar detalles del préstamo seleccionado
        const queryD = `DELETE FROM Detalles_prestamo WHERE id_prestamo = ?`;
        await connection.query(queryD, [id_prestamo]);

        //Eliminar préstamo
        const queryP = `DELETE FROM Prestamo WHERE id_prestamo = ?`;
        const [resultsP] = await connection.query(queryP, [id_prestamo]);

        if (resultsP.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Préstamo no encontrado." });
          }
          await connection.commit();
          res.status(200).json({ message: "Préstamo eliminado con éxito." });
        }
      catch(error){
        await connection.rollback();
        console.error("Error al eliminar el préstamo", error);
        res.status(500).json({error: 'Error al eliminar el préstamo. '})
      }
      finally{
        connection.release();
      }   
    };

export default {crearPrestamo, mostrarPrestamos, getPrestamo, editarPrestamo, eliminarPrestamo};

//GET ONE - Mostrar préstamos de un usuario sin los detalles

// const getPrestamo = async (req,res) =>
// {
//     try{
//         const db = req.app.get('db');
//         const id_prestamo = req.params.id;
//         const query = `SELECT * FROM Prestamo WHERE id_prestamo = ?`;
//         const [results] = await db.query(query, [id_prestamo]);
//         if (results.length === 0){
//             return res.status(404).json({error:'Préstamo no encontrado'})
//         }
//         res.status(200).json(results);
//     }
//     catch(error){
//         console.error("Error al buscar préstamo", error);
//         res.status(500).json({error: 'Error del servidor al buscar préstamo.' })
//     }
// };

// Listar para editar
// const listarPrestamo = async (req,res) =>
// {
//     try{
//         const db = req.app.get('db');
//         const query = `SELECT * FROM Prestamo`;
//         const [results] = await db.query(query);
//         res.status(200).json(results);
//     }
//     catch(error){
//         console.error("Error al listar préstamos", error);
//         res.status(500).json({error: 'Error del servidor al listar préstamos.' })
//     }
// };