import CartDao from "../dao/cartDao.js";
import ProductDao from "../dao/productDao.js";
import TicketModel from "../models/ticket.js";
import { v4 as uuidv4 } from "uuid";

const productDao = new ProductDao();
const cartDao = new CartDao();

class CartRepository {
  async createCart() {
    return await cartDao.create();
  }

  async getCartById(cid) {
    return await cartDao.getById(cid);
  }

  async updateCart(cid, cartData) {
    return await cartDao.update(cid, cartData);
  }

  async deleteCart(cid) {
    return await cartDao.delete(cid);
  }

  async addProductToCart(cid, productData) {
    return await cartDao.updateProductInCart(cid, productData);
  }

  async removeProductFromCart(cid, pid) {
    return await cartDao.deleteProductFromCart(cid, pid);
  }

  async purchase(cid, userEmail) {
    const cart = await cartDao.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado.");

    let productsToPurchase = [];
    let productsNotPurchased = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product;
      const requiredQuantity = item.quantity;

      if (product.stock >= requiredQuantity) {
        const newStock = product.stock - requiredQuantity;
        await productDao.update(product._id, { stock: newStock });
        productsToPurchase.push(item);
        totalAmount += product.price * requiredQuantity;
      } else {
        productsNotPurchased.push(item);
      }
    }

    if (productsToPurchase.length > 0) {
      const ticket = await TicketModel.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: userEmail,
      });

      const newCartProducts = productsNotPurchased.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      await cartDao.update(cid, { products: newCartProducts });
      return {
        ticket: ticket,
        productsNotPurchased: productsNotPurchased,
      };
    } else {
      throw new Error(
        "No se pudo comprar ningún producto. Stock insuficiente en todos los ítems."
      );
    }
  }
}

export default CartRepository;
