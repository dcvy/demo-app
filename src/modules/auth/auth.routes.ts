import { Application } from "express";
import { AuthController } from "./auth.controller";

export default (app: Application) => {
  app.get("/be/login", AuthController.renderLoginPage);
  app.post("/login", AuthController.login);
};
