import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createUserAction,
  deleteUserAction,
  getUserByIdAction,
  getUsersAction,
  updateUserAction,
} from "./user.controller";

export default (app: Application): void => {
  app.get("/users", verifyToken, checkPermission, getUsersAction);
  app.get("/users/:id", verifyToken, checkPermission, getUserByIdAction);
  app.post("/users", verifyToken, checkPermission, createUserAction);
  app.put("/users/:id", verifyToken, checkPermission, updateUserAction);
  app.delete("/users/:id", verifyToken, checkPermission, deleteUserAction);
};
