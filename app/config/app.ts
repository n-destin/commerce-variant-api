import dotenv from "dotenv";
dotenv.config();

// clientID: "",
// clientSecret: "",
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
  frontEndUrl: process.env.FRONTEND_URL!,
  appUrl: process.env.APP_URL!,
  mailerUsernmae: process.env.MAILER_USERNAME,
  mailerPassword: process.env.MAILER_PASSWORD,
  mailerService: process.env.MAILER_SERVICE,
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID!,
  microsoftSecret: process.env.MICROSOFT_SECRET_KEY!,
  userVerifyLink: process.env.USER_VERIFY_LINK,
  secretKey: process.env.SECRETE_KEY
};
