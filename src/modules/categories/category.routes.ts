import { Application } from "express";
import { CategoryController } from "./category.controller";
import { verifyToken } from "../../utils/middlewares/auth.middleware";

export default (app: Application): void => {
  app.get("/be/categories", CategoryController.renderCategoryPage);

  app.get("/categories", verifyToken, CategoryController.getAll);
  app.post("/categories", verifyToken, CategoryController.create);
  app.put("/categories/:id", verifyToken, CategoryController.update);
  app.delete("/categories/:id", verifyToken, CategoryController.delete);
};
