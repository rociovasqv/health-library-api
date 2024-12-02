//Verificación de autor/a
const verificarAutor = async (db, nombre, apellido) => {
  const query = `SELECT id_autor FROM Autor WHERE nombre = ? AND apellido = ?`;
  const [results] = await db.query(query, [nombre, apellido]);
  return results.length > 0 ? results[0].id_autor : null;
};

//Creación de autor/a
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

//Relacionar autor/a con el libro existente

const relacionarLA = async (db, id_libro, id_autor) => {
  // Eliminar relaciones existentes
  await db.query("DELETE FROM libro_autor WHERE id_libro = ?", [id_libro]);
  // Insertar nueva relación
  await db.query("INSERT INTO libro_autor (id_libro, id_autor) VALUES (?, ?)", [id_libro, id_autor]);
}
  export default {verificarAutor, agregarAutor, relacionarLA};