import { ICollege } from "./../types/college.type";
import { Route, Controller, Get, Tags } from "tsoa";
import { College } from "../database/College";

@Tags("Colleges")
@Route("api/colleges")
export class CollegeController extends Controller {
  @Get("/")
  public static async getColleges(): Promise<ICollege[]> {
    return await College.find();
  }
}
