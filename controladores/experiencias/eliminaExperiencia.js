const eliminaExperiencia = async (req, res, next) => {
  res.send({
    status: "ok",
    message: "Experiencia eliminada"
  });
}

module.exports = eliminaExperiencia;