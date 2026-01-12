import { Application } from "express";
import { UserController } from "./user.controller";
import { verifyToken } from "../../utils/middlewares/auth.middleware";

export default (app: Application): void => {
  app.get("/users", verifyToken, UserController.getUsers);

  app.get("/users/:id", verifyToken, UserController.getUserById);

  app.post("/users", verifyToken, UserController.create);

  app.put("/users/:id", verifyToken, UserController.update);

  app.delete("/users/:id", verifyToken, UserController.delete);
};
