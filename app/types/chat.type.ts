import mongoose from "mongoose";
import { IUser } from "./User.type";
import { IProduct } from "./product.type";
import { IMessage } from "./message.type";
export interface IChat {
  _id: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  acceptedPrice: number;
}
export type ICreateChat = Pick<IChat, "buyer" | "product">;

export interface IChatDTO {
  _id: mongoose.Types.ObjectId;
  buyer: IUser;
  product: IProduct;
  acceptedPrice?: number;
  owner: IUser;
  messages?: IMessage[];
}
