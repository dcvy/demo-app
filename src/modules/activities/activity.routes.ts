import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createActivityAction,
  getActivitiesByClothesAction,
} from "./activity.controller";

export default (app: Application): void => {
  app.post("/activities", verifyToken, checkPermission, createActivityAction);

  app.get(
    "/activities/:clothesId",
    verifyToken,
    checkPermission,
    getActivitiesByClothesAction
  );
};
