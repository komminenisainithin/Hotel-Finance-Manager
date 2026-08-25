import Purchase from "./model.js";


export const createPurchaseService = async (userId, amount, description, date) => {
    try {
        const purchase = await Purchase.create({ userId, amount, description, date });
        return {
            success: true,
            message: "Purchase created successfully",
            status: 201,
            data: purchase
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create purchase",
            status: 500,
            error: error.message
        };
    }
};

export const getAllPurchasesService = async (page, per_page, start_date, end_date) => {
    try {
        const query = {};
        if (start_date) {
            query.date = { $gte: new Date(start_date) };
        }
        if (end_date) {
            query.date = { $lte: new Date(end_date) };
        }
        const purchases = await Purchase.find(query).skip((page - 1) * per_page).limit(per_page).sort({ date: -1 }).lean();
        return {
            success: true,
            message: "Purchases fetched successfully",
            status: 200,
            data: purchases
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch purchases",
            status: 500,
            error: error.message
        };
    };
};

export const getPurchaseByIdService = async (id) => {
    try {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return {
                success: false,
                message: "Purchase not found",
                status: 404,
            };
        }
        return {
            success: true,
            message: "Purchase fetched successfully",
            status: 200,
            data: purchase
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch purchase",
            status: 500,
            error: error.message
        };
    }
};

export const updatePurchaseService = async (id, amount, description, date) => {
    try {
        const purchase = await Purchase.findByIdAndUpdate(id, {amount, description, date}, {new: true});
        return {
            success: true,
            message: "Purchase updated successfully",
            status: 200,
            data: purchase
        };
    } catch (error) {
        return { 
            success: false,
            message: "Failed to update purchase",
            status: 500,
            error: error.message
        };
    }
};

export const deletePurchaseService = async (id) => {
    try {
        const purchase = await Purchase.findByIdAndDelete(id);
        return {
            success: true,
            message: "Purchase deleted successfully",
            status: 200,
            data: purchase
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete purchase",
            status: 500,
            error: error.message 
        };
    }
};