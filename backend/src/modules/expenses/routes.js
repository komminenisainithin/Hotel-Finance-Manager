import express from "express";
import { createExpenseController, getAllExpensesController, getExpenseByIdController, updateExpenseController, deleteExpenseController } from "./controller.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpenseController);
router.get("/all", getAllExpensesController);
router.get("/:id", getExpenseByIdController);
router.put("/:id", updateExpenseController);
router.delete("/:id", deleteExpenseController);

export default router;