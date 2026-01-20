import { activitySchemas, activitySwagger } from "./activity.swagger";
import { authSchemas, authSwagger } from "./auth.swagger";
import { categorySchemas, categorySwagger } from "./category.swagger";
import { clothesSchemas, clothesSwagger } from "./clothes.swagger";
import { orderSchemas, orderSwagger } from "./order.swagger";
import { permissionSchemas, permissionSwagger } from "./permission.swagger";
import { userSchemas, userSwagger } from "./user.swagger";
import { userGroupSchemas, userGroupSwagger } from "./userGroup.swagger";

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce API Documentation",
    version: "1.0.0",
    description: "Hệ thống quản lý Order tích hợp ZaloPay",
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      ...orderSchemas,
      ...activitySchemas,
      ...authSchemas,
      ...categorySchemas,
      ...clothesSchemas,
      ...permissionSchemas,
      ...userGroupSchemas,
      ...userSchemas,
    },
  },
  paths: {
    ...orderSwagger,
    ...activitySwagger,
    ...authSwagger,
    ...categorySwagger,
    ...clothesSwagger,
    ...permissionSwagger,
    ...userGroupSwagger,
    ...userSwagger,
  },
};
