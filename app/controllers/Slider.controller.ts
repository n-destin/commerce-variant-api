import { Route, Controller, Get, Tags, Security, Post, Body, Inject, Path, Put } from "tsoa";
import { ICreateSlider, IFilters, ISlider } from "../types/slider.type";
import { Slider } from "../database/Slider";

@Tags("Sliders")
@Route("api/sliders")
export class SliderController extends Controller {
  @Get("/type/ads")
  public static async getAllAdsSliders(): Promise<ISlider[]> {
    return await Slider.find({ type: 'ADSSLIDER', sliderStatus: 'ACTIVE' }).sort({ createdAt: -1 }).limit(5) as ISlider[];
  }
  @Get("/type/hero")
  public static async getAllHeroSliders(): Promise<ISlider[]> {
    return await Slider.find({ type: 'HEROSLIDER', sliderStatus: 'ACTIVE' }).sort({ createdAt: -1 }).limit(5) as ISlider[];
  }

  @Get("/user/my-sliders")
  @Security("jwtAuth")
  public static async getMySliders(
    @Inject() userId: string,
  ): Promise<ISlider[]> {
    return await Slider.find({ owner: userId }).sort({ createdAt: -1 }) as ISlider[];
  }

  @Security("jwtAuth")
  @Post("/")
  public static async createSlider(
    @Body() notice: ICreateSlider,
  ): Promise<ISlider> {
    return (await Slider.create(notice)) as ISlider;
  }

  @Security("jwtAuth")
  @Put("/{sliderId}")
  public static async updateSliderStatus(
    @Path() sliderId: string,
    @Body() sliderStatus: ISlider,
  ): Promise<ISlider> {
    const updated = (await Slider.findOneAndUpdate(
      { _id: sliderId },
      { $set: sliderStatus },
      { new: true },
    )) as ISlider;
    return updated;
  }

}
