import { Router } from "express";
import Product from "../models/product.js";
import Cart from "../models/cart.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { category: query } : {};
    const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : {};

    const result = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOptions,
      lean: true,
    });

    res.render("home", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).send("Error al cargar los productos.");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send("Error al cargar los productos en tiempo real.");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado.");
    }

    res.render("cart", { cart: cart });
  } catch (error) {
    res.status(500).send("Error al cargar el carrito.");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado.");
    }
    res.render("productDetails", { product: product });
  } catch (error) {
    res.status(500).send("Error al cargar los detalles del producto.");
  }
});

export default router;