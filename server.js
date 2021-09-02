require("dotenv").config(); // gestiona las variables de entorno .env
const express = require("express"); // aplicacion para web para arrancar el servidor
const morgan = require("morgan"); // imprimo datos de la peticion desde postman metodo ruta
const fileUpload = require("express-fileupload"); //para leer el body form data para la subida de imagenes
const { 
  listExperiencias, 
  infoExperiencia, 
  nuevaExperiencia, 
  modExperiencia, 
  eliminaExperiencia } = require("./controladores/experiencias");

const {PORT, HOST} = process.env; //console.log(process.env);

const app = express(); //creo instancia de express - llamo a express() para cada peticion
//tiene un metodo, una ruta y una funcion

//con express puedo usar funciones, en esta caso uso morgan y elijo el parametro "dev"
app.use(morgan("dev"));

//para gestionar el body usamos una funcion (middleware de express que es express.json()
app.use(express.json());

//para gestionar el body para subida de imagenes (multipart form data)
//multer ó express-fileupload
app.use(fileUpload());


//peticiones desde postman 
// GET - / Home page
app.get("/", (req, res, next) => {
  res.send({
    status: "ok",
    message: "Página principal"
  });
});
//GET - /experiencias - lista todas las experiencias
app.get("/experiencias", listExperiencias);

// GET - /experiencias/:id - muestra la info de una experiencia
app.get("/experiencias/:id", infoExperiencia);

// POST - /experiencias/- crea una experiencia
app.post("/experiencias", nuevaExperiencia);

// PUT - /experiencias/:id - edita una experiencia
app.put("/experiencias/:id", modExperiencia);

// DELETE - /experiencias/:id
app.delete("/experiencias/:id", eliminaExperiencia);


// middleware para gestionar todos los errores

app.use ((error, req, res, next) => {
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
    message: "página no encontrada",
      
  });
});


//express pone en escucha nuestro servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor en escucha en http://${HOST}:${PORT}`);
});