export interface IUser {
 _id: string;
 id: string;
 provider: string;
 displayName: string;
 name?: {
  familyName: string;
  givenName: string;
  middleName?: string;
 };
 email: string;
 emails?: Array<string>;
 photos?: Array<string>;
}

export type CreateUserDto = Pick<IUser, "name" | "email">;
