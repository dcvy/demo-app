import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createUserGroupAction,
  deleteUserGroupAction,
  getUserGroupByIdAction,
  getUserGroupsAction,
  updateUserGroupAction,
} from "./userGroup.controller";

export default (app: Application): void => {
  app.get("/user-groups", verifyToken, checkPermission, getUserGroupsAction);

  app.get(
    "/user-groups/:id",
    verifyToken,
    checkPermission,
    getUserGroupByIdAction
  );

  app.post("/user-groups", verifyToken, checkPermission, createUserGroupAction);

  app.put(
    "/user-groups/:id",
    verifyToken,
    checkPermission,
    updateUserGroupAction
  );

  app.delete(
    "/user-groups/:id",
    verifyToken,
    checkPermission,
    deleteUserGroupAction
  );
};
