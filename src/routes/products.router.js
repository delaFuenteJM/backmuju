import { Router } from "express";
import ProductsMongoManager from "../managers/mongo/productsMongoManager.js";

const router = Router();
const productsManager = new ProductsMongoManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category } = req.query;

    const result = await productsManager.getProducts({
      limit,
      page,
      sort,
      category,
    });

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener productos", details: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productsManager.getProductById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener producto", details: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productsManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al crear producto", details: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productsManager.updateProduct(
      req.params.pid,
      req.body
    );
    if (!updatedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al actualizar producto", details: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productsManager.deleteProduct(req.params.pid);
    if (!deletedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar producto", details: error.message });
  }
});

export default router;