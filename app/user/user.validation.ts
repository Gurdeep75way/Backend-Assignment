import { body } from "express-validator";

/**
 * Validation rules for creating a new user.
 * Ensures that name, email, and password are provided and are of type string.
 */
export const createUser = [
    body("name").notEmpty().withMessage("name is required").isString().withMessage("name must be a string"),
    body("email").notEmpty().withMessage("email is required").isString().withMessage("email must be a string"),
    body("password").notEmpty().withMessage("password is required").isString().withMessage("password must be a string"),
];

/**
 * Validation rules for updating an existing user.
 * Requires name, email, and password to be present and ensures they are of type string.
 */
export const updateUser = [
    body("name").notEmpty().withMessage("name is required").isString().withMessage("name must be a string"),
    body("email").notEmpty().withMessage("email is required").isString().withMessage("email must be a string"),
    body("password").notEmpty().withMessage("password is required").isString().withMessage("password must be a string"),
];

/**
 * Validation rules for partially editing a user.
 * Fields are optional but must be of type string if provided.
 */
export const editUser = [
    body("name").optional().isString().withMessage("name must be a string"),
    body("email").optional().isString().withMessage("email must be a string"),
    body("password").optional().isString().withMessage("password must be a string"),
];

/**
 * Validation rules for user login.
 * Ensures that email is in a valid format and password is provided.
 */
export const loginUser = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
];
