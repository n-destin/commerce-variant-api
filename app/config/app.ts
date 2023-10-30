import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    environment: process.env.NODE_ENV as string,
    PORT: process.env.PORT || 4321,
    databaseUrl: process.env.DATABASE_URL!,
    jwtKey: process.env.JWT_SECRET_KEY!,
    googleCLientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
    googleCLientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUD_NAME,
};
