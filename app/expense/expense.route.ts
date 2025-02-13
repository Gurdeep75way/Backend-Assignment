import express from "express";
import {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    downloadExpenseReport
} from "./expense.controller";
import { verifyToken } from "../common/middleware/role-auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management endpoints
 */

/**
 * @swagger
 * /expense:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", verifyToken, createExpense);

/**
 * @swagger
 * /expense:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getAllExpenses);

/**
 * @swagger
 * /expense/report:
 *   get:
 *     summary: Download expense report
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *      parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *         required: true
 *         description: It gives report in pdf or csv format
 *     responses:
 *       200:
 *         description: Report downloaded successfully
 */
router.get('/report', verifyToken, downloadExpenseReport);

/**
 * @swagger
 * /expense/{id}:
 *   get:
 *     summary: Get expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense details
 *       404:
 *         description: Expense not found
 */
router.get("/:id", verifyToken, getExpenseById);

/**
 * @swagger
 * /expense/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Expense updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", verifyToken, updateExpense);

/**
 * @swagger
 * /expense/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete("/:id", verifyToken, deleteExpense);

export default router;
