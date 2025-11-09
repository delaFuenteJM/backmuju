import { Router } from "express";
import ProductsMongoManager from "../managers/mongo/productsMongoManager.js";
import CartsMongoManager from "../managers/mongo/cartsMongoManager.js";
import { privateAccess, publicAccess } from "../middlewares/auth.js";

const router = Router();
const productsManager = new ProductsMongoManager();
const cartsManager = new CartsMongoManager();

router.get("/login", publicAccess, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", publicAccess, (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/", privateAccess, async (req, res) => {
  try {
    const { limit, page, sort, category: query } = req.query;

    const result = await productsManager.getProducts({
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
    const product = await productsManager.getProductById(req.params.pid);
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

export default router;
