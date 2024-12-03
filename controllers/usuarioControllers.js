
//CREATE USUARIO - Crear un nuevo usuario ---------------------------------------------------------------------------------------------------------

const registrarUsuario = async(req,res) =>
{
    const {
        nombre,
        apellido,
        direccion,
        telefono,
        correo
    } = req.body

     // Validación de datos
 if ( !nombre || !apellido || !direccion || !telefono || !correo) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios para registrar un usuario." });
  }
  try{
    const db = req.app.get('db');
    const query = `INSERT INTO Usuario(nombre,apellido,direccion,telefono,correo,fecha_registro)VALUES(?,?,?,?,?,CURDATE())`;
    const [results] = await db.query(query,[nombre,apellido,direccion,telefono,correo]);
    res.status(201).json({message: 'Usuario registrado correctamente.',
    id: results.insertId,
      nombre,
      apellido,
      direccion,
      telefono,
      correo
    });
  }
  catch(error){
    console.error("Error al registrar un usuario", error);
     res.status(500).json({ error: 'Error al registrar el usuario.' })
  }
};

const listarUsuario = async (req,res) =>{
    try{
        const db = req.app.get('db');
        const query = `SELECT * FROM Usuario`;
        const [results] = await db.query(query);
        res.status(200).json(results);
    }
    catch(error){
        console.error("Error al listar usuarios", error);
        res.status(500).json({error: 'Error del servidor al listar usuarios.' })
    }
};

const getUsuario = async (req,res) => {
    try{
        const db = req.app.get('db');
        const id_usuario = req.params.id;
        const query = `SELECT * FROM Usuario WHERE id_usuario = ?`;
        const [results] = await db.query(query, [id_usuario]);
        if (results.length === 0){
            return res.status(404).json({error:'Usuario no encontrado'})
        }
        res.status(200).json(results);

    }
    catch(error){
        console.error("Error al buscar el usuario", error);
        res.status(500).json({ error: 'Error al buscar el usuario.' });
    }
};

const editUsuario = async (req,res) =>
{
    const {
        nombre,
        apellido,
        direccion,
        telefono,
        correo
    } = req.body

     // Validación de datos
     if ( !nombre || !apellido || !direccion || !telefono || !correo) {
        return res.status(400).json({ error: "Todos los campos son obligatorios para registrar un usuario." });
  }
    try{
        const db = req.app.get('db');
        const id_usuario = req.params.id;
        if (!id_usuario) { return res.status(400).json({ error: "El ID del usuario es obligatorio." });}

        const query = `UPDATE Usuario
        SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, correo = ? 
        WHERE id_usuario = ?`;
        const [results] = await db.query(query,[nombre,apellido,direccion,telefono,correo, id_usuario]);
       
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado o no se realizaron cambios." });}  //Verificar si el registro fue actualizado

        res.status(200).json({message: "Usuario actualizado con éxito. ",
            id_usuario,
            nombre,
            apellido,
            direccion,
            telefono,
            correo
        })
    }
    catch(error){
        console.error('Error al editar el usuario. ', error)
        res.status(500).json({error: 'Error interno del servidor al editar el usuario.'});
    }
};

const eliminarUsuario = async (req,res) =>
{
    const db = req.app.get('db');
    const id_usuario = parseInt(req.params.id, 10);

    if (isNaN(id_usuario)) {
        return res.status(400).json({ error: "El ID de usuario debe ser un número válido." });
      }

    try{
        const query = `DELETE FROM Usuario WHERE id_usuario = ?`;
        const [results] = await db.query(query, [id_usuario]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });} // Verificar si se eliminó algún registro de usuario
        res.status(200).json({message: "Usuario eliminado con éxito. "})
    }
    catch(error){
        console.error('Error al eliminar el usuario. ', error);
        res.status(500).json({error: 'Error interno al intentar eliminar el usuario.'})
    }
}

export default {registrarUsuario, listarUsuario, getUsuario, editUsuario, eliminarUsuario}
