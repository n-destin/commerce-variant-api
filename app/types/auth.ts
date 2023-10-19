import { IUser } from "./User.type";

export interface ILoginResponse {
 accessToken: string;
 user: IUser;
}
