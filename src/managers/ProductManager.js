import { promises as fs } from "fs";

class ProductsManager {
  constructor(path) {
    this.path = path;
  }

  async #getNextId() {
    const products = await this.getProducts();
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    return maxId + 1;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === parseInt(id)); 
  }

  async addProduct(product) {
    const products = await this.getProducts();

    if (!product.title || !product.price) {
      throw new Error("Título y precio son obligatorios");
    }

    const newProduct = { id: await this.#getNextId(), ...product };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    if (filtered.length === products.length) return false;

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}

export default ProductsManager;