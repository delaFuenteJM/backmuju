import Product from "../../models/product.js";

class ProductsMongoManager {
  async getProducts({ limit = 10, page = 1, sort, category }) {
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        lean: true,
      };
      
      const query = category ? { category } : {};
      
      const result = await Product.paginate(query, options);
      return result;
    } catch (error) {
      throw new Error("Error al obtener productos: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error("Error al obtener producto por ID: " + error.message);
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error("Error al agregar producto: " + error.message);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }
}

export default ProductsMongoManager;