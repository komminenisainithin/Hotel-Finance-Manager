import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

expenseSchema.index({ date: -1 });
const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;