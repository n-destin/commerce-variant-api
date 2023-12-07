import { ILogin, IProfile, IUser } from "./../types/User.type";
import { Route, Controller, Get, Tags, Inject, Post, Body, Put, Path } from "tsoa";
import { ILoginResponse } from "../types/auth";
import { generateAuthToken } from "../helpers/auth";
import { User } from "../database/User";

import { comparePassword, generateToken, hashPassword } from "../helpers/user.password";
import { appConfig } from "../config/app";
import { sendEmail } from "../helpers/sendEmail";

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

  @Post("/signup")
  public static async createProfile(@Body() user: IProfile): Promise<IUser> {
    const userProfile = {
      ...user,
      password: hashPassword(user.password!),
    }

    const userInfo = await User.create(userProfile) as unknown as IUser
    const message = `You can easily verify your account by clicking on the following link: ${appConfig.userVerifyLink}/${userInfo._id}`
    if (userInfo) {
      sendEmail(userInfo.email,
        message,
        'Account Verification '
      )
    }
    return userInfo
  }

  @Post("/signin")
  public static async login(@Body() user: ILogin) {
    const userInfo = await User.findOne({ email: user.email });
    if (userInfo?.isVerified) {
      const validation = comparePassword(user.password!, userInfo.password!);
      if (validation) {
        const accessToken = generateAuthToken(userInfo._id.toString())
        return { status: 200, data: accessToken, userInfo }
      }
      return { status: 409, data: "invalid credentials" }
    }
    return { status: 409, data: "Your credentials is not verify" }
  }

  @Get("/verify/{userId}")
  public static async userVerify(
    @Path() userId: string,
  ): Promise<IUser> {
    const isVerified = { isVerified: true }
    const updated = (await User.findOneAndUpdate(
      { _id: userId },
      { $set: isVerified },
      { new: true },
    )) as IUser;
    return updated;
  }
}
