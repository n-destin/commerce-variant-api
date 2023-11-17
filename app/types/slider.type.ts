import mongoose from "mongoose";
export interface ISlider {
  _id: mongoose.Types.ObjectId;
  title: string;
  photo: string;
  description: string;
  type: string;
  sliderStatus: string
}
export type ICreateSlider = Omit<ISlider, "_id">;

export interface IFilters {
  type: string,
}
