const getDB = require("../../db");

const infoExperiencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    // hacer la query id de params
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

    const [result] = await connection.query(
      `
        
        SELECT experiencia.id, experiencia.fecha_insert, experiencia.titulo, experiencia.descripcion, experiencia.localidad, experiencia.n_plazas, experiencia.f_inicio, experiencia.f_fin, experiencia.precio, 
        AVG(IFNULL(experiencia_puntuacion.voto, 0)) AS votos
        FROM experiencia
        LEFT JOIN experiencia_puntuacion ON (experiencia.id = experiencia_puntuacion.experiencia_id)
        WHERE experiencia.id = ?
    `,
      [id]
    );

    console.log(result);

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = infoExperiencia;
