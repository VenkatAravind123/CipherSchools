const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { Pool } = require("pg");
require("./config/pgPool.js")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const userRoutes = require("./routes/userRoutes.js")
const adminRoutes = require("./routes/adminRoutes.js")

const dburl = process.env.MONGO_DB_URL
mongoose.connect(dburl).then(() => {
    console.log("Connected to DB Successfully")
}).catch((err) => {
    console.log(err.message)
});


const app = express()
//to parse JSON data
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",userRoutes)
app.use("/api/admin",adminRoutes)
 



const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})