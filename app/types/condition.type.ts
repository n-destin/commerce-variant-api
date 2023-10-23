import mongoose from "mongoose";
export interface ICondition {
 _id: mongoose.Types.ObjectId;
 name: string;
}
export type ICreateCondition = Pick<ICondition, "name">;
