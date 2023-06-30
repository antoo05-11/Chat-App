import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./api/routes";

dotenv.config();

const app = express();

// Register middleware
app.use(express.json());
app.use(cookieParser());

// Static files
app.use("/src/public", express.static('./src/public/'));

// Error handler
app.use((err, req, res, next) => {
    const { status = 404, message = "Error" } = err;
    res.status(status).json({ message });
});

// Routes
app.use("/api", router);

app.use("*", (req, res) => {
    return res.redirect("/");
});

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Welcome to express" });
});

// Listen for connection
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is listening on port ${process.env.APP_PORT}`);
});

// Connect to MongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect to mongoose is successful!");
    } catch(error) {
        console.log("Cannot connect to mongoose!", error);
    }
})();