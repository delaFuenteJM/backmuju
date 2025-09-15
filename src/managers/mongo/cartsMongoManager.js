import Cart from "../../models/cart.js";

class CartsMongoManager {
  async getCarts() {
    try {
      return await Cart.find().populate("products.product");
    } catch (error) {
      throw new Error("Error al obtener carritos: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate("products.product");
    } catch (error) {
      throw new Error("Error al obtener carrito por ID: " + error.message);
    }
  }

  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      return await newCart.save();
    } catch (error) {
      throw new Error("Error al crear carrito: " + error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = updatedProducts;
      return await cart.save();
    } catch (error) {
      throw new Error("Error al actualizar carrito: " + error.message);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

      cart.products[productIndex].quantity = quantity;

      return await cart.save();
    } catch (error) {
      throw new Error("Error al actualizar cantidad del producto: " + error.message);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      return await cart.save();
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito: " + error.message);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error("Error al vaciar carrito: " + error.message);
    }
  }
}

export default CartsMongoManager;