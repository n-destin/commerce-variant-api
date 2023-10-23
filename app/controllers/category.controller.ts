import { Category } from "../database/Category";
import { ICategory, ICreateCategory } from "./../types/category.type";
import { Route, Controller, Get, Tags, Security, Post, Body } from "tsoa";

@Tags("Categories")
@Route("api/categories")
export class CategoryController extends Controller {
 @Get("/")
 public static async getAllCategories(): Promise<ICategory[]> {
  return await Category.find();
 }
 @Security("jwtAuth")
 @Post("/")
 public static async createCategory(
  @Body() category: ICreateCategory,
 ): Promise<ICategory> {
  return (await Category.create(category)) as ICategory;
 }
}
