import { Router } from "express";
import CartsMongoManager from "../managers/mongo/cartsMongoManager.js";

const router = Router();
const cartsManager = new CartsMongoManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid);
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await cartsManager.deleteProductFromCart(req.params.cid, req.params.pid);
    if (!cart) {
        return res.status(404).json({ status: "error", error: "Carrito o producto no encontrado" });
    }
    res.status(200).json({ status: "success", message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.updateCart(req.params.cid, req.body.products);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await cartsManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito o producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.clearCart(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }
    res.status(200).json({ status: "success", message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;