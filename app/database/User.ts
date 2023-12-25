import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  provider: String, // who is provider?
  type : {type: String, enum: {Seller: "Seller", Buyer : "Buyer"}},
  displayName: String,
  phone: String,
  isAdmin: {
    type: Boolean,
    required: false,
  },
  name: {
    familyName: String,
    givenName: String,
    middleName: String,
  },
  email: String,
  emails: Array<string>, // other emails
  photos: Array<string>,
  bankAccount: String,
  bankName: String,
  phoneNumber: String,
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: false,
  },
  isBanned: {
    type: Boolean,
    required: false,
  },
});
export const User = mongoose.model("User", userSchema);
