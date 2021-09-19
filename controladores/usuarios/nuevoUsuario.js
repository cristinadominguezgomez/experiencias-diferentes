const getDB = require("../../db");
const { generarCodigoActivacion, enviarEmail } = require("../../helpers");

const nuevoUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //saco los datos del body
    const { email, contraseña } = req.body;

    // compruebo que no esta el email en la base de datos
    const [result] = await connection.query(
      `
    SELECT id
    FROM usuario
    WHERE email = ?
    `,
      [email]
    );

    if (result.length > 0) {
      const error = new Error("Ya existe un usuario con este email");
      error.httpStatus = 409;
      throw error;
    }

    // genero un codigo de activacion
    const codigoActivacion = generarCodigoActivacion();
    //console.log("codigoActivacion", codigoActivacion);

    // añado el usuario a la base de datos con el codigo de activacion
    await connection.query(
      `
    INSERT INTO usuario(fecha, email, contraseña, codigo_activacion)
    VALUES(?, ?, SHA2(?, 512), ?)
    
    `,
      [new Date(), email, contraseña, codigoActivacion]
    );

    // envio email para la validacion del usuario con link que tiene el codigo de activacion
    // creo la funcion en helpers y contruyo el body
    const emailBody = `Te acabas de registrar en Experiencias Diferentes. Pulsa aqui para validar tu usuario: ${process.env.PUBLIC_HOST}/usuarios/registro/${codigoActivacion}`;

    enviarEmail({
      to: email,
      subject: "Activa tu usuario en Experiencias Diferentes",
      body: emailBody,
    });

    res.send({
      status: "ok",
      message: "Nuevo usuario creado, comprueba tu email para activarlo",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevoUsuario;
