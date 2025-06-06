import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv"
const verifyJwt = asyncHandler(async (req,res,next)=>{
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        throw new ApiError(409,"Access Token Not Found.Please Login again");
    }
    const decodedAccessToken =  jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedAccessToken;
    next();
})

export default verifyJwt