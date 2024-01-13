import {
  Route,
  Controller,
  Get,
  Tags,
  Security,
  Inject,
  Path,
  Put,
  Body,
} from "tsoa";
import { ICompleteProfile, IUser } from "../types/User.type";
import { College } from "../database/College";
import { User } from "../database/User";
@Tags("Users")

@Route("api/users")
export class UserController extends Controller {
  @Security("jwtAuth")
  @Get("/profile")
  public static async getMyProfile(@Inject() user: IUser): Promise<IUser> {
    console.log(user);
    return user;
  }

  @Security("jwtAuth")
  @Put("/college")
  public static async attachCollege(
    @Inject() user: IUser,
    @Body() data: ICompleteProfile,
  ) {
    const collegeExists = await College.findOne({ name: data.college });
    const college = collegeExists ?? (await College.create({ name: data.college }));
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { college: college._id, phone: data.phone },
      { new: true },
    ).populate("college");
    return updatedUser;
  }

  @Security("jwtAuth")
  @Put("/{userId}")
  public static async updateProfile(
    @Path() userId: string,
    @Body() userInfo: IUser,
  ): Promise<IUser> {
    const updated = (await User.findOneAndUpdate(
      { _id: userId },
      { $set: userInfo },
      { new: true },
    )) as IUser;
    return updated;
  }
}
