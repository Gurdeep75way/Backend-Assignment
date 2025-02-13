import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * Schema for validating budget-related data.
 * 
 * This schema defines the validation rules for creating or updating a budget, ensuring that the `title` is a string
 * with a length between 3 and 50 characters, the `amount` is a non-negative number, and the `category` is a string
 * with a length between 3 and 30 characters.
 * 
 * @constant {Joi.ObjectSchema} budgetSchema
 */
const budgetSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    amount: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(30).required(),
});

/**
 * Middleware function for validating budget data in the request body.
 * 
 * This function validates the incoming request data against the `budgetSchema`. If the validation fails,
 * it sends a 400 response with the validation error message. If the validation passes, it moves to the next middleware.
 * 
 * @function validateBudget
 * @param {Request} req - The Express request object containing the `title`, `amount`, and `category` in the body.
 * @param {Response} res - The Express response object used to send a 400 error response if validation fails.
 * @param {NextFunction} next - The next middleware function to be called if validation passes.
 * @returns {void} Sends a response with an error message if validation fails or moves to the next middleware if validation succeeds.
 */
export const validateBudget = (req: Request, res: Response, next: NextFunction) => {
    const { error } = budgetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};
