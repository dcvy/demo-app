import dotenv from "dotenv";
dotenv.config();
console.log("CASBIN BOOT MONGO_URI =", process.env.MONGO_URI);

import cors from "cors";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import setupRoutes from "./routes";
import { seedAuthData } from "./seeder";
import { specs } from "./swagger";
import { errorHandler } from "./utils/middlewares/error.middleware";
import { requestLogger } from "./utils/middlewares/logger.middleware";

const app = express();

// app.use(helmet());
app.use(cors());
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// console.log("--- SWAGGER DEBUG ---");
// console.log(JSON.stringify((specs as any).paths, null, 2));

app.get("/demo", (req, res) => {
  const filePath = path.join(__dirname, "../src/public/index.html");
  console.log("🚀 ~ filePath:", filePath);
  res.sendFile(filePath);
});

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Thực hiện seed dữ liệu ngay sau khi kết nối thành công
    try {
      await seedAuthData();
    } catch (seedError) {
      console.error("❌ Seed Auth Data Error:", seedError);
    }

    // Sau khi seed xong mới cho phép server lắng nghe
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Thoát nếu không kết nối được DB
  });

setupRoutes(app);

app.use(errorHandler);

app.use(express.static(path.join(process.cwd(), "/src/public")));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
