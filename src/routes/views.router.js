import { Router } from "express";
import ProductsManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productsManager = new ProductsManager(
  path.join(__dirname, "../data/products.json")
);

router.get("/", async (req, res) => {
  try {
    const products = await productsManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).send("Error al cargar los productos");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productsManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send("Error al cargar los productos en tiempo real");
  }
});

export default router;