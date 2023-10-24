import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Request } from "express";
import { v4 } from "uuid";

cloudinary.config({
 api_key: "418112518246142",
 api_secret: "jwj139qTjhsrnyXhyy8c7Z-QWuc",
 cloud_name: "umuhire-heritier",
});
const storage = new CloudinaryStorage({
 cloudinary: cloudinary,
 params: (req: Request, file: Express.Multer.File) => ({
  public_id: v4(),
  folder: "e-commerce",
 }),
});
const upload = multer({ storage: storage });
export default upload;
