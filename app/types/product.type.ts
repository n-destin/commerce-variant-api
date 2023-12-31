import mongoose from "mongoose";
import { IUser } from "./User.type";
import { IPurpose } from "./purpose.type";

export interface Image {
  url: string;
}

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  allowbargaining : Boolean;
  brand: String;
  thumbnail: string;
  gallery: Array<Image>;
  price?: number;
  condition: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  description: string; 
  purpose?: IPurpose; 
  owner?: IUser;
  offersmade : Array<mongoose.Types.ObjectId>; // keep track of the offers made on a product
}
export type ProductDto = Omit<IProduct, "_id">;
export interface IProductResponse extends Omit<IProduct, "condition" | "category"> {
  condition?: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  category?: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  college?: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  owner?: IUser;
}

export interface ISingleProductResponse extends IProductResponse {
  similar: IProductResponse[];
  isOrdered?: boolean;
}

export interface IProductFilter {
  categories: string[];
  colleges: string[];
}

export interface IProductLog {
  _id: mongoose.Types.ObjectId;
  text: string;
  user?: IUser;
  createdAt: Date;
}

export interface IHomepageProduct {
  sale: IProductResponse[];
  other: IProductResponse[];
}
