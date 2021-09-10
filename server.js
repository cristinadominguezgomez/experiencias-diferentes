require("dotenv").config(); // gestiona las variables de entorno .env
const path = require("path");
const express = require("express"); // aplicacion para web para arrancar el servidor
const morgan = require("morgan"); // imprimo datos de la peticion desde postman metodo ruta
const fileUpload = require("express-fileupload"); //para leer el body form data para la subida de imagenes
const {
  listExperiencias,
  infoExperiencia,
  nuevaExperiencia,
  modExperiencia,
  eliminaExperiencia,
  añadirFotosExperiencia,
  eliminarFotosExperiencia,
  votarExperiencia,
} = require("./controladores/experiencias");

const existeExperiencia = require("./middlewares/existeExperiencia");

const { PORT, HOST, RECURSOS_DIRECTORY } = process.env; //console.log(process.env);

const app = express(); //creo instancia de express - llamo a express() para cada peticion
//tiene un metodo, una ruta y una funcion

//con express puedo usar funciones, en esta caso uso morgan y elijo el parametro "dev"
app.use(morgan("dev"));

//para gestionar el body usamos una funcion (middleware de express que es express.json()
app.use(express.json());

//middleware para acceder desde postman a los recursos estaticos
app.use(express.static(path.join(__dirname, RECURSOS_DIRECTORY)));

//para gestionar el body para subida de imagenes (multipart form data)
//multer ó express-fileupload
app.use(fileUpload());

//peticiones desde postman
// GET - / Home page
app.get("/", (req, res, next) => {
  res.send({
    status: "ok",
    message: "Página principal",
  });
});
//GET - /experiencias - lista todas las experiencias
app.get("/experiencias", listExperiencias);

// GET - /experiencias/:id - muestra la info de una experiencia
app.get("/experiencias/:id", existeExperiencia, infoExperiencia);

// POST - /experiencias/- crea una experiencia
app.post("/experiencias", nuevaExperiencia);

// PUT - /experiencias/:id - edita una experiencia
app.put("/experiencias/:id", existeExperiencia, modExperiencia);

// DELETE - /experiencias/:id/fotos/:fotoId - borra una imagen de una experienciapare
app.delete(
  "/experiencias/:id/fotos/:fotoId",
  existeExperiencia,
  eliminarFotosExperiencia
);
// DELETE - /experiencias/:id - borra una experiencia
app.delete("/experiencias/:id", existeExperiencia, eliminaExperiencia);

// POST - /experiencias/:id/fotos - añade una imagen a una experiencia
app.post("/experiencias/:id/fotos", existeExperiencia, añadirFotosExperiencia);

//POST - /experiencia/:id/votos/:userId - vota una experiencia
app.post("/experiencia/:id/votos/:idPart", existeExperiencia, votarExperiencia);

// middleware para gestionar todos los errores

app.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// middleware para página no encontrada

app.use((req, res, next) => {
  //console.log(res);
  res.status(404).send({
    status: "error",
    message: "No encontrad@",
  });
});

//express pone en escucha nuestro servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor en escucha en http://${HOST}:${PORT}`);
});
