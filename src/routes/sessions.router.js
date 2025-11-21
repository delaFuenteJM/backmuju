import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/passport.config.js";
import UserDTO from "../dto/userDto.js";
import UserDao from "../dao/userDao.js";
import { sendPasswordResetEmail } from "../utils/mailing.js";
import { createHash, isValidPassword } from "../utils/security.js";

const router = Router();
const userDao = new UserDao();

const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      cart: user.cart,
    },
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/register-fail",
    session: false,
  }),
  async (req, res) => {
    res
      .status(201)
      .send({ status: "success", message: "Usuario registrado con éxito" });
  }
);

router.get("/register-fail", async (req, res) => {
  res.status(400).send({
    status: "error",
    message: "Fallo en el registro. Email ya en uso o datos inválidos.",
  });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login-fail",
    session: false,
  }),
  async (req, res) => {
    const token = generateToken(req.user);
    res.cookie("currentUser", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
    });
    res
      .status(200)
      .send({ status: "success", message: "Login exitoso y token generado" });
  }
);

router.get("/login-fail", (req, res) => {
  res.status(401).send({
    status: "error",
    message: "Login fallido: credenciales incorrectas.",
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res
    .status(200)
    .send({ status: "success", message: "Sesión cerrada correctamente" });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "Token inválido o expirado." });
    }
    const userDto = new UserDTO(req.user);
    res.send({ status: "success", payload: userDto });
  }
);

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userDao.getByEmail(email);

    if (!user) {
      return res
        .status(200)
        .send({
          status: "success",
          message: "Si el usuario existe, se ha enviado un correo.",
        });
    }
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    await sendPasswordResetEmail(email, resetToken);
    res
      .status(200)
      .send({
        status: "success",
        message:
          "Si el usuario existe, se ha enviado un correo para restablecer la contraseña.",
      });
  } catch (error) {
    console.error("Error al solicitar restablecimiento:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .send({
        status: "error",
        message: "Faltan datos (token o nueva contraseña).",
      });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;

    const user = await userDao.getByEmail(email);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "Usuario no encontrado." });
    }

    if (isValidPassword(user, newPassword)) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "La nueva contraseña debe ser diferente a la anterior.",
        });
    }

    const newHashedPassword = createHash(newPassword);
    await userDao.updatePassword(user._id, newHashedPassword);
    res
      .status(200)
      .send({
        status: "success",
        message: "Contraseña restablecida con éxito.",
      });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .send({
          status: "error",
          message:
            "El token de restablecimiento ha expirado. Solicite uno nuevo.",
        });
    }
    console.error("Error en el restablecimiento de contraseña:", error);
    res
      .status(500)
      .send({
        status: "error",
        message: "Error interno del servidor o token inválido.",
      });
  }
});

export default router;