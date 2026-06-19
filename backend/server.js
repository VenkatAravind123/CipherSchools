const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { Pool } = require("pg");
require("./config/pgPool.js")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const userRoutes = require("./routes/userRoutes.js")
const adminRoutes = require("./routes/adminRoutes.js")

// Disable command buffering so queries fail-fast when not connected
mongoose.set("bufferCommands", false);

const dburl = process.env.MONGO_DB_URL;
if (!dburl) {
    console.error("CRITICAL ERROR: MONGO_DB_URL is missing from environment variables!");
} else {
    mongoose.connect(dburl).then(() => {
        console.log("Connected to DB Successfully")
    }).catch((err) => {
        console.error("MongoDB Connection Error:", err.message)
    });
}

// Middleware to ensure DB connection is ready before processing API requests
const connectDB = async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }
    if (mongoose.connection.readyState === 2) {
        try {
            await new Promise((resolve, reject) => {
                const onConnected = () => {
                    mongoose.connection.off("error", onError);
                    resolve();
                };
                const onError = (err) => {
                    mongoose.connection.off("connected", onConnected);
                    reject(err);
                };
                mongoose.connection.once("connected", onConnected);
                mongoose.connection.once("error", onError);
            });
            return next();
        } catch (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message
            });
        }
    }
    
    if (!dburl) {
        return res.status(500).json({
            message: "Database configuration error: MONGO_DB_URL is missing from environment variables."
        });
    }
    
    try {
        console.log("Re-attempting connection to MongoDB...");
        await mongoose.connect(dburl);
        console.log("Connected to MongoDB successfully");
        next();
    } catch (err) {
        console.error("MongoDB reconnection error:", err);
        return res.status(500).json({
            message: "Database connection error",
            error: err.message
        });
    }
};

const app = express()
//to parse JSON data
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

// Protect API routes by ensuring the DB is connected
app.use("/api", connectDB)

app.use("/api/auth",userRoutes)
app.use("/api/admin",adminRoutes)
 
app.get("/", (req, res) => res.send("CipherSQL Backend is running!"));



const port = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'production') {
    app.listen(port,()=>{
        console.log(`Server is running at port ${port}`)
    })
}

module.exports = app;