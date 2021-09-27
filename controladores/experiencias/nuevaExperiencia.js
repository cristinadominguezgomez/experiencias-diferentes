const getDB = require("../../db");
const { guardarFoto } = require("../../helpers");

const nuevaExperiencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //saco los datos del body
    // para leer el form-data añado el middleware multer ó express-fileupload
    const {
      titulo,
      descripcion,
      localidad,
      n_plazas,
      f_inicio,
      f_fin,
      precio,
    } = req.body;

    //console.log(req); // para ver el data de la foto

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

    // hacemos la insert en la BD
    const now = new Date();
    const date_inicio = new Date(f_inicio);
    const date_fin = new Date(f_fin);

    if (date_inicio > date_fin) {
      const error = new Error(
        "La fecha de inicio no puede ser posterior a la fecha de fin"
      );
      error.httpStatus = 400;
      throw error;
    }

    const [result] = await connection.query(
      `
    INSERT INTO experiencia (fecha_insert, titulo, descripcion, localidad, n_plazas, f_inicio, f_fin, precio, autor_id )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        
    `,
      [
        now,
        titulo,
        descripcion,
        localidad,
        n_plazas,
        date_inicio,
        date_fin,
        precio,
        req.userAuth.id,
      ]
    );

    //saco el id de la nueva experiencia
    // const [{ insertId }] = [result];

    //proceso las fotos
    const fotos = [];

    console.log(result.insertId);
    console.log(req.files);

    if (req.files && Object.keys(req.files).length > 0) {
      for (const foto of Object.values(req.files).slice(0, 4)) {
        //creo en helpers una funcion async que me guarda las fotos en el pc
        const nombreFoto = await guardarFoto(foto);
        fotos.push(nombreFoto);

        // las inserto en el DB
        await connection.query(
          `
          INSERT INTO experiencia_foto (fecha_foto, foto, experiencia_id)
          VALUES (?, ?, ?)

          
        `,
          [now, nombreFoto, result.insertId]
        );
      }
    }

    res.send({
      status: "ok",
      data: {
        id: result.insertId,
        titulo,
        descripcion,
        localidad,
        autor_id: req.userAuth.id,
        n_plazas,
        f_inicio,
        f_fin,
        precio,
        fecha_insert: now,
        votos: 0,
        fotos: fotos,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevaExperiencia;
