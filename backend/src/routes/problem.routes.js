import express from "express"
import {verifyJwt,checkAdmin} from "../middlewares/auth.middleware.js"
import { createProblem ,getAllProblems,getProblemById,updateProblem,deleteProblem,getAllSolvedProblemsByUser} from "../controllers/problem.controllers.js"
const problemRoutes  = express.Router()

problemRoutes.post("/create-problem",verifyJwt,checkAdmin,createProblem)

problemRoutes.get("/get-all-problems",verifyJwt,getAllProblems);

problemRoutes.get("/get-problem/:id",verifyJwt,getProblemById);

problemRoutes.put("/update-problem/:id",verifyJwt,checkAdmin,updateProblem);

problemRoutes.delete("/delete-problem/:id",verifyJwt,checkAdmin,deleteProblem);

problemRoutes.get("/get-solved-problems",verifyJwt,getAllSolvedProblemsByUser);

export default problemRoutes