const getDB = require("../../db");
const { formatDate } = require("../../helpers");

const modExperiencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    //leo los campos que me llegan del body
    const {
      titulo,
      descripcion,
      localidad,
      n_plazas,
      f_inicio,
      f_fin,
      precio,
    } = req.body;

    console.log(req.body);

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
