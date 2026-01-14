import swaggerJsdoc from "swagger-jsdoc";

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

  apis: ["./src/**/*.ts", "./dist/**/*.js", "./src/modules/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
