import { Route, Controller, Get, Tags, Security, Post, Body, Inject } from "tsoa";
import { ICondition } from "../types/condition.type";
import { Notice } from "../database/Notice";
import { ICreateNotice, INotice } from "../types/notice.type";

@Tags("Notice")
@Route("api/notices")
export class NoticeController extends Controller {
  @Get("/")
  public static async getNotices(): Promise<INotice[]> {
    return await Notice.find();
  }

  @Get("/user/my-notices")
  @Security("jwtAuth")
  public static async getMyNotices(
    @Inject() userId: string,
  ): Promise<INotice[]> {
    return await Notice.find({ owner: userId }) as INotice[];
  }

  @Security("jwtAuth")
  @Post("/")
  public static async createNotice(
    @Body() notice: ICreateNotice,
  ): Promise<ICondition> {
    return (await Notice.create(notice)) as INotice;
  }
}
