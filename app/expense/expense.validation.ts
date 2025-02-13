import Joi from "joi";

/**
 * Schema to validate the creation of an expense.
 * @typedef {Object} CreateExpense
 * @property {string} category - The category of the expense (required).
 * @property {number} amount - The amount of the expense (must be a positive number).
 * @property {string} [description] - A description of the expense (optional).
 * @property {Date} [date] - The date the expense was made (optional).
 */
export const createExpenseSchema = Joi.object({
    category: Joi.string().min(1).required().messages({
        "string.empty": "Category is required",
    }),
    amount: Joi.number().positive().required(),
    description: Joi.string().optional(),
    date: Joi.date().optional(),
});

/**
 * Schema to validate the update of an existing expense.
 * @typedef {Object} UpdateExpense
 * @property {string} [category] - The category of the expense (optional).
 * @property {number} [amount] - The amount of the expense (optional, must be a positive number).
 * @property {string} [description] - A description of the expense (optional).
 * @property {Date} [date] - The date the expense was made (optional).
 */
export const updateExpenseSchema = Joi.object({
    category: Joi.string().optional(),
    amount: Joi.number().positive().optional(),
    description: Joi.string().optional(),
    date: Joi.date().optional(),
});
