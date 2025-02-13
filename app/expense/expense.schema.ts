import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    amount: number;
    description?: string;
    date: Date;
}

const ExpenseSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" }, // Proper reference
        amount: { type: Number, required: true },
        description: { type: String },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
