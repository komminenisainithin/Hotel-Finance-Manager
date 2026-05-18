import mongoose from "mongoose";
import Sales from "./model.js";

const toShiftNumber = (value) => {
    if (value === undefined || value === null || value === "") return 0;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
};

const parseSalesId = (value) => {
    const salesId = Number(value);
    if (!Number.isInteger(salesId) || salesId < 1) return null;
    return salesId;
};

export const createSalesService = async (userId, payload) => {
    const { morning, evening, date } = payload;
    const m = toShiftNumber(morning);
    const e = toShiftNumber(evening);
    if (m === null || e === null) {
        return {
            success: false,
            message: "morning and evening must be valid numbers",
            status: 400,
        };
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return {
            success: false,
            message: "Invalid user id",
            status: 400,
        };
    }
    const lastSale = await Sales.findOne().sort({ salesId: -1 }).select("salesId").lean();
    const salesId = lastSale?.salesId != null ? lastSale.salesId + 1 : 1;

    const doc = { salesId, userId, morning: m, evening: e };
    if (date !== undefined && date !== null && date !== "") {
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) {
            return {
                success: false,
                message: "Invalid date",
                status: 400,
            };
        }
        doc.date = d;
    }
    try {
        const sales = await Sales.create(doc);
        return {
            success: true,
            message: "Sales created successfully",
            status: 201,
            data: sales
        };
    } catch (error) {
        if (error.name === "ValidationError") {
            const msg = Object.values(error.errors || {})
                .map((er) => er.message)
                .join(" ");
            return { success: false, message: msg || "Validation failed", status: 400 };
        }
        if (error.name === "CastError") {
            return { success: false, message: error.message, status: 400 };
        }
        if (error.code === 11000) {
            return { success: false, message: "Sales id already exists, please retry", status: 409 };
        }
        console.error("createSalesService", error);
        return {
            success: false,
            message: "Failed to create sales",
            status: 500,
        };
    }
};

export const getSalesService = async (userId) => {
    try{
        const sales = await Sales.find();
        return {
            success: true,
            message: "Sales fetched successfully",
            status: 200,
            data: sales
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch sales",
            status: 500,
        };
    }
};

export const getSalesByIdService = async (salesIdParam) => {
    const salesId = parseSalesId(salesIdParam);
    if (salesId === null) {
        return {
            success: false,
            message: "Invalid sales id",
            status: 400,
        };
    }
    try {
        const sales = await Sales.findOne({ salesId });
        if (!sales) {
            return {
                success: false,
                message: "Sales not found",
                status: 404,
            };
        }
        return {
            success: true,
            message: "Sales fetched successfully",
            status: 200,
            data: sales
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch sales",
            status: 500,
        };
    }
};

export const updateSales = async (salesIdParam, payload) => {
    const { morning, evening, date } = payload;
    const salesId = parseSalesId(salesIdParam);
    if (salesId === null) {
        return { success: false, message: "Invalid sales id", status: 400 };
    }
    try {
        const sales = await Sales.findOne({ salesId });
        if (!sales) {
            return { success: false, message: "Sales not found", status: 404 };
        }
        if (morning !== undefined) {
            const n = toShiftNumber(morning);
            if (n === null) {
                return { success: false, message: "morning must be a valid number", status: 400 };
            }
            sales.morning = n;
        }
        if (evening !== undefined) {
            const n = toShiftNumber(evening);
            if (n === null) {
                return { success: false, message: "evening must be a valid number", status: 400 };
            }
            sales.evening = n;
        }
        if (date !== undefined && date !== null && date !== "") {
            const d = new Date(date);
            if (Number.isNaN(d.getTime())) {
                return { success: false, message: "Invalid date", status: 400 };
            }
            sales.date = d;
        }
        await sales.save();
        return {
            success: true,
            message: "Sales updated successfully",
            status: 200,
            data: sales
        };
    } catch (error) {
        if (error.name === "ValidationError") {
            const msg = Object.values(error.errors || {})
                .map((er) => er.message)
                .join(" ");
            return { success: false, message: msg || "Validation failed", status: 400 };
        }
        if (error.name === "CastError") {
            return { success: false, message: error.message, status: 400 };
        }
        return {
            success: false,
            message: "Failed to update sales",
            status: 500,
        };
    }
};

export const deleteSales = async (salesIdParam) => {
    const salesId = parseSalesId(salesIdParam);
    if (salesId === null) {
        return { success: false, message: "Invalid sales id", status: 400 };
    }
    try {
        const sales = await Sales.findOneAndDelete({ salesId });
        if (!sales) {
            return { success: false, message: "Sales not found", status: 404 };
        }
        return {
            success: true,
            message: "Sales deleted successfully",
            status: 200,
            data: sales
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete sales",
            status: 500,
        };
    }
};