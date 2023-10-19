import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 id: String,
 provider: String,
 displayName: String,
 name: {
  familyName: String,
  givenName: String,
  middleName: String,
 },
 email: String,
 emails: Array<string>,
 photos: Array<string>,
});

export const User = mongoose.model("User", userSchema);
