import Expense from "./model.js";
import { getDateRange } from "../../utils/dateRange.js";

export const createExpenseService = async (userId, amount, purpose, date) => {
    try {
        if (!amount || !date) {
            return {
                success: false,
                message: "Amount and date are required",
                status: 400,
                error: "Amount and date are required"
            };
        }
        const expense = await Expense.create({ userId, amount, purpose, date });
        return {
            success: true,
            message: "Expense created successfully",
            status: 201,
            data: expense
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create expense",
            status: 500,
            error: error.message
        };
    }
};

export const getAllExpensesService = async (page, limit, filter, startDate, endDate) => {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 50);

    const dateRange = getDateRange(filter, startDate, endDate);
    if (filter === "custom" && dateRange === null) {
        return {
            success: false,
            message: "Custom filter requires valid startDate and endDate query params (YYYY-MM-DD)",
            status: 400,
        };
    }

    const query = dateRange ? { date: dateRange } : {};

    try {
        const expenses = await Expense.find(query)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ date: -1 })
            .lean();
        const total = await Expense.countDocuments(query);
        return {
            success: true,
            message: "Expenses fetched successfully",
            status: 200,
            data: {
                filter: filter || "all",
                expenses,
                stats: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum) || 0,
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch expenses",
            status: 500,
            error: error.message
        };
    }
};

export const getExpenseByIdService = async (id) => {
    try {
        const expense = await Expense.findById(id);
        return {
            success: true,
            message: "Expense fetched successfully",
            status: 200,
            data: expense
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete expense",
            status: 500,
            error: error.message
        };
    }
};

export const updateExpenseService = async (id, amount, purpose, date) => {
    try {
        const expense = await Expense.findByIdAndUpdate(id, { amount, purpose, date }, { new: true });
        return {
            success: true,
            message: "Expense updated successfully",
            status: 200,
            data: expense
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update expense",
            status: 500,
            error: error.message
        };
    }
};

export const deleteExpenseService = async (id) => {
    try {
        const expense = await Expense.findByIdAndDelete(id);
        return {
            success: true,
            message: "Expense deleted successfully",
            status: 200,
            data: expense
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete expense",
            status: 500,
            error: error.message
        };
    }
}