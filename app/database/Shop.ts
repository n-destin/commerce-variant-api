import mongoose from "mongoose";
import { deliveryOptionSchema } from './delivery'
import { policySchema } from "./Policy";
import {inventoryItemSchema} from './inventorySchema'

const shopSchema = new mongoose.Schema({
  name: String,
  headquartersLocation: String,
  owner: mongoose.Types.ObjectId,
  staff : [mongoose.Types.ObjectId],
  marketLocations: [String],
  deliveryOptions: [mongoose.Types.ObjectId],
  policies: mongoose.Types.ObjectId,
  inventory: [mongoose.Types.ObjectId],
  verified: {type : Boolean, default: false}
});