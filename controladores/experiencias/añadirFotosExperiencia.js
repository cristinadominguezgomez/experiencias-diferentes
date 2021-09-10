const getDB = require("../../db");
const { guardarFoto, formatDate } = require("../../helpers");

const añadirFotosExperiencia = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // controlar que la experiencia tenga ya 4 fotos
    const [currentFotos] = await connection.query(
      `
    SELECT id FROM experiencia_foto WHERE experiencia_id=?    
    `,
      [id]
    );
    //console.log(currentFotos);
    if (currentFotos.length >= 4) {
      const error = new Error("La experiencia ya tiene 4 fotos");
      error.httpStatus = 403;
      throw error;
    }

    let nuevaFoto;

    if (req.files && Object.keys(req.files).length > 0) {
      // guarda la foto en el disco y saco el nombre
      //console.log("values", Object.values(req.files)[0]);
      nuevaFoto = await guardarFoto(Object.values(req.files)[0]);
    }
    // añade la foto en la Base de datos

    await connection.query(
      `
      INSERT INTO experiencia_foto (fecha_foto, foto, experiencia_id) VALUES (?, ?, ?)
      `,
      [formatDate(new Date()), nuevaFoto, id]
    );

    res.send({
      status: "ok",
      data: {
        foto: nuevaFoto,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = añadirFotosExperiencia;
