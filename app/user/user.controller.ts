import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

/**
 * Register a new user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Get user profile by ID from JWT
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await UserService.getUserById(req.user.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const updatedUser = await UserService.updateUser(req.user.id, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * Edit user profile (partial update)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const editUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const updatedUser = await UserService.updateUser(req.user.id, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const result = await UserService.deleteUser(req.user.id);
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const result = await UserService.authenticateUser(email, password);
        if (!result) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.json({ user: result.user, token: result.token });
    } catch (error) {
        next(error);
    }
};