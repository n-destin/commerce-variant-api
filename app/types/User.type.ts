import { ICollege } from "./college.type";

export interface IUser {
  _id: string;
  id: string;
  provider: string;
  displayName: string;
  isAdmin?: boolean;
  name?: {
    familyName: string;
    givenName: string;
    middleName?: string;
  };
  email: string;
  emails?: Array<string>;
  photos?: Array<string>;
  college?: ICollege;
}

export type CreateUserDto = Pick<IUser, "name" | "email">;
