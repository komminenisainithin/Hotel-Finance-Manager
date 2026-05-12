import { createPurchaseService, getAllPurchasesService, getPurchaseByIdService, updatePurchaseService, deletePurchaseService } from "./service.js";
export const createPurchaseController = async (req, res) => {
    try {
        const {amount, description, date} = req.body;
        const userId = req.user.id;
        const result = await createPurchaseService(userId, amount, description, date);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPurchasesController = async (req, res) => {
    try {
        const result = await getAllPurchasesService();
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPurchaseByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getPurchaseByIdService(id);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePurchaseController = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, date } = req.body;
        const result = await updatePurchaseService(id, amount, description, date);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePurchaseController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deletePurchaseService(id);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};