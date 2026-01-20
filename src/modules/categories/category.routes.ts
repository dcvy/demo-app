import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createCategoryAction,
  deleteCategoryAction,
  getAllCategoriesAction,
  getCategoryByIdAction,
  renderCategoryPageAction,
  updateCategoryAction,
} from "./category.controller";

export default (app: Application): void => {
  app.get("/be/categories", renderCategoryPageAction);

  app.get("/categories", verifyToken, checkPermission, getAllCategoriesAction);
  app.get(
    "/categories/:id",
    verifyToken,
    checkPermission,
    getCategoryByIdAction
  );
  app.post("/categories", verifyToken, checkPermission, createCategoryAction);
  app.put(
    "/categories/:id",
    verifyToken,
    checkPermission,
    updateCategoryAction
  );
  app.delete(
    "/categories/:id",
    verifyToken,
    checkPermission,
    deleteCategoryAction
  );
};
