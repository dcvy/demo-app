import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import setupRoutes from "./routes";
import { requestLogger } from "./utils/middlewares/logger.middleware";
import { errorHandler } from "./utils/middlewares/error.middleware";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

dotenv.config();

const app = express();

// app.use(helmet());
app.use(requestLogger);
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_post", (postId) => {
    socket.join(postId);
    console.log("Join post", postId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);
app.use(express.json());

app.get("/demo", (req, res) => {
  const filePath = path.join(__dirname, "../src/public/index.html");
  console.log("🚀 ~ filePath:", filePath);
  res.sendFile(filePath);
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

setupRoutes(app);

app.use(errorHandler);

app.use(express.static(path.join(process.cwd(), "/src/public")));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
