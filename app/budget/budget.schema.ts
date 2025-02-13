import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" }, // ✅ Use reference instead of string
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
    },
    { timestamps: true }
);

// ✅ Prevent duplicate budgets for the same category
BudgetSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

export const BudgetModel = mongoose.model("Budget", BudgetSchema);
