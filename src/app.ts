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
import { swaggerDocument } from "./swaggers/index";
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

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
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

setupRoutes(app);

app.use(errorHandler);

app.use(express.static(path.join(process.cwd(), "/src/public")));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
