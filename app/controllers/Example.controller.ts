import { Route, Controller, Get, Tags } from "tsoa";
import CustomError from "../utils/CustomError";
@Tags("Zexamples")
@Route("api/example")
export class ExampleController extends Controller {
 @Get("/")
 public static async getExample(): Promise<string> {
  return "Hello, TSOA! app";
 }
 @Get("/error")
 public static async errorExample(): Promise<string> {
  throw new CustomError("this is an example of error with 502 status code", 502);
  return "This will never be executed";
 }
}
