import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

/**
 * Middleware to catch validation errors in the request.
 * 
 * This middleware checks if there are any validation errors in the request.
 * If errors are found, it throws an HTTP error with a 400 status code and the list of errors.
 * If no errors are found, it passes control to the next middleware function.
 * 
 * @async
 * @function catchError
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @throws {HttpError} If validation errors are found, it throws an HTTP 400 error.
 */
export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const isError = errors.isEmpty();

    // Check if there are validation errors
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isError) {
      const data = { errors: errors.array() };
      // Throw a 400 HTTP error with validation errors
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    } else {
      next();
    }
  }
);
