import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    budget: { type: Number, required: true, min: 0 }  // Budget is now part of the category
});

export default mongoose.model("Category", CategorySchema);
