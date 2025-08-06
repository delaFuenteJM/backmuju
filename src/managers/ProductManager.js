import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newId = products.length > 0 ? parseInt(products[products.length - 1].id) + 1 : 1;

    const newProduct = {
      id: newId.toString(),
      status: true,
      ...product
    };

    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async updateProduct(id, changes) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) {
      return { error: 'Producto no encontrado' };
    }

    delete changes.id;

    products[index] = {
      ...products[index],
      ...changes
    };

    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id != id);

    if (products.length === filtered.length) {
      return { error: 'Producto no encontrado' };
    }

    await this.saveProducts(filtered);
    return { message: 'Producto eliminado' };
  }
}