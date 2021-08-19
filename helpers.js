const {format} = require("date-fns");//modulo para formatear fechas

//funcion para formatear las fechas
function formatDate(dateObject){
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

module.exports = {
  formatDate,
};