import { Request, Response, NextFunction } from "express";
import { BudgetService } from "./budget.service";
import mongoose from "mongoose";

/**
 * Controller function to get the budget summary for a user.
 * This includes total budget, total expenses, and remaining budget.
 * 
 * @param {Request} req - The request object, containing user details.
 * @param {Response} res - The response object to send the summary data.
 * @param {NextFunction} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} Resolves with the budget summary or calls next with an error.
 */
export const getBudgetSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?.id;
        if (!mongoose.Types.ObjectId.isValid(String(userId))) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const summary = await BudgetService.getBudgetSummary(String(userId));
        res.json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller function to get the category-wise budget summary.
 * It provides the budget, expenses, and remaining budget for each category.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the category-wise summary.
 * @param {NextFunction} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} Resolves with the category-wise budget summary or calls next with an error.
 */
export const getCategoryWiseSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = await BudgetService.getCategoryWiseSummary();
        res.json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller function to get the spending summary based on the specified period.
 * It can return either a monthly or yearly spending summary.
 * 
 * @param {Request} req - The request object, containing the period query parameter.
 * @param {Response} res - The response object to send the spending summary.
 * @param {NextFunction} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} Resolves with the spending summary or calls next with an error.
 */
export const getSpendingSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { period } = req.query; // "monthly" or "yearly"
        if (!["monthly", "yearly"].includes(period as string)) {
            return res.status(400).json({ success: false, message: "Invalid period. Use 'monthly' or 'yearly'." });
        }

        const summary = await BudgetService.getSpendingSummary(period as "monthly" | "yearly");
        res.json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller function to get the spending trends.
 * It analyzes spending across categories and time periods.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the spending trends.
 * @param {NextFunction} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} Resolves with the spending trends or calls next with an error.
 */
export const getSpendingTrends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trends = await BudgetService.getSpendingTrends();
        res.json({ success: true, data: trends });
    } catch (error) {
        next(error);
    }
};
