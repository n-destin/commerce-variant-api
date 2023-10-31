import mongoose from "mongoose";

export interface IPurpose {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
}

export type ICreatePurpose = Pick<IPurpose, "name">;
