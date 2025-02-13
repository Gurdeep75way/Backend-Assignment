import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Budget Management API Documentation",
            version: "1.0.0",
            description: "API documentation for the Budget Management System",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Local Development Server",
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
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "User ID" },
                        name: { type: "string", description: "User's full name" },
                        email: { type: "string", description: "User's email address" },
                        password: { type: "string", description: "User's hashed password" },
                        expenses: { type: "array", items: { type: "string" }, description: "User's expenses" },
                        budgets: { type: "array", items: { type: "string" }, description: "User's budgets" },
                        createdAt: { type: "string", format: "date-time", description: "Timestamp" },
                        updatedAt: { type: "string", format: "date-time", description: "Timestamp" },
                    },
                    required: ["name", "email", "password"],
                },
                Budget: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Budget ID" },
                        title: { type: "string", description: "Budget title" },
                        amount: { type: "number", description: "Budgeted amount" },
                        categoryId: { type: "string", description: "Associated category ID" },
                        userId: { type: "string", description: "User ID who owns the budget" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                    required: ["title", "amount", "categoryId", "userId"],
                },
                Expense: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Expense ID" },
                        userId: { type: "string", description: "User ID" },
                        categoryId: { type: "string", description: "Category ID" },
                        amount: { type: "number", description: "Expense amount" },
                        description: { type: "string", description: "Expense details" },
                        date: { type: "string", format: "date-time", description: "Date of expense" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                    required: ["userId", "categoryId", "amount"],
                },
                Category: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Category ID" },
                        name: { type: "string", description: "Category name" },
                        userId: { type: "string", description: "User ID who owns the category" },
                        budget: { type: "number", description: "Budget for this category" },
                    },
                    required: ["name", "userId", "budget"],
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        "/Users/loveprLovepreeteet/Documents/Assignment-Backend/app/user/user.route.ts",
        "/Users/loveprLovepreeteet/Documents/Assignment-Backend/app/budget/budget.route.ts",
        "/Users/loveprLovepreeteet/Documents/Assignment-Backend/app/expense/expense.route.ts",
        "/Users/loveprLovepreeteet/Documents/Assignment-Backend/app/category/category.route.ts",
    ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerSetup = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
