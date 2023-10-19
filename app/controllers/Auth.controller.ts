import { IUser } from "./../types/User.type";
import { Route, Controller, Get, Tags, Inject } from "tsoa";
import { ILoginResponse } from "../types/auth";
import { generateAuthToken } from "../helpers/auth";

@Tags("Authentication")
@Route("api/auth")
export class AuthController extends Controller {
 @Get("/signin/google")
 public static async googleSignin(): Promise<string> {
  return "Redirects to login page";
 }
 @Get("/google/redirect")
 public static async socialLogin(@Inject() user: IUser): Promise<ILoginResponse> {
  const accessToken = generateAuthToken(user._id);
  return {
   accessToken,
   user,
  };
 }
}
