import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    availableQuantity: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);