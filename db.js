require("dotenv").config();

//para conectarnos a la base de datos
const mysql = require("mysql2/promise");
//leo las variables de entorno
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
//creo una funcion async de conexion getDB con un pool de 10 conexiones

let pool;

console.log(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);

async function getDB() {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      timezone: "Z",
    });
  }
  //devuelve una conexión
  return await pool.getConnection();
}

module.exports = getDB;
