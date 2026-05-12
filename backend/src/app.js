import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors( {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
} ));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api", routes);

export default app;