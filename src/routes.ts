import { Application } from "express";
import activityRoutes from "./modules/activities/activity.routes";
import authRoutes from "./modules/auths/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";
import clothesRoutes from "./modules/clothes/clothes.routes";
import orderRoutes from "./modules/orders/order.routes";
import permissionRoute from "./modules/permissions/permission.route";
import useGroupRoute from "./modules/userGroups/useGroup.route";
import userRoutes from "./modules/users/user.routes";

export default (app: Application): void => {
  app.get("/", (req, res) => res.redirect("/be/login"));
  authRoutes(app);
  userRoutes(app);
  clothesRoutes(app);
  categoryRoutes(app);
  activityRoutes(app);
  useGroupRoute(app);
  permissionRoute(app);
  orderRoutes(app);
};
