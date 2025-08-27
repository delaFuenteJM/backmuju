import { Router } from "express";
import CartsManager from "../managers/CartManager.js";

const router = Router();
const cartsManager = new CartsManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartsManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
