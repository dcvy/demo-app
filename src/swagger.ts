import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express Mongo API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "/",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    path.resolve(process.cwd(), "src/modules/**/*.{ts,js}"),
    path.resolve(process.cwd(), "dist/modules/**/*.{ts,js}"),
  ],
};

export const specs = swaggerJsdoc(options);
