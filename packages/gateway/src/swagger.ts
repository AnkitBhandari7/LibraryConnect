
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const swaggerSetup = (app: Express) => {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Library API Gateway",
                version: "1.0.0",
                description: "REST API Gateway for gRPC Library Management",
            },
            servers: [{ url: "http://localhost:3000" }],
        },
        apis: ["./src/routes/*.ts"], // Scan route files for docs
    };

    const swaggerSpec = swaggerJsdoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
