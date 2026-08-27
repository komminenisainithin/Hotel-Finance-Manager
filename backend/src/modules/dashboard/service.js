import mongoose from "mongoose";
import Sales from "../sales/model.js";
import Purchase from "../purchases/model.js";
import Expense from "../expenses/model.js";
import { getDateRange } from "../../utils/dateRange.js";

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
