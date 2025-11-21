import ProductModel from '../models/product.js';

class ProductDAO {
    async get(filter, options) {
        return await ProductModel.paginate(filter, options);
    }

    async getById(pid) {
        return await ProductModel.findById(pid);
    }

    async create(productData) {
        return await ProductModel.create(productData);
    }

    async update(pid, productData) {
        return await ProductModel.findByIdAndUpdate(pid, productData, { new: true });
    }

    async delete(pid) {
        return await ProductModel.findByIdAndDelete(pid);
    }
}

export default ProductDAO;