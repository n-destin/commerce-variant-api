import { Message } from "../database/Message";
import { IMessage, ICreateMessage, IMessageDTO } from "./../types/message.type";
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
  Inject,
} from "tsoa";

@Tags("Messages")
@Route("api/messages")
export class MessageController extends Controller {
  @Security("jwtAuth")
  @Post("/")
  public static async createMessage(
    @Body() data: ICreateMessage,
    @Inject() sender: string,
  ): Promise<IMessage> {
    const newMessage = await Message.create({ ...data, sender });
    return (await Message.findById(newMessage._id).populate(
      "chat",
      "sender",
    )) as IMessage;
  }
  @Security("jwtAuth")
  @Put("/{messageId}")
  public static async updateMessage(
    @Path() messageId: string,
    @Body() message: ICreateMessage,
  ): Promise<IMessage> {
    const updated = (await Message.findOneAndUpdate(
      { _id: messageId },
      { $set: message },
      { new: true },
    )) as IMessage;
    return updated;
  }
  @Security("jwtAuth")
  @Delete("{messageId}")
  public static async deleteMessage(@Path() messageId: string): Promise<string> {
    await Message.deleteOne({ _id: messageId });
    return "Deleted successful";
  }
}
