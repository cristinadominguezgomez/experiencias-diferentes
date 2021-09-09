const getDB = require("../../db");
const { eliminarFoto } = require("../../helpers");

const eliminaExperiencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    // hacer la query id de params
    const { id } = req.params;

    let [valor] = await connection.query(
      `
        SELECT id FROM experiencia WHERE id=?    
    `,
      [id]
    );

    if (valor.length === 0) {
      const error = new Error("No hay ninguna experiencia con ese id");
      error.httpStatus = 404;
      throw error;
    }

    // Seleccionar las fotos realacionadas con esta id
    const [fotos] = await connection.query(
      `
      SELECT foto FROM experiencia_foto WHERE experiencia_id=?
    
    `,
      [id]
    );

    // Borro las tuplas de la tabla experiencia_foto
    await connection.query(
      `
    DELETE FROM experiencia_foto WHERE experiencia_id=?
    
    `,
      [id]
    );

    // Borro las imagenes en el disco
    for (const foto of fotos) {
      await eliminarFoto(foto.foto);
    }
    // Borro los votos de experiencia_puntuacion
    await connection.query(
      `
    DELETE FROM experiencia_puntuacion WHERE experiencia_id=?
    
    `,
      [id]
    );

    // Borro la experiencia
    await connection.query(
      `
    DELETE FROM experiencia WHERE id=?
    
    `,
      [id]
    );

    res.send({
      status: "ok",
      message: `La Experiencia con id: ${id} y todos sus elementos relacionados han sido eliminados`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = eliminaExperiencia;
