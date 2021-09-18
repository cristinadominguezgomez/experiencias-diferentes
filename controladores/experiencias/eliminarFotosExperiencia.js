const getDB = require("../../db");
const { eliminarFoto } = require("../../helpers");

const eliminarFotosExperiencia = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id, fotoId } = req.params;

    //seleccionamos la foto en la base de datos
    const [fotoActual] = await connection.query(
      `
    SELECT foto FROM experiencia_foto WHERE id=? AND experiencia_id=?
    
    `,
      [fotoId, id]
    );

    // si no existe la foto devuelvo un error

    if (fotoActual.length === 0) {
      const error = new Error(
        `La foto con el id: ${fotoId} no existe en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    }

    //borro las fotos del disco
    await eliminarFoto(fotoActual[0].foto);

    //borro la foto de la tabla
    await connection.query(
      `
    DELETE FROM experiencia_foto WHERE id=? AND experiencia_id=?
    `,
      [fotoId, id]
    );

    res.send({
      status: "ok",
      message: "Foto eliminada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = eliminarFotosExperiencia;
