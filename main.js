import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mainRouter from "./routes/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const PORT = process.env.PORT || 3000;

export const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Online Education Platform API",
    version: "1.0.0",
    description: "Online Education Platform API description",
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`,
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
app.use("/api", mainRouter);

app.listen(PORT, () =>
  console.log(
    `Server is started on port ${PORT} successfully | Swagger: http://localhost:${PORT}/api-docs`
  )
);
