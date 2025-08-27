import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

class CartsManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => p.product === productId
    );
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartsManager;