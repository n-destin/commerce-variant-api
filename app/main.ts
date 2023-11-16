import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import apiRouter from "./routes/api.routes";
import { appConfig } from "./config/app";
import CustomError from "./utils/CustomError";
import cors from "cors";
import connectDB from "./config/db";
import passport from "passport";
import session from "express-session";
import { initAuthStategies } from "./utils/authStrategies";
import { Server } from "socket.io";
import { createServer } from "http"; // Use 'http' instead of 'node:http'
import { ChatController } from "./controllers/chat.controller";
import { MessageController } from "./controllers/message.controller";
import { send } from "process";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Specify the origin for CORS
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(
  session({
    secret: "_",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(express.json());
app.use(express.static("public"));
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
);
app.use("/api", apiRouter);
initAuthStategies();
passport.serializeUser((user, done) => {
  done(null, user);
});

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  // You can write your socket event listeners here...
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });

  socket.on("get-chat-threads", async (userId: string) => {
    const threads = await ChatController.myChats(userId);
    socket.join(userId);
    io.to(userId).emit("retrieved-chat-threads", threads);
  });

  socket.on("send-message", async ({ sender, ...data }, callback) => {
    const message = await MessageController.createMessage(data, sender);
    io.to(data.chat).emit("getMessage", message);
    callback(data);
  });

  socket.on("join-room", async (chatId) => {
    try {
      if (chatId.length > 20) {
        socket.join(chatId);
        const chats = await ChatController.getChatById(chatId);
        io.to(chatId).emit("chatHistory", chats);
        console.log("client joined " + chatId);
      }
    } catch (error) {}
  });

  socket.on("sendMessage", (data) => {
    console.log("message received", data);
    io.to(data.chat).emit("getMessage", data);
  });
});

connectDB().then(() => {
  server.listen(appConfig.PORT, () => {
    console.log(`The app is running on port ${appConfig.PORT}`);
  });
});

app.use(
  (err: Error | CustomError, req: Request, res: Response, _next: NextFunction) => {
    res.status(400).json({ error: err.message || "Internal server error" });
  },
);
