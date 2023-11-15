import mongoose, { Schema, Document } from "mongoose";

interface IPurpose extends Document {
  name: string;
  slug: string;
}

const purposeSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

purposeSchema.pre<IPurpose>("save", function (next) {
  this.slug = this.name.toUpperCase().replace(/ /g, "-");
  next();
});

export const Purpose = mongoose.model<IPurpose>("Purpose", purposeSchema);
