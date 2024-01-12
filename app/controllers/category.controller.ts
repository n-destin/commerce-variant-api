import { Category } from "../database/Category";
import { ICategory, ICreateCategory } from "./../types/category.type";
import {
  Route,
  Controller,
  Get,
  Tags,
  Security,
  Post,
  Body,
  Put,
  Path,
  Delete,
} from "tsoa";

@Tags("Categories")
@Route("api/categories")
export class CategoryController extends Controller {
  @Get("/")
  public static async getAllCategories(): Promise<ICategory[]> {
    const toReturn = await Category.find()
    return await Category.find();
  }
  @Security("jwtAuth")
  @Post("/")
  public static async createCategory(
    @Body() category: ICreateCategory,
  ): Promise<ICategory> {
    return (await Category.create(category)) as ICategory;
  }
  @Security("jwtAuth")
  @Put("/{categoryId}")
  public static async updateCategory(
    @Path() categoryId: string,
    @Body() category: ICreateCategory,
  ): Promise<ICategory> {
    const updated = (await Category.findOneAndUpdate(
      { _id: categoryId },
      { $set: category },
      { new: true },
    )) as ICategory;
    return updated;
  }
  @Security("jwtAuth")
  @Delete("{categoryId}")
  public static async deleteCategory(@Path() categoryId: string): Promise<string> {
    await Category.deleteOne({ _id: categoryId });
    return "Deleted successful";
  }
}
