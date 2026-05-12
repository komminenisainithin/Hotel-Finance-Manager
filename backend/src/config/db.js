import mongoose from "mongoose";

const connectDB = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("MongoDB connection error", error.message);
        process.exit(1);
    }
};

export default connectDB;