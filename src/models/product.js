import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; 

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, default: "Sin título" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, default: "General" },
    stock: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    thumbnails: { type: [String], default: [] },
});

productSchema.plugin(mongoosePaginate); 

const Product = mongoose.model("Product", productSchema);

export default Product;
