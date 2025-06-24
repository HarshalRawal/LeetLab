import express from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { createSolution,getAllSolutions,getSolution,updateSolution,vote,deleteSolution } from "../controllers/solution.controllers.js"
const solutionRoutes = express.Router()



solutionRoutes.post("/create",verifyJwt,createSolution);
solutionRoutes.get("/:solutionId",verifyJwt,getAllSolutions);
solutionRoutes.get("/solution/:solutionId",verifyJwt,getSolution);
solutionRoutes.patch("/update/:solutionId",verifyJwt,updateSolution);
solutionRoutes.post("/vote/:solutionId",verifyJwt,vote);
solutionRoutes.delete("/delete/:solutionId",deleteSolution);
export default solutionRoutes