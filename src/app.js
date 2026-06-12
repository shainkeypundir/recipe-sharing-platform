import express from "express"
import cors from "cors"
import morgan from "morgan"
import connectDB  from "./config/db.js"


const app = express();

// middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// test route
app.get("/", (req,res) => {
    res.json({
        success : true,
        message : "Recipe Sharing API Running"
    })
})

export default app;

