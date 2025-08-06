import fs from 'fs/promises';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.#readFile();

    let newId = 1;
    if (carts.length > 0) {
      const lastCartId = parseInt(carts[carts.length - 1].id);
      if (!isNaN(lastCartId)) {
        newId = lastCartId + 1;
      }
    }

    const newCart = {
      id: newId.toString(),
      products: []
    };

    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find(cart => cart.id == id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.#readFile();

    const cartIndex = carts.findIndex(c => c.id == cid);
    if (cartIndex === -1) {
      return { error: 'Carrito no encontrado' };
    }

    const cart = carts[cartIndex];

    const existingProduct = cart.products.find(p => p.product == pid);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await this.#writeFile(carts);
    return cart;
  }
}