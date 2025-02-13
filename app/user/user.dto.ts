import mongoose from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

/**
 * Represents a User in the system.
 * @interface IUser
 * @extends {BaseSchema}
 */
export interface IUser extends BaseSchema {
    /** The name of the user. */
    name: string;

    /** The email address of the user. */
    email: string;

    /** The hashed password of the user. */
    password: string;

    /** An array of Expense IDs associated with the user. */
    expenses: string[]; // References to Expense IDs

    /** An array of Budget IDs associated with the user. */
    budgets: string[]; // References to Budget IDs



    /** The unique identifier for the user. */
    id: string;

    /**
     * Compares a candidate password with the user's hashed password.
     * @param {string} candidatePassword - The password to compare.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the passwords match, otherwise `false`.
     */
    comparePassword: (candidatePassword: string) => Promise<boolean>;

    /**
     * Generates a JSON Web Token (JWT) for the user.
     * @returns {string} - The generated JWT.
     */
    generateJWT: () => string;
}