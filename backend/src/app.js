import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middlerware.js";
import problemRoutes from "./routes/problem.routes.js";
import executeRoutes from "./routes/execute.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import solutionRoutes from "./routes/solution.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import morgan from "morgan"
const app = express();
app.use(cors({
    origin: [process.env.BASE_URL, "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    methods: ["POST", "GET", "PATCH", "DELETE", "PUT"]
  }))
  
app.use(express.json());
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/problems",problemRoutes);
app.use("/api/v1/execute",executeRoutes);
app.use("/api/v1/submissions",submissionRoutes);
app.use("/api/v1/playlist",playlistRoutes);
app.use("/api/v1/soultion",solutionRoutes);
app.use("/api/v1/comment",commentRoutes)
app.use(errorHandler);
export default app;
