import { ILogin, IProfile, IUser, isVerified } from "./../types/User.type";
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

    const accessToken = generateAuthToken(userInfo._id)

    const message = `You can easily verify your account by clicking on the following link: ${appConfig.userVerifyLink}?token=${accessToken}`
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

  @Post("/forgot-password")
  public static async forgotPassword(@Body() user: ILogin) {
    const userInfo = await User.findOne({ email: user.email }) as unknown as IUser;
    const accessToken = generateAuthToken(userInfo._id)
    if (userInfo?.email) {
      const message = `We are sending you this email because you requested a password reset.
      Click on the link below to create a new password ${appConfig.resetPassword}?token=${accessToken}`
      sendEmail(userInfo.email,
        message,
        'Reset Password'
      )
      return { status: 200, data: "Please check your email for instruction to change your password" }
    }
    return { status: 409, data: "Invalid Email" }
  }

  @Post("/reset-password")
  public static async resetPassword(@Body() user: ILogin) {
    const userProfile = {
      ...user,
      isVerified: true,
      password: hashPassword(user.password!),
    }

    const updated = (await User.findOneAndUpdate(
      { _id: userProfile.userId },
      { $set: userProfile },
      { new: true },
    )) as ILogin;

    return updated
  }

  @Get("/verify")
  public static async userVerify(
    @Inject() userInfo: isVerified,
  ): Promise<IUser> {
    const isVerified = { isVerified: true }
    const updated = (await User.findOneAndUpdate(
      { _id: userInfo.userId },
      { $set: isVerified },
      { new: true },
    )) as IUser;
    return updated;
  }
}
