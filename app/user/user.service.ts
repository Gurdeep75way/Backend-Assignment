import { type IUser } from "./user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./user.schema";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your_access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret";

export const generateAccessToken = (user: any) => {
    return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: any) => {
    return jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
export class UserService {
    // Creates a new user in the database
    static async createUser(userData: { name: string; email: string; password: string }) {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) throw new Error("Email already exists");

        // Create and save the new user
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    }

    // Retrieves a user by their unique ID
    static async getUserById(userId: string) {
        // Fetch user and exclude the password field for security
        return User.findById(userId).select("-password");
    }

    // Updates a user's profile with provided data
    static async updateUser(userId: string, updateData: Partial<{ name: string; email: string; password: string }>) {
        // Hash password if it's being updated
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // Update the user and return the updated document (excluding password)
        return User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
    }

    // Deletes a user from the database
    static async deleteUser(userId: string) {
        return User.deleteOne({ _id: userId });
    }

    // Authenticates a user by verifying email and password
    static async authenticateUser(email: string, password: string) {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return null;

        // Compare input password with hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        return { user, token };
    }
}
