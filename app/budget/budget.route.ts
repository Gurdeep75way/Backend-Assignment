import { Router } from "express";
import { verifyToken } from "../common/middleware/role-auth.middleware";
import {
    getBudgetSummary,
    getCategoryWiseSummary,
    getSpendingSummary,
    getSpendingTrends
} from "./budget.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: API endpoints related to budget management
 */

/**
 * @swagger
 * /budget/summary:
 *   get:
 *     summary: Get overall budget summary
 *     description: Retrieves the budget summary for the authenticated user.
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved budget summary
 *       401:
 *         description: Unauthorized
 */
router.get("/summary", verifyToken, getBudgetSummary);

/**
 * @swagger
 * /budget/category-summary:
 *   get:
 *     summary: Get category-wise budget summary
 *     description: Retrieves the budget summary categorized by expense categories.
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved category-wise summary
 *       401:
 *         description: Unauthorized
 */
router.get("/category-summary", verifyToken, getCategoryWiseSummary);

/**
 * @swagger
 * /budget/spending-summary:
 *   get:
 *     summary: Get spending summary
 *     description: Retrieves the spending summary based on a given period (monthly or yearly).
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, yearly]
 *         required: true
 *         description: The period for spending summary (monthly or yearly)
 *     responses:
 *       200:
 *         description: Successfully retrieved spending summary
 *       400:
 *         description: Invalid period value
 *       401:
 *         description: Unauthorized
 */
router.get("/spending-summary", verifyToken, getSpendingSummary);

/**
 * @swagger
 * /budget/spending-trends:
 *   get:
 *     summary: Get spending trends
 *     description: Retrieves the user's spending trends over a period of time.
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved spending trends
 *       401:
 *         description: Unauthorized
 */
router.get("/spending-trends", verifyToken, getSpendingTrends);

export default router;
