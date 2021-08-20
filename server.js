require("dotenv").config(); // gestiona las variables de entorno .env
const express = require("express"); // aplicacion para web para arrancar el servidor
const morgan = require("morgan"); // imprimo datos de la peticion desde postman metodo ruta
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


//aqui podemos gestionar todos los errores
app.use((error, req, res, next) => {
  //console.log(res);
  res.status(404).send({
    status: "error",
    message: error.message,
      
  });
});


//express pone en escucha nuestro servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor en escucha en http://${HOST}:${PORT}`);
});