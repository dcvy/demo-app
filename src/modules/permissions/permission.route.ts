import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  assignPermissionToGroupAction,
  assignRoleToUserAction,
  getAllPermissionsAction,
} from "./permission.controller";

export default (app: Application) => {
  app.post(
    "/permissions/assign-group",
    verifyToken,
    checkPermission,
    assignPermissionToGroupAction
  );

  app.post(
    "/permissions/assign-user",
    verifyToken,
    checkPermission,
    assignRoleToUserAction
  );

  app.get(
    "/permissions",
    verifyToken,
    checkPermission,
    getAllPermissionsAction
  );
};
