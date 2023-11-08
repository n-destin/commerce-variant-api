import { ICollege } from "./../types/college.type";
import { Route, Controller, Get, Tags, Security } from "tsoa";
import { College } from "../database/College";

@Tags("Colleges")
@Security("jwtAuth")
@Route("api/colleges")
export class CollegeController extends Controller {
  @Get("/")
  public static async getColleges(): Promise<ICollege[]> {
    return await College.find();
  }
}
