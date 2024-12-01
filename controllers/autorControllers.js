
//Verificación y creación de autor/a

const agregarAutor = async (db, nombre, apellido, nacionalidad) => {
    const [rows] = await db.query(
      "SELECT id_autor FROM Autor WHERE nombre = ? AND apellido = ?",
      [nombre, apellido]
    );
    
    if (rows.length > 0) {
      return rows[0].id_autor; // Autor ya existe, devolver su ID
    }
  
    // Autor no existe, insertarlo
    const [result] = await db.query(
      "INSERT INTO Autor (nombre, apellido, nacionalidad) VALUES (?, ?, ?)",
      [nombre, apellido, nacionalidad]
    );
    return result.insertId; // Devolver el ID del autor recién insertado
  };

//Relacionar la editorial con el libro existente

  const relacionarLA = async (db, id_libro, id_autor) => {
    await db.query(
      "INSERT INTO Libro_autor (id_libro, id_autor) VALUES (?, ?)",
      [id_libro, id_autor]
    );
  };
  
  export default {agregarAutor, relacionarLA};