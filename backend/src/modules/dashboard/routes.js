import express from "express";
import authMiddleware from "../../middleware/auth.js";
import { getDashboardController } from "./controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDashboardController);

export default router;
