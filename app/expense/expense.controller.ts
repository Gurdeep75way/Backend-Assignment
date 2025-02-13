import { Request, Response, NextFunction } from "express";
import { ExpenseService } from "./expense.service";
import { io } from "../../socket";

/**
 * Creates a new expense for the authenticated user.
 * @param {Request} req - Express request object containing user ID and expense details in the body.
 * @param {Response} res - Express response object.
 */
export const createExpense = async (req: Request, res: Response) => {
    try {
        const { categoryId, amount } = req.body;
        const userId = req?.user?.id;

        const expense = await ExpenseService.createExpense(String(userId), categoryId, amount);
        res.status(201).json(expense);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Retrieves all expenses for the authenticated user.
 * @param {Request} req - Express request object with user details.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 */
export const getAllExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const expenses = await ExpenseService.getAllExpenses(req.user.id);
        res.json(expenses);
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves a specific expense by ID for the authenticated user.
 * @param {Request} req - Express request object containing the expense ID.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 */
export const getExpenseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const expense = await ExpenseService.getExpenseById(req.params.id, req.user.id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });

        res.json(expense);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing expense for the authenticated user.
 * @param {Request} req - Express request object containing the expense ID and update details.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 */
export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const updatedExpense = await ExpenseService.updateExpense(req.params.id, req.user.id, req.body);

        io.emit("expenseUpdated", String(req.user.id));
        res.json(updatedExpense);
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes an expense for the authenticated user.
 * @param {Request} req - Express request object containing the expense ID.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 */
export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const deleted = await ExpenseService.deleteExpense(req.params.id, req.user.id);
        if (!deleted) return res.status(404).json({ message: "Expense not found" });

        io.emit("expenseUpdated", String(req.user.id));
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * Generates and downloads an expense report in PDF or CSV format for the authenticated user.
 * @param {Request} req - Express request object with query parameter specifying the format ('pdf' or 'csv').
 * @param {Response} res - Express response object for downloading the report.
 */
export const downloadExpenseReport = async (req: Request, res: Response) => {
    try {
        const format = req.query.format as "pdf" | "csv";
        if (!["pdf", "csv"].includes(format)) {
            return res.status(400).json({ message: "Invalid format. Use pdf or csv" });
        }

        const report = await ExpenseService.generateExpenseReport(String(req?.user?.id), format);

        if (format === "csv") {
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
            return res.send(report);
        }
    } catch (error) {
        res.status(500).json({ message: "Error generating report" });
    }
};
