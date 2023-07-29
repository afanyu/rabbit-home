import path from "path";
import express, { json } from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import Message from "./models/Message.js";
import message from "./controllers/messageController.js";
import messageRouter from "./routes/messageRoutes.js";
import roomRouter from './routes/roomRoutes.js'
import Room from "./models/Room.js";

dotenv.config();

// Invoke connectDB
connectDB();

const app = express();
// const server = createServer(app)
// const socketIO = new Server(server);

const io = new Server(process.env.SOCKET_PORT, {
	cors: {
		origin: "http://localhost:3000",
	},
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Connection established");

  getMostRecentMessages()
    .then((results) => {
      socket.emit("mostRecentMessages", [...results.reverse()]);
    })
    .catch((error) => {
      socket.emit("mostRecentMessages", []);
    });

  socket.on("newChatMessage", (data) => {
    //send event to every single connected socket
    console.log(data);
    try {
      const message = new Message(data);
      const roomId = data.room;
      message
        .save()
        .then((res) => {
          console.log(res);
          io.emit("newChatMessage", res);
        })
        .catch((error) => console.log("error:", error));
    } catch (e) {
      console.log("error:", e);
    }
  });
  socket.on("disconnect", () => {
    console.log("connection disconnected");
  });
});

/**
 * get 10 last messages
 * @returns {Promise<Model[]>}
 */
async function getMostRecentMessages() {
  return await message.getAllMessages();
}

// Mount routes to respective imports
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/room", roomRouter);
app.use("/api/message", messageRouter);

app.get("/api/config/paypal", (req, res) =>
  res.status(503).json({ message: "Unimplemented" })
);

// Make uploads folder static
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Load build folder as static ONLY in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  // test get route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error middleware for 404
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// Set port number
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )
);
