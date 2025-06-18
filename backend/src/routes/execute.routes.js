import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { run ,submit} from "../controllers/execute.controllers.js";
const executeRoutes = express.Router();

executeRoutes.post("/run",verifyJwt,run);
executeRoutes.post("/submit",verifyJwt,submit);


export default executeRoutes;