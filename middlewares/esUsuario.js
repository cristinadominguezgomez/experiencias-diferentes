const getDB = require("../db");
const jwt = require("jsonwebtoken");

const esUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { authorization } = req.headers;

    // comprobar que llegue token
    if (!authorization) {
      const error = new Error("Falta la cabecera de la autorización");
      error.httpStatus = 401;
      throw error;
    }

    // desencriptar el token y comprobar si es valido con jwt
    // le indico 3 parametros, el token, la contraseña que creamos para encriptarlo y un objeto con la expiracion
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (e) {
      const error = new Error("Token no valido");
      error.httpStatus = 401;
      throw error;
    }

    // tenemos que coger del token (id, privilegios) y pasarselo a la req. con el nombre userAuth para pasarselo al middleeware que lo necesite
    //console.log(tokenInfo);
    req.userAuth = tokenInfo;

    //console.log("Controlo el token. Token", authorization);

    // voy al proximo middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = esUsuario;
