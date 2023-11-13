import mongoose from "mongoose";
const ImageSchema = new mongoose.Schema({
  url: String,
});
const productSchema = new mongoose.Schema({
  name: String,
  thumbnail: String,
  gallery: [ImageSchema],
  price: Number,
  condition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Condition",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: String,
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
