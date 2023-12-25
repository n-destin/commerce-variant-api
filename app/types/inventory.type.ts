import mongoose from "mongoose";

export interface IInventoryItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  location: string;
}
