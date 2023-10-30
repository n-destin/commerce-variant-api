import { Route, Controller, Post, Tags, Inject, UploadedFiles } from "tsoa";
import { Request } from "express";
@Tags("Assets")
@Route("api/assets")
export class AssetsController extends Controller {
    @Post("/")
    public static async uploadAssets(
        @UploadedFiles("assets") assets: Express.Multer.File[],
    ): Promise<string[]> {
        return assets.map((asset: Express.Multer.File) => asset.path);
    }
}
