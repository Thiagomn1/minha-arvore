import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: { type: String, default: "Geral" },
  status: { type: String, default: "Disponível" },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
