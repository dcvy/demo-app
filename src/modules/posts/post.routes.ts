import { Application } from "express";
import { PostController } from "./post.controller";
import { verifyToken } from "../../utils/middlewares/auth.middleware";

export default (app: Application): void => {
  app.get("/be/posts", PostController.renderPostPage);

  app.get("/posts", verifyToken, PostController.getPosts);
  app.post("/posts", verifyToken, PostController.create);
  app.put("/posts/:id", verifyToken, PostController.update);
  app.delete("/posts/:id", verifyToken, PostController.delete);
};
