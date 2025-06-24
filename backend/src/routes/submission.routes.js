import express from "express"
import { getAllSubmissions,getAllSubmissionsForProblem,getSubmissionsForProblem } from "../controllers/submissions.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const submissionRoutes  = express.Router();


submissionRoutes.get("/getAllSubmissions",verifyJwt,getAllSubmissions);
submissionRoutes.get("/getAllSubmissionForProblem/:problemId",verifyJwt,getAllSubmissionsForProblem);
submissionRoutes.get("/getSubmissionForProblem/:problemId",verifyJwt,getSubmissionsForProblem);


export default submissionRoutes;