const nuevaExperiencia = async (req, res, next) => {
  res.send({
    status: "ok",
    message: "Nueva experiencia"
  });
}

module.exports = nuevaExperiencia;