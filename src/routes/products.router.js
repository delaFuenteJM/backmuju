import { Router } from "express";
import ProductsManager from "../managers/ProductManager.js";

const router = Router();
const productsManager = new ProductsManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productsManager.getProducts();
    if (!isNaN(limit)) {
      return res.json(products.slice(0, limit));
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productsManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productsManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productsManager.updateProduct(
      req.params.pid,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await productsManager.deleteProduct(req.params.pid);
    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
