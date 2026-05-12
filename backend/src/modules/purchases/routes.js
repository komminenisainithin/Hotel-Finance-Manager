import express from "express";
import { createPurchaseController, getAllPurchasesController, getPurchaseByIdController, updatePurchaseController, deletePurchaseController } from "./controller.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createPurchaseController);
router.get("/all", getAllPurchasesController);
router.get("/:id", getPurchaseByIdController);
router.put("/:id", updatePurchaseController);
router.delete("/:id", deletePurchaseController);

export default router;