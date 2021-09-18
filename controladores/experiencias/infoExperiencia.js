const getDB = require("../../db");

const infoExperiencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    // hacer la query id de params
    const { id } = req.params;

    const [result] = await connection.query(
      `
        
        SELECT experiencia.id, experiencia.fecha_insert, experiencia.titulo, experiencia.descripcion, experiencia.localidad, experiencia.n_plazas, experiencia.f_inicio, experiencia.f_fin, experiencia.precio, experiencia.autor_id,
        AVG(IFNULL(experiencia_puntuacion.voto, 0)) AS votos
        FROM experiencia
        LEFT JOIN experiencia_puntuacion ON (experiencia.id = experiencia_puntuacion.experiencia_id)
        WHERE experiencia.id = ?
    `,
      [id]
    );

    const [fotos] = await connection.query(
      `
      SELECT id, foto, fecha_foto
      FROM experiencia_foto
      WHERE experiencia_id = ?
    
    `,
      [id]
    );

    //añado el objeto con las fotos a la informacion de la experiencia

    res.send({
      status: "ok",
      data: {
        ...result[0],
        fotos,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = infoExperiencia;
