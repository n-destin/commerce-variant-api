import { User } from "../database/User";

export const getUserByEmail = (email: string) => User.findOne({ email });
