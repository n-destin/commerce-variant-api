import mongoose from "mongoose";

export const policySchema = new mongoose.Schema({
  shop : mongoose.Types.ObjectId, 
  returnRefundPolicy: String,
  termsOfService: String,
  shippingPolicy: String,
  contactInformation: String,
});


export const policyModel = mongoose.model("Policy", policySchema);