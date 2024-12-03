
//Verificación de editorial
const verificarEditorial = async (db, nombre, pais) => {
  const query = `SELECT id_editorial FROM Editorial WHERE nombre = ? AND pais = ?`;
  const [results] = await db.query(query, [nombre, pais]);
  return results.length > 0 ? results[0].id_editorial : null;
};

//Creación de la nueva editorial

const agregarEditorial = async (db, nombre, pais) => {
    const [rows] = await db.query(
      "SELECT id_editorial FROM Editorial WHERE nombre = ? AND pais = ?",
      [nombre, pais]
    );
  
    if (rows.length > 0) {
      return rows[0].id_editorial; // Editorial ya existe
    }
    // Insertar nueva editorial
    const [result] = await db.query(
      "INSERT INTO Editorial (nombre, pais) VALUES (?, ?)",
      [nombre, pais]
    );
    return result.insertId;
  };

//Relacionar editorial con el libro existente

const relacionarLE = async (db, id_libro, id_editorial) => {
  // Eliminar relaciones existentes
await db.query("DELETE FROM libro_editorial WHERE id_libro = ?", [id_libro]);
// Insertar nueva relación
await db.query("INSERT INTO libro_editorial (id_libro, id_editorial) VALUES (?, ?)", [id_libro, id_editorial]);
}

export default {verificarEditorial, agregarEditorial, relacionarLE};