import { Message } from "../database/Message";
import { Chat } from "../database/Chat";
import { Product } from "../database/Product";
import { IMessage } from "../types/message.type";
import { IChat, ICreateChat, IChatDTO } from "../types/chat.type";
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
  Inject,
  Delete,
} from "tsoa";

@Tags("Chats")
@Route("api/chats")
export class ChatController extends Controller {
  @Get("/")
  public static async getAllChats(): Promise<IChatDTO[]> {
    return await Chat.find();
  }

  @Security("jwtAuth")
  @Get("/{chatId}/by-id")
  public static async getChatById(
    @Inject() chatId: string,
  ): Promise<IChatDTO | null> {
    const chat = (
      await Chat.findOne({ _id: chatId }).populate(["owner", "product", "buyer"])
    )?.toObject() as IChatDTO;
    const messages = (await Message.find({
      chat: chat?._id,
    })) as IMessage[];
    return { ...chat, messages };
  }

  @Security("jwtAuth")
  @Get("/my-chats")
  public static async myChats(@Inject() userId: string): Promise<IChatDTO[]> {
    return await Chat.find({
      $or: [{ owner: userId }, { buyer: userId }],
    }).populate(["buyer", "product", "owner"]);
  }

  @Security("jwtAuth")
  @Get("/{productId}")
  public static async getChat(
    @Inject() productId: string,
    @Inject() buyerId: string,
  ): Promise<IChatDTO> {
    const product = await Product.findOne({ _id: productId }),
      chat = (
        await Chat.findOne({
          product: productId,
          buyer: buyerId,
        }).populate(["owner", "product", "buyer"])
      )?.toObject() as IChatDTO;
    if (chat) {
      const messages = (await Message.find({
        chat: chat?._id,
      })) as IMessage[];
      return { ...chat, messages };
    } else {
      const createdChat = await Chat.create({
        product: productId,
        buyer: buyerId,
        owner: product?.owner,
      });
      const chat = (
        await Chat.findOne({ _id: createdChat._id }).populate([
          "owner",
          "product",
          "buyer",
        ])
      )?.toObject() as IChatDTO;

      return { ...chat, messages: [] };
    }
  }

  @Security("jwtAuth")
  @Put("/{chatId}")
  public static async updateChat(
    @Path() chatId: string,
    @Body() chat: ICreateChat,
  ): Promise<IChat> {
    const updated = (await Chat.findOneAndUpdate(
      { _id: chatId },
      { $set: chat },
      { new: true },
    )) as IChat;
    return updated;
  }
  @Security("jwtAuth")
  @Delete("{chatId}")
  public static async deleteChat(@Path() chatId: string): Promise<string> {
    await Chat.deleteOne({ _id: chatId });
    return "Deleted successful";
  }
}
