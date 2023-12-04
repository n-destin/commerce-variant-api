import bcrypt from "bcrypt";
import "dotenv/config";
import { appConfig } from "../config/app";

const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10, "b");

export const hashPassword = (plainPassword: string) => {
  const hash = bcrypt.hashSync(plainPassword, salt);
  return hash;
};


export function comparePassword(plainPassword: string, hashedPassword: string) {
  const compare = bcrypt.compareSync(plainPassword, hashedPassword);
  return compare;
}

export function generateToken(payload: any, expiresIn: string) {
  const token = jwt.sign(payload, appConfig.secretKey, { expiresIn });
  return token;
}