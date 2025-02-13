import { BudgetModel } from "./budget.schema";
import { Expense } from "../expense/expense.schema";
import mongoose from "mongoose";
import CategorySchema from "../category/category.schema";

/**
 * BudgetService class provides methods to calculate and retrieve budget-related summaries and trends.
 * It includes methods for getting budget summaries, category-wise summaries, spending summaries, and spending trends.
 */
export class BudgetService {

    /**
     * Get a summary of the user's total budget, total expenses, and remaining budget.
     * 
     * @param {string} userId - The ID of the user for whom the budget summary is being fetched.
     * @returns {Promise<Object>} A promise that resolves to an object containing the total budget, total expenses, and remaining budget.
     */
    static async getBudgetSummary(userId: string) {
        const categories = await CategorySchema.find({ userId });
        const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0);

        // Get total expenses from the Expense model
        const totalExpenses = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpenseAmount = totalExpenses[0]?.total || 0;

        const result = {
            totalBudget,
            totalExpenses: totalExpenseAmount,
            remainingBudget: totalBudget - totalExpenseAmount
        };
        return result;
    }

    /**
     * Get a summary of expenses for each category.
     * 
     * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the category name, budget, total expense, and remaining budget.
     */
    static async getCategoryWiseSummary() {
        // Get all categories
        const categories = await CategorySchema.find();

        // Get total expenses grouped by category
        const categoryWiseExpense = await Expense.aggregate([
            { $group: { _id: "$categoryId", totalExpense: { $sum: "$amount" } } }
        ]);

        return categories.map(category => {
            const expense = categoryWiseExpense.find(e => String(e._id) === String(category._id));
            return {
                categoryId: category._id,
                categoryName: category.name,
                totalBudget: category.budget,
                totalExpense: expense ? expense.totalExpense : 0,
                remaining: category.budget - (expense ? expense.totalExpense : 0),
            };
        });
    }

    /**
     * Get a summary of spending for a given period (monthly or yearly).
     * 
     * @param {"monthly" | "yearly"} period - The period for which the spending summary is requested ("monthly" or "yearly").
     * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the total spending for each period.
     */
    static async getSpendingSummary(period: "monthly" | "yearly") {
        const groupBy = period === "monthly" ? { year: { $year: "$date" }, month: { $month: "$date" } }
            : { year: { $year: "$date" } };

        const summary = await Expense.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalSpent: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } } // Latest first
        ]);

        return summary.map(entry => ({
            year: entry._id.year,
            month: period === "monthly" ? entry._id.month : undefined,
            totalSpent: entry.totalSpent
        }));
    }

    /**
     * Get a summary of spending trends for each month and category, including suggestions based on the spending.
     * 
     * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the year, month, category, total spending, and suggestions.
     */
    static async getSpendingTrends() {
        const expenses = await Expense.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$date" }, month: { $month: "$date" }, category: "$categoryId" },
                    totalSpent: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);

        const categories = await CategorySchema.find(); // Get category names

        return expenses.map(exp => {
            const category = categories.find(c => String(c._id) === String(exp._id.category));
            return {
                year: exp._id.year,
                month: exp._id.month,
                category: category ? category.name : "Unknown",
                totalSpent: exp.totalSpent,
                suggestion: exp.totalSpent > (category?.budget || 0)
                    ? `You are overspending on ${category?.name}`
                    : `You're within budget for ${category?.name}`
            };
        });
    }
}
