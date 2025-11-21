import { Router } from "express";
import CartRepository from "../repositories/cartRepository.js";
import { authMiddleware, passportCall } from "../middlewares/auth.js";

const router = Router();
const cartRepository = new CartRepository();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartRepository.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear carrito", details: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartRepository.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener carrito", details: error.message });
  }
});

router.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  authMiddleware(["user"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity || 1;
      const updatedCart = await cartRepository.addProductToCart(cid, {
        pid,
        quantity,
      });
      if (!updatedCart)
        return res
          .status(404)
          .json({ error: "Carrito o Producto no encontrado" });
      res.json(updatedCart);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al agregar producto", details: error.message });
    }
  }
);
router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authMiddleware(["user"]),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const userEmail = req.user.email;
      const result = await cartRepository.purchase(cid, userEmail);

      res.json({
        status: "success",
        message: "Proceso de compra iniciado. Resultado adjunto.",
        result,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al finalizar compra", details: error.message });
    }
  }
);

export default router;