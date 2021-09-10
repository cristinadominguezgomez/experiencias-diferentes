const getDB = require("../db");

const existeExperiencia = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

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

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = existeExperiencia;
