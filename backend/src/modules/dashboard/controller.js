import { getDashboardService } from "./service.js";

export const getDashboardController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { filter, startDate, endDate } = req.query;
        const result = await getDashboardService(userId, filter, startDate, endDate);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
