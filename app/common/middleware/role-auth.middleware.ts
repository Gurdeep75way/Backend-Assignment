import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import process from "process";

// Extend the Request interface to include the user property
interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify the JWT token in the request.
 * 
 * This middleware checks if the request contains a valid JWT token in the `Authorization` header.
 * If the token is valid, it decodes the token and adds the decoded user data to the `req.user` object.
 * If the token is missing, invalid, or expired, it responds with a 401 Unauthorized error.
 * 
 * @async
 * @function verifyToken
 * @param {AuthRequest} req - The Express request object, extended with the `user` property.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {void} Calls the next middleware if the token is valid, or sends a 401 response if invalid.
 * @throws {HttpError} If the token is invalid or expired, an HTTP 401 error is thrown.
 */
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({ message: "Authorization header missing" });
    } else {
      const token = authorization.split(' ')[1];  // Extract the token from the "Bearer <token>" format
      const secretkey = process.env.JWT_SECRET as string;  // Secret key for decoding the token
      const decode = jwt.verify(token, secretkey);  // Verify and decode the token

      if (!decode) {
        res.status(401).send({ message: "Invalid token" });
      } else {
        req.user = decode;  // Attach decoded user data to the request object
        next();  // Proceed to the next middleware or route handler
      }
    }
  } catch (error) {
    next(createHttpError(401, "Unauthorized: Invalid or expired token"));
  }
};
