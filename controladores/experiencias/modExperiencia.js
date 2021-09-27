const getDB = require("../../db");
const { formatDate } = require("../../helpers");

const modExperiencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params; // id experiencia
    //console.log("id", id);

    // controlar si el usuario que creo la experiencia es el mismo que el del token ó admin
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

    // leo los campos que me llegan del body
    const {
      titulo,
      descripcion,
      localidad,
      n_plazas,
      f_inicio,
      f_fin,
      precio,
    } = req.body;

    //console.log(req.body);

    //compruebo los campos obligatorios
    if (
      !titulo ||
      !descripcion ||
      !localidad ||
      !n_plazas ||
      !f_inicio ||
      !f_fin ||
      !precio
    ) {
      const error = new Error("Faltan campos obligatorios");
      error.httpStatus = 400;
      throw error;
    }

    const fecha_mod = new Date();

    await connection.query(
      `
     UPDATE experiencia SET fecha_insert=?, titulo=?, descripcion=?, localidad=?, n_plazas=?, f_inicio=?, f_fin=?, precio=? WHERE id=?

     `,
      [
        formatDate(fecha_mod),
        titulo,
        descripcion,
        localidad,
        n_plazas,
        f_inicio,
        f_fin,
        precio,
        id,
      ]
    );

    res.send({
      status: "ok",
      data: {
        id,
        fecha_mod,
        autor_id: req.userAuth.id,
        titulo,
        descripcion,
        localidad,
        n_plazas,
        f_inicio,
        f_fin,
        precio,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = modExperiencia;
