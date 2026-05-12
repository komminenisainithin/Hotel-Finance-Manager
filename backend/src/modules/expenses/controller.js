import { createExpenseService, getAllExpensesService, getExpenseByIdService, updateExpenseService, deleteExpenseService } from "./service.js";

export const createExpenseController = async (req, res) => {
    try {
        const { amount, purpose, date } = req.body;
        const userId = req.user.id;
        const result = await createExpenseService(userId, amount, purpose, date);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllExpensesController = async (req, res) => {
    try {
        const result = await getAllExpensesService();
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getExpenseByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getExpenseByIdService(id);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateExpenseController = async (req, res) => {
    try {
        const { id } = req.params; 
        const { amount, purpose, date } = req.body;
        const result = await updateExpenseService(id, amount, purpose, date);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteExpenseController = async (req, res) => {
    try {
        const { id } = req.params;      
        const result = await deleteExpenseService(id);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}