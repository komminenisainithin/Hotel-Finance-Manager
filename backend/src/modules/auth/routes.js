import express from "express";
import authMiddleware from "../../middleware/auth.js";
import { registerController, loginController, getUserController, userUpdateController, updatePasswordController, logoutController } from "./controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/getUser", authMiddleware, getUserController);
router.put("/updateUser", authMiddleware, userUpdateController);
router.put("/updatePassword", authMiddleware, updatePasswordController);
router.post("/logout", authMiddleware, logoutController);

export default router;