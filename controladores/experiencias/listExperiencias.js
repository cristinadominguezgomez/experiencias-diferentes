const listExperiencias = async (req, res, next) => {
  res.send({
    status: "ok",
    message: "Listado de experiencias"
  });
}

module.exports = listExperiencias;