import mongoose from "mongoose";
export interface Image {
  url: string;
}
export interface INotice {
  _id: mongoose.Types.ObjectId;
  name: string;
  photo: string;
  description: string
}
export type ICreateNotice = Omit<INotice, "_id">;
