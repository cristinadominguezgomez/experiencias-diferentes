const { format } = require("date-fns"); //modulo para formatear fechas
// unlink para eliminar el path de las fotos
const { ensureDir, unlink } = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const crypto = require("crypto");
// sendgrid para enviar un email y lo configuro con mi codigo
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

// genero un codigo de activacion para envíar por email
function generarCodigoActivacion() {
  return crypto.randomBytes(40).toString("hex");
}

//envia email para validar un usuario
async function enviarEmail({ to, subject, body }) {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      text: body,
      html: `
      <div>
      <h1>${subject}</h1>
      <p>${body}</p>
      </div>
      `,
    };
    await sgMail.send(msg);
  } catch (error) {
    throw new Error("Error enviando email");
  }
}

module.exports = {
  formatDate,
  guardarFoto,
  eliminarFoto,
  generarCodigoActivacion,
  enviarEmail,
};
