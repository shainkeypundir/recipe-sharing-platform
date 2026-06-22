import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import recipeRoutes from "./routes/recipe.routes.js"

const app = express();

// Middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/recipes", recipeRoutes)


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Recipe Sharing API Running"
    })
})

export default app;