import ProductDao from "../dao/productDao.js";

const productDao = new ProductDao();

class ProductRepository {
  async getProducts(filter, options) {
    return await productDao.get(filter, options);
  }

  async getProductById(pid) {
    return await productDao.getById(pid);
  }

  async createProduct(productData) {
    return await productDao.create(productData);
  }

  async updateProduct(pid, productData) {
    return await productDao.update(pid, productData);
  }

  async deleteProduct(pid) {
    return await productDao.delete(pid);
  }
}

export default ProductRepository;
