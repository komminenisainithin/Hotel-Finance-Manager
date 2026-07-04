import { registerUser, loginUser, getUser, updatePassword, userUpdate, logoutUser } from "./service.js";

export const registerController = async (req, res) => {
    try {
    const { name, email, password, mobile } = req.body;
        const result = await registerUser({ name, email, password, mobile });
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser({ email, password });
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserController = async (req, res) => {
    try {
        const result = await getUser(req.user.id);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await updatePassword(req.user.id, oldPassword, newPassword);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const userUpdateController = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const result = await userUpdate(req.user.id, { name, email, mobile });
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        const result = await logoutUser();
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};