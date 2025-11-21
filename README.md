# Proyecto Final Backend - Muju

## Tecnologías Utilizadas

-   Node.js\
-   Express\
-   MongoDB + Mongoose\
-   Passport + JWT\
-   Nodemailer\
-   Arquitectura basada en DAO / Repository / DTO

------------------------------------------------------------------------

# Arquitectura y Patrones Implementados

### 1. DAO (Data Access Object)

-   Ubicación: `/src/dao`
-   Maneja la interacción directa con la base de datos.
-   DAOs implementados: `UsersDao`, `ProductsDao`, `CartsDao`,
    `TicketsDao`.

### 2. Repository Pattern

-   Ubicación: `/src/repositories`
-   Contiene la lógica de negocio.
-   Cada repositorio recibe un DAO y agrega validaciones, reglas de
    stock y lógica de compra.

### 3. DTO (Data Transfer Object)

-   Ubicación: `/src/dto/user.dto.js`
-   Filtra los datos enviados al cliente.
-   Se usa en la estrategia `/current` para devolver solo:
    -   `first_name`, `last_name`, `email`, `role`

------------------------------------------------------------------------

# Configuración del Proyecto

## Instalación

    npm install
    npm start

------------------------------------------------------------------------

# Variables de Entorno (.env)

  -----------------------------------------------------------------------
  Variable                       Descripción
  ------------------------------ ----------------------------------------
  `DATABASE_URL`                 URL de conexión a la base de datos
                                 (MongoDB Atlas o local)

  `JWT_SECRET`                   Clave secreta para generar y validar JWT

  `PORT`                         Puerto en el que corre el servidor

  `COOKIE_SECRET`                Clave secreta para firmar cookies

  `EMAIL_USERNAME`               Email emisor para recuperación de
                                 contraseña

  `EMAIL_PASSWORD`               Contraseña de aplicación del email
  -----------------------------------------------------------------------

Ejemplo:

    DATABASE_URL=mongodb+srv://...
    JWT_SECRET=tuClaveJWT
    PORT=8080
    COOKIE_SECRET=tuCookieSecret
    EMAIL_USERNAME=tuEmail@gmail.com
    EMAIL_PASSWORD=tuPasswordAplicacion

------------------------------------------------------------------------

# Credenciales de Administrador

  Rol     Email                Contraseña
  ------- -------------------- ---------------
  Admin   adminMuju@Muju.com   adminPassword

------------------------------------------------------------------------

