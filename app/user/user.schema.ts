import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

/**
 * Represents a User document in the database.
 * @interface IUser
 * @extends {mongoose.Document}
 */
export interface IUser extends mongoose.Document {
    /** The name of the user. */
    name: string;

    /** The email address of the user. */
    email: string;

    /** The hashed password of the user. */
    password: string;

    /** An array of Expense IDs associated with the user. */
    expenses: mongoose.Types.ObjectId[];

    /** An array of Budget IDs associated with the user. */
    budgets: mongoose.Types.ObjectId[];

    /**
     * Compares a candidate password with the user's hashed password.
     * @param {string} candidatePassword - The password to compare.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the passwords match, otherwise `false`.
     */
    comparePassword(candidatePassword: string): Promise<boolean>;

    /**
     * Generates a JSON Web Token (JWT) for the user.
     * @returns {string} - The generated JWT.
     */
    generateJWT(): string;
}

/**
 * User schema definition.
 */
const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
        budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }],
    },
    { timestamps: true }
);

/**
 * Middleware to hash the password before saving the user document.
 */
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});

/**
 * Method to compare a candidate password with the user's hashed password.
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method to generate a JSON Web Token (JWT) for the user.
 * @returns {string} - The generated JWT.
 */
UserSchema.methods.generateJWT = function (): string {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );
};

/**
 * User model based on the User schema.
 */
const User = mongoose.model<IUser>("User", UserSchema);

export default User;