import { Router } from "express";
import ProductRepository from "../repositories/productRepository.js";
import { privateAccess, publicAccess } from "../middlewares/auth.js";

const router = Router();
const productRepository = new ProductRepository();

router.get("/login", publicAccess, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", publicAccess, (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/", privateAccess, async (req, res) => {
  try {
    const { limit, page, sort, category: query } = req.query;
    const result = await productRepository.getProducts({
      limit,
      page,
      sort,
      category: query,
    });

    const userData = {
      first_name: req.user.first_name,
      role: req.user.role,
    };

    res.render("home", {
      products: result.docs,
      user: userData,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).send("Error al cargar los productos: " + error.message);
  }
});

router.get("/products", (req, res) => {
  res.redirect("/");
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).send("Producto no encontrado.");
    }
    res.render("productDetails", { product: product });
  } catch (error) {
    res
      .status(500)
      .send("Error al cargar los detalles del producto: " + error.message);
  }
});

router.get("/reset-password", publicAccess, (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .render("error", { message: "Token de reseteo no proporcionado." });
  }
  res.render("resetPassword", { title: "Restablecer Contraseña", token });
});

export default router;