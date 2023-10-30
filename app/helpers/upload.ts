import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Request } from "express";
import { v4 } from "uuid";
import { appConfig } from "../config/app";

cloudinary.config({
    api_key: appConfig.cloudinaryApiKey,
    api_secret: appConfig.cloudinaryApiSecret,
    cloud_name: appConfig.cloudName,
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
