import Sales from "./model.js";
export const createSalesService = async (userId, amount, description, date, shift) => {
    try{
        const sales = await Sales.create({userId, amount, description, date, shift});
        return {
            success: true,
            message: "Sales created successfully",
            status: 201,
            data: sales
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create sales",
            status: 500,
        };
    }
}

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

export const getSalesByIdService = async (id) => {
    try{
        const sales = await Sales.findById(id);
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

export const updateSales = async (id, amount, description, date, shift) => {
    try{
        const sales = await Sales.findByIdAndUpdate(id, {amount, description, date, shift}, {new: true});
        return {
            success: true,
            message: "Sales updated successfully",
            status: 200,
            data: sales
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update sales",
            status: 500,
        };
    }
};

export const deleteSales = async (id) => {
    try{
        const sales = await Sales.findByIdAndDelete(id);
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