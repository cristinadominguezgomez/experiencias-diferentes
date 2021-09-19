const getDB = require("../../db");

const registroUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // busco el codigo de activacion en los params del correo que recibo
    const { codigoActivacion } = req.params;
    // lo busco en la base de datos si existe un usuario con ese codigo
    const [usuario] = await connection.query(
      `
    SELECT id FROM usuario WHERE codigo_activacion=?`,
      [codigoActivacion]
    );

    if (usuario.length === 0) {
      const error = new Error(
        "No hay ningun usuario que tenga este codigo pendiente de validar"
      );
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `
    UPDATE usuario SET activo=true, codigo_activacion=NULL
    WHERE codigo_activacion=?
    `,
      [codigoActivacion]
    );

    res.send({
      status: "ok",
      message: "Usuario validado",
      data: "data",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = registroUsuario;
