
//Verificación de categoría
 const verificarCategoria = async (db, nombre_categoria) =>
 {
  const query = `SELECT id_categoria FROM Categoria WHERE nombre_categoria = ?`;
  const [results] = await db.query(query, [nombre_categoria]);
  return results.length > 0 ? results[0].id_categoria : null;
 }

//Creación de la nueva categoría

const agregarCategoria = async (db, nombre_categoria) => {
    const [rows] = await db.query(
      "SELECT id_categoria FROM Categoria WHERE nombre_categoria = ?",
      [nombre_categoria]
    );
  
    if (rows.length > 0) {
      return rows[0].id_categoria; // Categoría ya existe, devolver su id
    }
  
    // Insertar nueva categoria
    const [result] = await db.query(
      "INSERT INTO Categoria (nombre_categoria) VALUES (?)",
      [nombre_categoria]
    );
    return result.insertId;
  };

//Relacionar la categoria con el libro existente

const relacionarLC = async (db, id_libro, id_categoria) => {
  // Eliminar relaciones existentes
  await db.query("DELETE FROM libro_categoria WHERE id_libro = ?", [id_libro]);
  // Insertar nueva relación
  await db.query("INSERT INTO libro_categoria (id_libro, id_categoria) VALUES (?, ?)", [id_libro, id_categoria]);
}

  export default {verificarCategoria, agregarCategoria, relacionarLC};