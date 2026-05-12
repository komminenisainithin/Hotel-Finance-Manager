import express from "express";
import { registerController, loginController, getUserController } from "./controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/getUser", getUserController);

export default router;