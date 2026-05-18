import express from "express";
import authMiddleware from "../../middleware/auth.js";
import { createSalesController, getSalesController, getSalesByIdController, updateSalesController, deleteSalesController } from "./controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSalesController);
router.get("/", getSalesController);
router.get("/:salesId", getSalesByIdController);
router.put("/:salesId", updateSalesController);
router.delete("/:salesId", deleteSalesController);

export default router;
