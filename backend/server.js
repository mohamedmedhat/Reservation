import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { Server } from "socket.io";
import ProductRouter from "./routes/product.js";
import UserRouter from "./routes/user.js";
import pdfRouter from "./routes/pdf.js";
import dotenv from "dotenv";
import mongoDb from "./config/connect.js";
import path from "path";
import http from "http";
import { ChatRouter } from "./routes/chat.js";
import Chat from "./models/message.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io logic
io.on("connection", (socket) => {
  console.log("New client connected");

  //fetch previous message on connection
  Chat.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) {
        console.error("Error fetching previous messages", err);
        return;
      }
      socket.emit("previous message", messages.reverse());
    });

  //handle sending a new message
  socket.on("sendMessage", async (message) => {
    try {
      const newMessage = new Chat(message);
      await newMessage.save();
      io.emit("newMessage", newMessage);
    } catch (err) {
      console.error("Error saving message", err);
    }
  });

  //handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Log requests middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

/** middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(compression());
app.use(helmet());

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.get("/", express.static(path.join(__dirname, "../public")));

/** routes */
app.use("/products", ProductRouter);
app.use("/users", UserRouter);
app.use("/chats", ChatRouter);
app.use("/pdfs",  pdfRouter);

/** Swagger options */
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Reservision [express]",
      version: "0.1.0",
      description: "endpoints for booking a hotel",
      licence: {
        name: "",
        url: "",
      },
      contact: {
        name: "Mohamed Medhat",
        url: "",
        email: "mmr973320@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

/** server */
mongoDb();
try {
  server.listen(process.env.PORT || 3000, () => {
    // Changed to use the server instance
    console.log("Server is Running");
  });
} catch (err) {
  console.error("Failed to connect to database");
}
