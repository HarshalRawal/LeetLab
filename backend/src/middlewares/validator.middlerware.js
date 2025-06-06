import { validationResult } from "express-validator";
import {ApiError} from "../utils/api-errors.js";
const validate = (req,res,next)=>{
    const errors = validationResult(req);
 
   // console.log("ERRORS = ",errors);
    if(errors.isEmpty()){
     return next();
    }
 
    const extractedError = [];
    errors.array().map((err) =>
      extractedError.push({
        [err.path]: err.msg,
      }),
    );
    return next(new ApiError(422, "Received data is invalid", extractedError));
 }
 
 export {validate}