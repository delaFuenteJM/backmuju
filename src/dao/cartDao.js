import CartModel from '../models/cart.js';

class CartDao {
    async create() {
        return await CartModel.create({ products: [] });
    }

    async getById(cid) {
        return await CartModel.findById(cid).populate('products.product').lean();
    }

    async update(cid, cartData) {
        return await CartModel.findByIdAndUpdate(cid, cartData, { new: true });
    }

    async delete(cid) {
        return await CartModel.findByIdAndDelete(cid);
    }
    
    async updateProductInCart(cid, productData) {
        const { pid, quantity } = productData;
        return await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $inc: { 'products.$.quantity': quantity } },
            { new: true }
        ) || await CartModel.findByIdAndUpdate(
            cid,
            { $push: { products: { product: pid, quantity: quantity } } },
            { new: true }
        );
    }

    async deleteProductFromCart(cid, pid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );
    }
}

export default CartDao;