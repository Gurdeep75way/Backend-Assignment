import Category from "./category.schema";
import { Request, Response } from "express";
import { Expense } from "../expense/expense.schema";

/**
 * Creates a new category for the user.
 * 
 * This function handles the creation of a new category, ensuring the budget is not negative and that
 * the category doesn't already exist for the user. If successful, it returns the created category.
 * 
 * @function createCategory
 * @param {Request} req - The Express request object, containing the `name` and `budget` for the new category.
 * @param {Response} res - The Express response object used to send the status and the created category.
 * @returns {void} Sends a response with the created category or an error message if there was an issue.
 */
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, budget } = req.body;
        const userId = req?.user?.id;

        if (budget < 0) return res.status(400).json({ message: "Budget cannot be negative" });

        const existingCategory = await Category.findOne({ name, userId });
        if (existingCategory) return res.status(400).json({ message: "Category already exists" });

        const category = await Category.create({ name, userId, budget });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error creating category" });
    }
};

/**
 * Retrieves all categories for a specific user.
 * 
 * This function fetches all categories associated with the currently authenticated user.
 * 
 * @function getUserCategories
 * @param {Request} req - The Express request object containing the user's ID.
 * @param {Response} res - The Express response object used to send the list of categories.
 * @returns {void} Sends a response with the list of categories or an error message if there was an issue.
 */
export const getUserCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({ userId: req?.user?.id });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
};

/**
 * Updates the budget of an existing category.
 * 
 * This function allows a user to update the budget for a category, ensuring that the new budget is not negative
 * and does not conflict with existing expenses. It also checks that the new budget is greater than the current
 * expenses before updating.
 * 
 * @function updateCategoryBudget
 * @param {Request} req - The Express request object containing the `categoryId` and `newBudget`.
 * @param {Response} res - The Express response object used to send the updated category or an error message.
 * @returns {void} Sends a response with the updated category or an error message if there was an issue.
 */
export const updateCategoryBudget = async (req: Request, res: Response) => {
    try {
        const { categoryId, newBudget } = req.body;
        const userId = req?.user?.id;

        if (newBudget < 0) return res.status(400).json({ message: "Budget cannot be negative" });

        const category = await Category.findOne({ _id: categoryId, userId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Check existing expenses
        const totalExpenses = await Expense.aggregate([
            { $match: { userId, categoryId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const currentExpense = totalExpenses[0]?.total || 0;
        if (currentExpense > newBudget) {
            return res.status(400).json({ message: "New budget must be greater than current expenses" });
        }

        category.budget = newBudget;
        await category.save();

        res.json({ message: "Budget updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error updating budget" });
    }
};

/**
 * Deletes a category for the user.
 * 
 * This function allows a user to delete a category, ensuring that the category is not linked to any existing expenses
 * before performing the deletion. If there are expenses, it prevents the deletion and returns an error.
 * 
 * @function deleteCategory
 * @param {Request} req - The Express request object containing the `categoryId`.
 * @param {Response} res - The Express response object used to send the deletion status or an error message.
 * @returns {void} Sends a response confirming the deletion or an error message if there was an issue.
 */
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        const userId = req?.user?.id;

        const category = await Category.findOne({ _id: categoryId, userId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Check if there are expenses linked to this category
        const expenseCount = await Expense.countDocuments({ userId, categoryId });
        if (expenseCount > 0) {
            return res.status(400).json({ message: "Cannot delete category with existing expenses" });
        }

        await Category.deleteOne({ _id: categoryId, userId });

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
};
