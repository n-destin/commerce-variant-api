import mongoose from "mongoose";

export interface Image {
 url: string;
}

export interface IProduct {
 _id: mongoose.Types.ObjectId;
 name: string;
 thumbnail: string;
 gallery: Array<Image>;
 price: number;
 condition: mongoose.Types.ObjectId;
 category: mongoose.Types.ObjectId;
}
export type ProductDto = Omit<IProduct, "_id">;
export interface IProductResponse extends Omit<IProduct, "condition" | "category"> {
 condition: {
  _id: mongoose.Types.ObjectId;
  name: string;
 };
 category: {
  _id: mongoose.Types.ObjectId;
  name: string;
 };
}
