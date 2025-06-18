import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv"
import prisma from "../db/index.js";

const verifyJwt = asyncHandler(async (req,res,next)=>{
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        throw new ApiError(409,"Access Token Not Found.Please Login again");
    }
    const decodedAccessToken =  jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedAccessToken;
    next();
})

const checkAdmin = asyncHandler(async(req,res,next)=>{
    const userid = req.user.id;
    const user = await prisma.user.findUnique({
        where:{
            id:userid
        },
        select:{
            role:true
        }
    })
    if(user.role!=="ADMIN"){
        throw new ApiError(403,"Only Admin users can visit this route")
    }
    next();
})

export  {verifyJwt,checkAdmin}