
//Verificación y creación de la nueva categoría

const agregarCategoria = async (db, nombre_categoria) => {
    const [rows] = await db.query(
      "SELECT id_categoria FROM Categoria WHERE nombre_categoria = ?",
      [nombre_categoria]
    );
  
    if (rows.length > 0) {
      return rows[0].id_categoria; // Categoría ya existe
    }
  
    // Insertar nueva categoría
    const [result] = await db.query(
      "INSERT INTO Categoria (nombre_categoria) VALUES (?)",
      [nombre_categoria]
    );
    return result.insertId;
  };

//Relacionar la categoria con el libro existente

  const relacionarLC = async (db, id_libro, id_categoria) => {
    await db.query(
      "INSERT INTO Libro_categoria (id_libro, id_categoria) VALUES (?, ?)",
      [id_libro, id_categoria]
    );
  };

  export default { agregarCategoria, relacionarLC };