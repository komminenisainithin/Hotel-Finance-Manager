import { createSalesService, getSalesService, getSalesByIdService, updateSales, deleteSales } from "./service.js";

export const createSalesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { morning, evening, date } = req.body;
        const result = await createSalesService(userId, { morning, evening, date });
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const getAllSalesController = async (req, res) => {
//     try {
//         const result = await getAllSalesService();
//         res.status(result.status).json(result);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const getSalesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getSalesService(userId);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSalesByIdController = async (req, res) => {
    try {
        const { salesId } = req.params;
        const result = await getSalesByIdService(salesId);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSalesController = async (req, res) => {
    try {
        const { salesId } = req.params;
        const { morning, evening, date } = req.body;
        const result = await updateSales(salesId, { morning, evening, date });
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSalesController = async (req, res) => {
    try {
        const { salesId } = req.params;
        const result = await deleteSales(salesId);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
