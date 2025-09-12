import { promises as fs } from "fs";

class CartsManager {
  constructor(path) {
    this.path = path;
  }

  // Nuevo método privado para obtener el próximo ID
  async #getNextId() {
    try {
      const carts = await this.getCarts();
      const maxId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) : 0;
      return maxId + 1;
    } catch (error) {
      // Si el archivo no existe, el primer ID será 1
      return 1;
    }
  }

  async getCarts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getCarts();
    // Usar el nuevo método para generar el ID secuencial
    const newCart = { id: await this.#getNextId(), products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === parseInt(id));
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === parseInt(cartId));
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => p.product === parseInt(productId)
    );
    if (productIndex === -1) {
      cart.products.push({ product: parseInt(productId), quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartsManager;