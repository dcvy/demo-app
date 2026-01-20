import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createClothesAction,
  deleteClothesAction,
  getAllClothesAction,
  getClothesByIdAction,
  renderClothesPageAction,
  updateClothesAction,
} from "./clothes.controller";

export default (app: Application): void => {
  app.get("/be/clothes", renderClothesPageAction);

  app.get("/clothes", verifyToken, checkPermission, getAllClothesAction);
  app.get("/clothes/:id", verifyToken, checkPermission, getClothesByIdAction);
  app.post("/clothes", verifyToken, checkPermission, createClothesAction);
  app.put("/clothes/:id", verifyToken, checkPermission, updateClothesAction);
  app.delete("/clothes/:id", verifyToken, checkPermission, deleteClothesAction);
};
