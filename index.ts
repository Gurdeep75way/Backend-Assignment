/**
 * @fileoverview Main server file for the application.
 * Initializes the Express server, middleware, and database connection.
 */

import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cookieParser from "cookie-parser";
import { initDB } from "./app/common/services/database.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import { configDotenv } from "dotenv";
import { swaggerSetup } from "./app/common/services/config/swagger.config";

// Load environment variables
configDotenv();
loadConfig();

/**
 * Extends Express types globally to include user authentication.
 */
declare global {
  namespace Express {
    /**
     * Extends Express User interface excluding the password field.
     * @extends IUser
     */
    interface User extends Omit<IUser, "password"> { }

    /**
     * Extends Express Request interface to include an optional user property.
     */
    interface Request {
      user?: User;
    }
  }
}

/**
 * Port on which the server will run.
 * @constant {number}
 */
const port = Number(process.env.PORT) || 5000;

/**
 * Express application instance.
 * @constant {Express}
 */
export const app: Express = express();

// Initialize Swagger documentation
swaggerSetup(app);

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

/**
 * Initializes the application.
 * @async
 * @function initApp
 * @returns {Promise<void>}
 */
const initApp = async (): Promise<void> => {
  // Initialize the database connection
  await initDB();

  // Set API routes
  app.use("/api", routes);

  /**
   * Root endpoint to check server status.
   * @name GET /
   * @function
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {void}
   */
  app.get("/", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Error handling middleware
  app.use(errorHandler);

  // Start the HTTP server
  http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

void initApp();
