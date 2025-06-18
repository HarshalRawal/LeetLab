import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middlerware.js";
import problemRoutes from "./routes/problem.routes.js";
import executeRoutes from "./routes/execute.routes.js";
import morgan from "morgan"
const app = express();
app.use(cors({
    origin:`${process.env.BASE_URL}`,
    credentials:true,
    allowedHeaders:["Content-Type","Authorization","Accept"],
    methods:["POST","GET","PATCH","DELETE","PUT"]
}))
app.use(express.json());
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/problems",problemRoutes);
app.use("/api/v1/execute",executeRoutes);
app.use(errorHandler);
export default app;
