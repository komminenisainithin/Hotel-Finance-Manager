import express from "express";
import authMiddleware from "../../middleware/auth.js";
import { createSalesController, getSalesController, getSalesByIdController, updateSalesController, deleteSalesController } from "./controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSalesController);
router.get("/", getSalesController);
router.get("/:id", getSalesByIdController);
router.put("/:id", updateSalesController);
router.delete("/:id", deleteSalesController);

export default router;
