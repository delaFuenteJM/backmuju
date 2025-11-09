import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/passport.config.js";

const router = Router();

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
  res
    .status(400)
    .send({
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
  res
    .status(401)
    .send({
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
    res.send({ status: "success", user: req.user });
  }
);

export default router;