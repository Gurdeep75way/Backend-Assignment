import { Router } from "express";
import {
    createCategory,
    getUserCategories,
    deleteCategory,
    updateCategoryBudget
} from "./category.controller";
import { verifyToken } from "../common/middleware/role-auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management APIs
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food
 *               budget:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", verifyToken, createCategory);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all user categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user categories
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getUserCategories);

/**
 * @swagger
 * /category/update-category:
 *   put:
 *     summary: Update category budget
 *     tags: [Category]
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
 *               budget:
 *                 type: number
 *     responses:
 *       200:
 *         description: Category budget updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 */
router.put("/update-category", verifyToken, updateCategoryBudget);

/**
 * @swagger
 * /category/{categoryId}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:categoryId", verifyToken, deleteCategory);

export default router;
