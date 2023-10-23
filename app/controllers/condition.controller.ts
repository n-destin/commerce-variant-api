import { Condition } from "../database/Conditions";
import { Route, Controller, Get, Tags, Security, Post, Body } from "tsoa";
import { ICondition, ICreateCondition } from "../types/condition.type";

@Tags("Conditions")
@Route("api/conditions")
export class ConditionController extends Controller {
 @Get("/")
 public static async getConditions(): Promise<ICondition[]> {
  return await Condition.find();
 }
 @Security("jwtAuth")
 @Post("/")
 public static async createCondition(
  @Body() condition: ICreateCondition,
 ): Promise<ICondition> {
  return (await Condition.create(condition)) as ICondition;
 }
}
