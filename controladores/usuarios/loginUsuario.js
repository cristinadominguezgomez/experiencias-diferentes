const getDB = require("../../db");
//instalo jwt para devolver un token para loguearse - duracion 1 mes
const jwt = require("jsonwebtoken");

const loginUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { email, contraseña } = req.body;

    // si hay datos email y contrasela
    if (!email || !contraseña) {
      const error = new Error("Faltan campos obligatorios");
      error.httpStatus = 400;
      throw error;
    }

    // busco el usuario en la base de datos
    const [user] = await connection.query(
      `
    SELECT id, privilegios, activo FROM usuario WHERE email=? AND contraseña=SHA2(?,512)
    `,
      [email, contraseña]
    );

    // si no devuelve nada no esta autorizado
    if (user.length === 0) {
      const error = new Error("Los datos introducidos son incorrectos");
      error.httpStatus = 401;
      throw error;
    }

    // compruebo si esta activo o pendiente de validacion
    if (!user[0].activo) {
      const error = new Error(
        "Usuario pendiente de validacion, revise su email"
      );
      httpStatus = 401;
      throw error;
    }

    // devuelvo un token primero creo un objeto con lo que quiero devolver y con jwc lo encripto
    const info = {
      id: user[0].id,
      privilegios: user[0].privilegios,
    };

    // para encriptar la informacion necesito una contraseña que guardo en .env (la genero con lastpass)
    // y un objeto con la expiracion (en este caso 1 mes)
    const token = jwt.sign(info, process.env.SECRET, { expiresIn: "30d" });
    console.log(token);

    res.send({
      status: "ok",
      message: "Token valido 30 días",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginUsuario;
