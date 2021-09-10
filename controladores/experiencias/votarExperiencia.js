const getDB = require("../../db");
//const { formatDate } = require("../../helpers");
const moment = require("moment");

const votarExperiencia = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id, idPart } = req.params;
    const { voto, f_fin } = req.body;

    //controlar que haya finalizado la experiencia
    const fecha = moment(new Date());
    const fechafin = moment(f_fin);
    let transcurso = fecha - fechafin;

    if (transcurso < 0) {
      const error = new Error("Solo puede votar al finalizar la experiencia");
      error.httpStatus = 403;
      throw error;
    }

    //console.log(id, idPart, voto);

    //controlar que el voto sea un numero del 1 al 5
    if (voto < 1 || voto > 5) {
      const error = new Error("El voto tiene que ser un valor del 1 al 5");
      error.httpStatus = 400;
      throw error;
    }

    const fechaActual = new Date();

    //guardarlo en la tabla de votos
    await connection.query(
      `
    INSERT INTO experiencia_puntuacion (fecha, voto, experiencia_id) VALUES (?, ?, ?)
    `,
      [fechaActual, voto, id]
    );

    // saco la nueva media de los votos
    const [newVotos] = await connection.query(
      `
    SELECT AVG(voto) AS media_votos FROM experiencia_puntuacion WHERE experiencia_id=? GROUP BY experiencia_id
    `,
      [id]
    );
    console.log("newVotos", newVotos);

    res.send({
      status: "ok",
      data: {
        id,
        fecha: fechaActual,
        votos: newVotos[0].media_votos,
        user_part: idPart,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = votarExperiencia;
