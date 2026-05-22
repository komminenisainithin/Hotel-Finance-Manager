import mongoose from "mongoose";
import Sales from "../sales/model.js";
import Purchase from "../purchases/model.js";
import Expense from "../expenses/model.js";

const getDateRange = (filter, startDate, endDate) => {
    const now = new Date();

    switch (filter) {
        case "today": {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "weekly": {
            const start = new Date(now);
            const day = start.getDay();
            const diff = day === 0 ? -6 : 1 - day; // Monday as week start
            start.setDate(start.getDate() + diff);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "monthly": {
            const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "yearly": {
            const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "custom": {
            if (!startDate || !endDate) return null;
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (isNaN(start) || isNaN(end)) return null;
            return { $gte: start, $lte: end };
        }
        default:
            return null; // no filter → all-time
    }
};

export const getDashboardService = async (userId, filter, startDate, endDate) => {
    try {
        const oid = new mongoose.Types.ObjectId(userId);
        const dateRange = getDateRange(filter, startDate, endDate);

        if (filter === "custom" && dateRange === null) {
            return {
                success: false,
                message: "Custom filter requires valid startDate and endDate query params (YYYY-MM-DD)",
                status: 400,
            };
        }

        const dateMatch = dateRange ? { date: dateRange } : {};

        const [salesAgg, purchasesAgg, expensesAgg] = await Promise.all([
            Sales.aggregate([
                { $match: { userId: oid, ...dateMatch } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
            ]),
            Purchase.aggregate([
                { $match: { userId: oid, ...dateMatch } },
                { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
            ]),
            Expense.aggregate([
                { $match: { userId: oid, ...dateMatch } },
                { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
            ]),
        ]);

        const totalSales = salesAgg[0]?.total ?? 0;
        const totalPurchases = purchasesAgg[0]?.total ?? 0;
        const totalExpenses = expensesAgg[0]?.total ?? 0;
        const profit = totalSales - totalPurchases - totalExpenses;

        const dateFilter = dateRange ? { date: dateRange } : {};

        const [recentSales, recentPurchases, recentExpenses] = await Promise.all([
            Sales.find({ userId: oid, ...dateFilter }).sort({ date: -1 }).limit(5).lean(),
            Purchase.find({ userId: oid, ...dateFilter }).sort({ date: -1 }).limit(5).lean(),
            Expense.find({ userId: oid, ...dateFilter }).sort({ date: -1 }).limit(5).lean(),
        ]);

        return {
            success: true,
            message: "Dashboard fetched successfully",
            status: 200,
            data: {
                filter: filter || "all",
                totals: {
                    sales: totalSales,
                    purchases: totalPurchases,
                    expenses: totalExpenses,
                    profit,
                },
                counts: {
                    sales: salesAgg[0]?.count ?? 0,
                    purchases: purchasesAgg[0]?.count ?? 0,
                    expenses: expensesAgg[0]?.count ?? 0,
                },
                recent: {
                    sales: recentSales,
                    purchases: recentPurchases,
                    expenses: recentExpenses,
                },
            },
        };
    } catch (error) {
        console.error("getDashboardService", error);
        return {
            success: false,
            message: "Failed to fetch dashboard",
            status: 500,
            error: error.message,
        };
    }
};
