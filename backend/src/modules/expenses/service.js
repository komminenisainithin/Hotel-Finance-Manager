import Expense from "./model.js";

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

const startOfDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);
    return date;
};

const startOfNextDay = (dateStr) => {
    const date = startOfDay(dateStr);
    date.setUTCDate(date.getUTCDate() + 1);
    return date;
};

export const getAllExpensesService = async (page, limit, startDate, endDate) => {
    const query = {};
    if (startDate || endDate) {
        query.date = {};
        if (startDate) {
            query.date.$gte = startOfDay(startDate);
        }
        if (endDate) {
            // Inclusive end date: match through the end of that calendar day
            query.date.$lt = startOfNextDay(endDate);
        }
    }
    try {
        const expenses = await Expense.find(query).skip((page - 1) * limit).limit(limit).sort({ date: -1 }).lean();
        const total = await Expense.countDocuments(query);
        return {
            success: true,
            message: "Expenses fetched successfully",
            status: 200,
            data: {
                expenses,
                stats: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit)
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