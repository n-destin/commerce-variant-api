import mongoose from "mongoose";
import { IUser } from "./User.type";
import { IProduct } from "./product.type";
export interface IMessage {
  _id: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
}
export type ICreateMessage = Pick<IMessage, "chat" | "text">;

export interface IMessageDTO {
  _id: mongoose.Types.ObjectId;
  chat: IUser;
  sender: IUser;
  text?: string;
  createdAt?: String;
  updatedAt?: String;
}
