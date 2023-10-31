import { Purpose } from "../database/Purpose";
import {
  Route,
  Controller,
  Get,
  Tags,
  Security,
  Post,
  Body,
  Patch,
  Delete,
} from "tsoa";
import { IPurpose, ICreatePurpose } from "../types/purpose.type";

@Tags("Purpose")
@Route("api/purpose")
export class PurposeController extends Controller {
  @Get("/")
  public static async getPurpose(): Promise<IPurpose[]> {
    return await Purpose.find();
  }
  @Security("jwtAuth")
  @Post("/")
  public static async createPurpose(
    @Body() purpose: ICreatePurpose,
  ): Promise<IPurpose> {
    return (await Purpose.create(purpose)) as IPurpose;
  }

  @Security("jwtAuth")
  @Patch("/:id")
  public static async updatePurpose(
    id: string,
    @Body() purpose: ICreatePurpose,
  ): Promise<IPurpose | null> {
    return await Purpose.findByIdAndUpdate(id, purpose, { new: true });
  }
  
  @Security("jwtAuth")
  @Delete("/:id")
  public static async deletePurpose(id: string): Promise<IPurpose | null> {
    return await Purpose.findByIdAndDelete(id);
  }
}
