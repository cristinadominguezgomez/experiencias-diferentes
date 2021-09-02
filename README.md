# Ejercicio experiencias diferentes

- Se trata de una web donde los usuarios buscan aventuras.
- Cada aventura tiene un titulo, una descripcion, una localidad, un numero de plazas, fechas de inicio y finalizacion, un precio y hasta 4 fotos.

- Sin considerar los usuarios (✅ hecho):

- Endpoints:

- GET - /experiencias - lista todas las experiencias con filtro ✅
- GET - /experiencias/:id - muestra la info de una experiencia ✅ faltan las fotos ✅
- POST - /experiencias/:id - crea una experiencia ✅
- POST - /experiencias/:id/fotos - añade una imagen a una experiencia
- PUT - /experiencias/:id - edita una experiencia
- DELETE - /experiencias/:id
- DELETE - /experiencias/:id/fotos/:fotoId - borra una imagen de una experiencia
- POST - /experiencia/:id/votos - vota una experiencia
