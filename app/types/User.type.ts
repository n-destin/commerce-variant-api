import { ICollege } from "./college.type";

export interface IUser {
  _id: string;
  id: string;
  provider: string;
  displayName: string;
  isAdmin?: boolean;
  bankName?: String;
  bankAccount?: String;
  phoneNumber?: String;
  name?: {
    familyName: string;
    givenName: string;
    middleName?: string;
  };
  email: string;
  emails?: Array<string>;
  photos?: Array<string>;
  college?: ICollege;
  phone?: string;
}

export interface ICompleteProfile {
  college: string;
  phone: string;
}
export type CreateUserDto = Pick<IUser, "name" | "email">;
