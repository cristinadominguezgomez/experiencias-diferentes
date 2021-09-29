const getDB = require("../db");

const estaAutorizado = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // controlar si el usuario que logueado esta autorizado (propio usuario que creo la entrada 1 hora ó admin.
    const [user] = await connection.query(
      `
    SELECT autor_id
    FROM experiencia
    WHERE id=?
    
    `,
      [id]
    );

    console.log("user", user);
    if (
      user[0].autor_id !== req.userAuth.id &&
      req.userAuth.privilegios !== "admin"
    ) {
      const error = new Error(
        "No tiene permisos para modificar esta experiencia"
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

module.exports = estaAutorizado;
