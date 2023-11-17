import { IUser } from "./User.type";
import { IProduct } from "./product.type";
import mongoose from "mongoose";

export interface IOrder {
  _id: string;
  product: mongoose.Types.ObjectId;
  orderer: mongoose.Types.ObjectId;
  phone: string;
}

export interface IOrderResponse extends Omit<IOrder, "product" | "orderer"> {
  product: IProduct;
  orderer: IUser;
  days?: number;
}

export interface IOrderDto extends Pick<IOrder, "product"> {
  days?: number;
}

export interface IOrderConfirm {
  orderId: string;
  code: string;
}
