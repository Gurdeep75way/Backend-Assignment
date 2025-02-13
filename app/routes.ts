import express from "express";
import userRoutes from "./user/user.route"
import categoryRoutes from "./category/category.route"
import budgetRoutes from "./budget/budget.route"
import expenseRoutes from "./expense/expense.route"
/**
 * Express router instance.
 * @constant {express.Router}
 */
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */
router.use("/user", userRoutes);

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group management endpoints
 */
router.use("/budget", budgetRoutes);

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management endpoints
 */
router.use("/expense", expenseRoutes);
/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management endpoints
 */
router.use("/category", categoryRoutes);

export default router;