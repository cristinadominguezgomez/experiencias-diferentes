# Ejercicio experiencias diferentes

- Se trata de una web donde los usuarios buscan aventuras.
- Cada aventura tiene un titulo, una descripcion, una localidad, un numero de plazas, fechas de inicio y finalizacion, un precio y hasta 4 fotos.

- Sin considerar los usuarios (✅ hecho):

- Endpoints:
- Experiencias

- GET - /experiencias - lista todas las experiencias con fotos y autor ✅
- GET - /experiencias/:id - muestra la info de una experiencia con fotos y autor ✅
- POST - /experiencias/:id - crea una experiencia ✅
- POST - /experiencias/:id/fotos - añade una imagen a una experiencia ✅
- PUT - /experiencias/:id - edita el titulo, la descripcion, la localidad el numero de plazas, las fechas de inicio y fin y el precion de una experiencia ✅
- DELETE - /experiencias/:id ✅
- DELETE - /experiencias/:id/fotos/:fotoId - borra una imagen de una experienciapare ✅
- POST - /experiencia/:id/votos/:idPart - vota una experiencia solo el usuario que ha participado despues de la experiencia✅

- Crear tabla de usuarios y la tabla de reservas ✅

- Usuarios:
- POST - /usuarios - crea un usuario pendiente de activar, envia email al usuario ✅
- GET - /usuarios/registro/:codigoActivacion - valida un uuario recien registratado (el usuario valida su email)✅
- POST - /usuarios/login - login de un usuario (devuelve token)✅
- modificamos los endpoint de acceso con usuario
- GET -/usuarios/:id - devuelve la informacion del usuario | Token obligatorio
