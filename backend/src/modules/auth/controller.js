import { registerUser, loginUser, getUser, updatePassword } from "./service.js";

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
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUser(decoded.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePasswordController = async (req, res) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await updatePassword(decoded.userId, oldPassword, newPassword);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};