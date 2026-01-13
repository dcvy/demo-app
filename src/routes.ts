import { Application } from "express";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import postRoutes from "./modules/posts/post.routes";
import categoryRoutes from "./modules/categories/category.routes";
import activityRoutes from "./modules/activities/activity.routes";
import useGroupRoute from "./modules/userGroups/useGroup.route";
import permissionRoute from "./modules/permissions/permission.route";

export default (app: Application): void => {
  app.get("/", (req, res) => res.redirect("/be/login"));
  authRoutes(app);
  userRoutes(app);
  postRoutes(app);
  categoryRoutes(app);
  activityRoutes(app);
  useGroupRoute(app);
  permissionRoute(app);
};
