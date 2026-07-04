import User from "./model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async ({name, email, password, mobile}) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword, mobile});
        const { password: _, ...userData } = user.toObject();
        return {
            success: true,
            message: "User registered successfully",
            status: 201,
            data: userData
        };
    } catch (err) {
        if (err.code === 11000) {
            return {
                success: false,
                message: "Email already exists",
                status: 400
            };
        }
        throw err;
    }
};

export const loginUser = async ({email, password}) => {
    const user = await User.findOne({email});
    if (!user) {
        return {
            success: false,
            message: "Invalid email or password",
            status: 401
        };
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "Invalid email or password",
            status: 401
        };
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
    const { password: _, ...userData } = user.toObject();
    return {
        success: true,
        message: "User logged in successfully",
        status: 200,
        data: userData,
        token
    };
}

export const getUser = async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: "Invalid token",
                    status: 404
                };
            }
            const { password: _, ...userData } = user.toObject();
            return {
                success: true,
                message: "User found successfully",
                status: 200,
                data: userData
            };
        } catch (error) {
            return {
                success: false,
                message: "Invalid token",
                status: 404
            };
        }
};

export const updatePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findById(userId);
    if (!user) {
        return {
            success: false,
            message: "User not found",
            status: 404
        };
    }
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        return {
            success: false,
            message: "Invalid old password",
            status: 401
        };
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return {
        success: true,
        message: "Password updated successfully",
        status: 200
    };
    } catch (error) {
        return {
            success: false,
            message: "Invalid old password",
            status: 500
        };
    }
};
export const userUpdate = async (userId, { name, email, mobile }) => {
    try {
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (mobile !== undefined) updateData.mobile = mobile;

        if (Object.keys(updateData).length === 0) {
            return {
                success: false,
                message: "No valid fields to update",
                status: 400
            };
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!user) {
            return {
                success: false,
                message: "User not found",
                status: 404
            };
        }
        const { password: _, ...userData } = user.toObject();
        return {
            success: true,
            message: "User updated successfully",
            status: 200,
            data: userData
        };
    } catch (error) {
        if (error.code === 11000) {
            return {
                success: false,
                message: "Email already exists",
                status: 400
            };
        }
        throw error;
    }
};

export const logoutUser = async () => {
    return {
        success: true,
        message: "User logged out successfully",
        status: 200
    };
};
