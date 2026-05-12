import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGODB_URI;

const server = async () => {
    try {
        await connectDB(MONGO_URI);
       
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("server error", error.message);
        process.exit(1);
    }
};

server();