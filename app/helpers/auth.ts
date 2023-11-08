import { VerifiedCallback } from "passport-jwt";
import passport from "passport";
import googleStrategy from "passport-google-oauth20";

import { User } from "../database/User";
import CustomError from "../utils/CustomError";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";

export const authenticate = async (
  profile: passport.Profile,
  cb: googleStrategy.VerifyCallback | passport.DoneCallback,
) => {
  try {
    const returningUser = await User.findOne({ id: profile.id });
    const user =
      returningUser ??
      (await User.create({ ...profile, email: profile.emails?.[0].value }));
    return cb(null, user);
  } catch (error) {
    console.log(error);
    throw new CustomError("cant create account", 500);
  }
};

export const generateAuthToken = (userId: string) => {
  return jwt.sign({ ref: userId }, appConfig.jwtKey, { expiresIn: 60 * 60 });
};
export const verifyToken = async (
  payload: Record<string, string>,
  callback: VerifiedCallback,
) => {
  try {
    const userExists = await User.findById(payload.ref);
    if (!userExists) {
      throw new CustomError(
        "You can't hack us like that, kindly add more efforts!",
        400,
      );
    }
    callback(null, userExists);
  } catch (error) {
    return callback(false);
  }
};
