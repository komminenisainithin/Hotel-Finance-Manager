// import Expense from "../expenses/model.js";
// import Purchase from "../purchases/model.js";
// import Sale from "../sales/model.js";

// export const getReportService = async (userId) => {
//     try {
//         const expenses = await Expense.find({ userId });
//         const purchases = await Purchase.find({ userId });
//         const sales = await Sale.find({ userId });
//     } catch (error) {
//     return {
//         success: true,
//         message: "Report fetched successfully",
//         status: 200,
//         data: {
//             expenses,
//             purchases,
//             sales

//         }
//     }
// };