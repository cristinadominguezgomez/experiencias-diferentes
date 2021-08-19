const getDB = require("../../db");


const listExperiencias = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //saco el filtro de la busqueda req.query
    const {search} = req.query;

    let result;

    if (search) {

      [result] = await connection.query(`
            SELECT experiencia.id, experiencia.titulo, experiencia.localidad, experiencia.n_plazas, experiencia.f_inicio, experiencia.f_fin, experiencia.precio, 
            AVG(IFNULL(experiencia_puntuacion.voto, 0)) AS votos
            FROM experiencia
            LEFT JOIN experiencia_puntuacion ON (experiencia.id = experiencia_puntuacion.experiencia_id)
            WHERE experiencia.titulo LIKE ? OR experiencia.localidad LIKE ? 
            GROUP BY experiencia.id
            `, 
        [`%${search}%`, `%${search}%`]
      )

    } else {

      [result] = await connection.query(`
      SELECT experiencia.id, experiencia.titulo, experiencia.localidad, experiencia.n_plazas, experiencia.f_inicio, experiencia.f_fin, experiencia.precio, 
      AVG(IFNULL(experiencia_puntuacion.voto, 0)) AS votos
      FROM experiencia
      LEFT JOIN experiencia_puntuacion ON (experiencia.id = experiencia_puntuacion.experiencia_id)
      GROUP BY experiencia.id

      `)

    }

    //console.log(result);
    
    res.send({
      status: "ok",
      data: result,
    });
    
  } catch (error) {
    //voy al middleware de los errores
    next(error);
    
  } finally {
    //libero la conexión
    if (connection) connection.release();
  }
}

module.exports = listExperiencias;