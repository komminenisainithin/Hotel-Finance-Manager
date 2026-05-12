export const createExpenseService = async (userId, amount, purpose, date) => {
    try {
        const expense = await Expense.create({userId, amount, purpose, date});
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

export const getAllExpensesService = async () => {
    try {
        const expenses = await Expense.find();
        return {
            success: true,
            message: "Expenses fetched successfully",
            status: 200,
            data: expenses
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
        const expense = await Expense.findByIdAndUpdate(id, {amount, purpose, date}, {new: true});
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