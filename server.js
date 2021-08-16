require("dotenv").config(); // gestiona las variables de entorno .env
const express = require("express"); // aplicacion para web para iniciar un servidorrrancar el servidor
const morgan = require("morgan"); // imprimo datos de la peticion desde postman metodo ruta

const {PORT, HOST} = process.env; //console.log(process.env);

const app = express(); //creo instancia de express - llamo a express() para cada peticion
//tiene un metodo, una ruta y una funcion

//con express puedo usar funciones, en esta caso uso morgan y elijo el parametro "dev"
app.use(morgan("dev"));

//para gestionar el body usamos una funcion (middleware de express que es express.json()
app.use(express.json());

//peticiones desde postman 
// GET 


//express me da una respuesta de todas las rutas tanto si existen como si no
//que será en formato json porque se lo pongo aqui asi compruebo que funciona la conexion
//por lo que aqui podemos gestionar todos los errores
app.use((req, res, next) => {
  console.log(res);
  res.status(404).send({
    status: "error",
      
  });
});


//express pone en escucha nuestro servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor en escucha en http://${HOST}:${PORT}`);
});