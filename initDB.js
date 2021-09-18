require("dotenv").config();

const faker = require("faker"); //modulo para generar datos random
const { random } = require("lodash"); //modulo para numeros random
const { formatDate } = require("./helpers"); // funcion para formatear la fecha
//este es un modulo independiente que reinicializa la DB solo cuando lo ejecuto
//creo la conexion a la base de datos e inicializo las variables MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD y MYSQL_DATABASE
const getDB = require("./db");

let connection;

async function main() {
  try {
    connection = await getDB();
    // borro las tablas si existen

    await connection.query(`DROP TABLE IF EXISTS experiencia_foto`);
    await connection.query(`DROP TABLE IF EXISTS experiencia_puntuacion`);
    await connection.query(`DROP TABLE IF EXISTS reservas`);
    await connection.query(`DROP TABLE IF EXISTS experiencia`);
    await connection.query(`DROP TABLE IF EXISTS usuario`);

    console.log("Tablas borradas");

    // creo la tabla usuario
    await connection.query(`

    CREATE TABLE usuario(
id INT PRIMARY KEY AUTO_INCREMENT,
fecha DATETIME NOT NULL,
nombre VARCHAR(100),
biografia TEXT,
email VARCHAR(100) UNIQUE NOT NULL,
contraseña VARCHAR(512) NOT NULL,
avatar VARCHAR(50),
activo BOOLEAN NOT NULL DEFAULT false,
privilegios ENUM("admin","normal") DEFAULT "normal" NOT NULL,
codigo_activacion VARCHAR(100)
)
    
    `);

    // creo la tabla experiencia
    await connection.query(`
        CREATE TABLE experiencia (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            fecha_insert DATETIME NOT NULL,
            titulo VARCHAR(255) NOT NULL,
            descripcion TEXT NOT NULL,
            localidad VARCHAR(64) NOT NULL,
            n_plazas INT NOT NULL,
            f_inicio DATETIME NOT NULL,
            f_fin DATETIME NOT NULL,
            precio INT NOT NULL,
            autor_id INT NOT NULL,
            FOREIGN KEY (autor_id) REFERENCES usuario(id)
                
            )
    `);
    // creo la tabla experiencia_puntuacion
    await connection.query(`
        CREATE TABLE experiencia_puntuacion (
            id INT PRIMARY KEY AUTO_INCREMENT,
            fecha DATETIME NOT NULL,
            voto TINYINT,
            experiencia_id INT NOT NULL,
            FOREIGN KEY (experiencia_id) REFERENCES experiencia(id),
            usuario_id INT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id)
            )
    `);

    // creo la tabla de reservas
    await connection.query(`
    CREATE TABLE reservas(
      id INT PRIMARY KEY AUTO_INCREMENT,
      fecha DATETIME NOT NULL,
      cancelacion BOOLEAN DEFAULT false,
      fecha_cancel DATETIME,
      usuario_id INT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuario(id),
      experiencia_id INT NOT NULL,
      FOREIGN KEY (experiencia_id) REFERENCES experiencia(id)
      )
    
    `);
    // creo la table experiencia_foto
    await connection.query(`
        CREATE TABLE experiencia_foto (
            id INT PRIMARY KEY AUTO_INCREMENT,
            fecha_foto DATETIME NOT NULL,
            foto VARCHAR(64),
            experiencia_id INT NOT NULL,
            FOREIGN KEY (experiencia_id) REFERENCES experiencia(id)
            )
    `);

    console.log("Tablas creadas");

    // creo el usuario admin>
    await connection.query(`
    INSERT INTO usuario(fecha, nombre, email, contraseña, activo, privilegios)
    VALUES (
      "${formatDate(new Date())}",
      "${process.env.ADMIN_NAME}",
      "${process.env.ADMIN_EMAIL}",
      SHA2("${process.env.ADMIN_PASSWORD}", 512),
      true,
      "admin"
    )
    
    `);

    // generar 10 usuarios random

    const usuarios = 10;
    for (let index = 0; index < usuarios; index++) {
      await connection.query(`
      INSERT INTO usuario(fecha, nombre, email, contraseña, activo)
      VALUES (
        "${formatDate(new Date())}",
        "${faker.name.findName()}",
        "${faker.internet.email()}",
        SHA2("${faker.internet.password()}", 512),
        true
        
      )
      
      `);
    }

    //introducir datos random con faker y lodash (10 experiencias)
    const num_experiencias = 10;
    for (let index = 0; index < num_experiencias; index++) {
      await connection.query(`
      INSERT INTO experiencia(fecha_insert, titulo, descripcion, localidad, n_plazas, f_inicio, f_fin, precio, autor_id)
      VALUES (
                "${formatDate(new Date())}",
                "${faker.commerce.productName()}",
                "${faker.commerce.productDescription()}",
                "${faker.address.city()}",
                ${random(1, 20)},
                "${formatDate(new Date())}",
                "${formatDate(new Date())}",
                ${random(20, 300)},
                1
      )
      `);
    }

    // introducir datos random (100 puntuaciones)
    const num_puntuaciones = 100;
    for (let index = 0; index < num_puntuaciones; index++) {
      await connection.query(`
      INSERT INTO experiencia_puntuacion (fecha, voto, experiencia_id, usuario_id)
      VALUES (
                "${formatDate(new Date())}",
                ${random(1, 5)},
                ${random(1, num_experiencias)},
                ${random(2, usuarios + 1)}
      )
      `);
    }
    console.log("Datos introducidos");
  } catch (error) {
    console.error(error);
  } finally {
    //libero la conexión
    if (connection) connection.release();
    // salgo del proceso
    process.exit(0);
  }
}

main();
