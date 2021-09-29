const getDB = require("../db");

const esAdmin = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // controlar si el usuario es admin
    await connection.query(
      `
    SELECT autor_id
    FROM experiencia
    WHERE id=?
    
    `,
      [id]
    );

    //console.log("user", user);
    if (req.userAuth.privilegios !== "admin") {
      const error = new Error(
        "No tiene permisos para eliminar esta experiencia"
      );
      error.httpStatus = 401;
      throw error;
    }

    // voy al proximo middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = esAdmin;
