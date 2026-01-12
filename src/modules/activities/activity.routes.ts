import { Application } from "express";
import { ActivityController } from "./activity.controller";
import { verifyToken } from "../../utils/middlewares/auth.middleware";

export default (app: Application): void => {
  app.post("/activities", verifyToken, ActivityController.create);

  app.get("/activities/:postId", ActivityController.getByPost);
};
