import express from "express";
import authRoutes from "../modules/auth/routes.js";
import salesRoutes from "../modules/sales/routes.js";
import purchasesRoutes from "../modules/purchases/routes.js";
import expensesRoutes from "../modules/expenses/routes.js";
import dashboardRoutes from "../modules/dashboard/routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/sales", salesRoutes);
router.use("/purchases", purchasesRoutes);
router.use("/expenses", expensesRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;