import { type ErrorRequestHandler } from "express";
import { type ErrorResponse } from "../helper/response.hepler";

/**
 * Middleware for handling errors in the Express application.
 * 
 * This error handler middleware captures any errors that occur during request processing
 * and formats the response as a JSON object. It includes the error code, message, and any additional data.
 * If the error doesn't have a specified status, it defaults to 500 (Internal Server Error).
 * 
 * @function errorHandler
 * @param {any} err - The error object, which may contain a status, message, and additional data.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {void} Sends a formatted error response with the appropriate status code.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response: ErrorResponse = {
    success: false,
    error_code: (err?.status ?? 500) as number,  // Default to 500 if no status is provided
    message: (err?.message ?? "Something went wrong!") as string,  // Default message
    data: err?.data ?? {},  // Additional error data, if available
  };

  res.status(response.error_code).send(response);  // Send the formatted error response
  next();  // Call the next middleware
};

export default errorHandler;
