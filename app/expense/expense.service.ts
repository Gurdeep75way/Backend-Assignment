import { Expense } from "./expense.schema";
import Category from "../category/category.schema";
import mongoose from "mongoose";
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from "path";

export class ExpenseService {
    /**
     * Generates an expense report in either PDF or CSV format.
     * @param {string} userId - The ID of the user.
     * @param {'pdf' | 'csv'} format - The desired report format.
     * @returns {Promise<string>} - The file path or CSV data.
     */
    static async generateExpenseReport(userId: string, format: 'pdf' | 'csv') {
        const expenses = await Expense.find({ userId }).populate("categoryId", "name budget");

        if (format === 'csv') {
            const csvParser = new Parser({ fields: ["category", "amount", "budget", "date"] });
            const csvData = expenses.map(expense => ({
                category: (expense.categoryId as any).name,
                amount: expense.amount,
                budget: (expense.categoryId as any).budget,
                date: expense.date.toISOString(),
            }));
            return csvParser.parse(csvData);
        }

        const reportsDir = path.join(__dirname, "../reports");

        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const filePath = path.join(reportsDir, `expense_report_${userId}.pdf`);

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "");
        }

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(18).text("Expense Report", { align: "center" });
        doc.moveDown();

        expenses.forEach(expense => {
            const category = expense.categoryId ? (expense.categoryId as any).name : "Unknown";
            const budget = expense.categoryId ? (expense.categoryId as any).budget : "N/A";

            doc.fontSize(12).text(`Category: ${category}`);
            doc.text(`Amount: ${expense.amount}`);
            doc.text(`Budget: ${budget}`);
            doc.text(`Date: ${expense.date.toISOString()}`);
            doc.moveDown();
        });

        doc.end();
        return filePath;
    }

    /**
     * Creates a new expense with budget validation.
     * @param {string} userId - The ID of the user.
     * @param {string} categoryId - The ID of the category.
     * @param {number} amount - The amount of the expense.
     * @returns {Promise<any>} - The created expense.
     */

    static async createExpense(userId: string, categoryId: string, amount: number) {
        try {
            console.log("Received userId:", userId);
            console.log("Received categoryId:", categoryId);

            const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
            const userObjectId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

            console.log("Converted categoryId:", categoryObjectId);
            console.log("Converted userId:", userObjectId);

            const category = await Category.findOne({ _id: categoryObjectId, userId: userObjectId });

            console.log("Fetched category:", category);

            if (!category) throw new Error("Invalid category");

            const currentExpense = await this.getTotalExpensesByCategory(userId, categoryId);
            if (currentExpense + amount > category.budget) {
                throw new Error("Expense exceeds category budget");
            }

            return await Expense.create({ userId, categoryId, amount });
        } catch (error) {
            console.error("Error in createExpense:", error);
            throw new Error(`Error creating expense: ${error}`);
        }
    }
    /**
     * Retrieves all expenses for a user with category details.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<any[]>} - A list of expenses.
     */
    static async getAllExpenses(userId: string) {
        return await Expense.find({ userId })
            .populate("categoryId", "name budget")
            .sort({ date: -1 });
    }

    /**
     * Retrieves the total expenses for a specific category.
     * @param {string} userId - The ID of the user.
     * @param {string} categoryId - The ID of the category.
     * @returns {Promise<number>} - The total expenses in the category.
     */
    static async getTotalExpensesByCategory(userId: string, categoryId: string) {
        const totalExpenses = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), categoryId: new mongoose.Types.ObjectId(categoryId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        return totalExpenses[0]?.total || 0;
    }

    /**
     * Retrieves an expense by ID.
     * @param {string} expenseId - The ID of the expense.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<any>} - The retrieved expense.
     */
    static async getExpenseById(expenseId: string, userId: string) {
        return await Expense.findOne({ _id: expenseId, userId }).populate("categoryId", "name budget");
    }

    /**
     * Updates an expense with budget validation.
     * @param {string} expenseId - The ID of the expense.
     * @param {string} userId - The ID of the user.
     * @param {object} data - The updated expense data.
     * @returns {Promise<any>} - The updated expense.
     */
    static async updateExpense(expenseId: string, userId: string, data: { amount?: number }) {
        const expense = await Expense.findOne({ _id: expenseId, userId });
        if (!expense) throw new Error("Expense not found");

        if (data.amount) {
            const category = await Category.findById(expense.categoryId);
            if (!category) throw new Error("Invalid category");

            const currentExpense = await this.getTotalExpensesByCategory(userId, category.id);
            if (currentExpense - expense.amount + data.amount > category.budget) {
                throw new Error("Expense exceeds category budget");
            }
        }

        return await Expense.findOneAndUpdate({ _id: expenseId, userId }, data, { new: true });
    }

    /**
     * Deletes an expense.
     * @param {string} expenseId - The ID of the expense.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<any>} - The deleted expense.
     */
    static async deleteExpense(expenseId: string, userId: string) {
        return await Expense.findOneAndDelete({ _id: expenseId, userId });
    }
}
