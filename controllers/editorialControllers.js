
//Verificación y creación de la nueva editorial

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

//Relacionar la editorial con el libro existente
  const relacionarLE = async (db, id_libro, id_editorial) => {
    await db.query(
      "INSERT INTO Libro_editorial (id_libro, id_editorial) VALUES (?, ?)",
      [id_libro, id_editorial]
    );
  };

export default {agregarEditorial, relacionarLE};