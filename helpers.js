const { format } = require("date-fns"); //modulo para formatear fechas
// unlink para eliminar el path de las fotos
const { ensureDir, unlink } = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");

//funcion para formatear las fechas
function formatDate(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

const { RECURSOS_DIRECTORY } = process.env;
const recursosDir = path.join(__dirname, RECURSOS_DIRECTORY);

//funcion para guardar fotos en mi pc
async function guardarFoto(foto) {
  //compruebo si hay el directorio de recursos/subidos y sino lo creo (con ensureDir de fs-extra)
  //lo incluyo en las variables de entorno .env
  await ensureDir(recursosDir);

  //leer el buffer (foto.data) de la imagen (con sharp)
  const imagen = sharp(foto.data);

  //controlo el tamaño y hago una resize(ancho)
  imagen.resize(800);

  //genero un nombre unico con UUID sin controlar el formato de la imagen
  const nombreImagen = `${uuid.v4()}.jpg`;

  //guardo la imagen en recursos/subidos (recursosDir)
  await imagen.toFile(path.join(recursosDir, nombreImagen));

  //devuelvo el nombre de la foto
  return nombreImagen;
}

async function eliminarFoto(nombreImagen) {
  const pathFoto = path.join(recursosDir, nombreImagen);
  await unlink(pathFoto);
}

module.exports = {
  formatDate,
  guardarFoto,
  eliminarFoto,
};
