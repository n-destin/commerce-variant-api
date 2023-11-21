import { Route, Controller, Get, Put, Tags, Security, Path } from "tsoa";
import { IUser } from "../types/User.type";
import { User } from "../database/User";

@Tags("Users")
@Route("api/all-users")
@Security("jwtAuth")
export class AllUsersController extends Controller {
  @Get("/")
  public async getAllUsers(): Promise<IUser[]> {
    return await User.find({});
  }

  @Put("/ban/{userId}")
  public async banUser(@Path("userId") userId: string): Promise<IUser | null> {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return await User.findOneAndUpdate({ id: userId }, { isBanned: true }, { new: true });
  }

  @Put("/unban/{userId}")
  public async unbanUser(@Path("userId") userId: string): Promise<IUser | null> {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return await User.findOneAndUpdate({ id: userId }, { isBanned: false }, { new: true });
  }
}