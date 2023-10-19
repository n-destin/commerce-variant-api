import { Route, Controller, Get, Tags, Security, Inject } from "tsoa";
import { IUser } from "../types/User.type";
@Tags("Users")
@Security("jwtAuth")
@Route("api/users")
export class UserController extends Controller {
 @Get("/profile")
 public static async getMyProfile(@Inject() user: IUser): Promise<IUser> {
  return user;
 }
}
