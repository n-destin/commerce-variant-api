import { Route, Controller, Get, Tags, Security, Inject, Path, Put } from "tsoa";
import { IUser } from "../types/User.type";
import { College } from "../database/College";
import { User } from "../database/User";
College;
@Tags("Users")
@Security("jwtAuth")
@Route("api/users")
export class UserController extends Controller {
  @Get("/profile")
  public static async getMyProfile(@Inject() user: IUser): Promise<IUser> {
    return user;
  }
  @Put("/college/{collegeName}")
  public static async attachCollege(
    @Inject() user: IUser,
    @Path() collegeName: string,
  ) {
    const collegeExists = await College.findOne({ name: collegeName });
    const college = collegeExists ?? (await College.create({ name: collegeName }));
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { college: college._id },
      { new: true },
    ).populate("college");
    return updatedUser;
  }
}
