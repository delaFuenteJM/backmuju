import { Router } from "express";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
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
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === req.params.pid
    );

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== req.params.pid
    );
    await cart.save();
    res.status(200).json({ status: "success", message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    cart.products = req.body.products;
    await cart.save();
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === req.params.pid
    );

    if (!productInCart) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado en el carrito" });
    }

    productInCart.quantity = req.body.quantity;
    await cart.save();
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();
    res.status(200).json({ status: "success", message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;