import prisma from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { generateRandomTokens } from "../utils/tokenGenerator.js";
import { generateAccessToken,generateRefreshToken } from "../utils/tokenGenerator.js";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()
const  signup = asyncHandler(async(req,res)=>{
    const {username,email,password,firstName,lastName} = req.body;

    const isExistingUser = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(isExistingUser){
        throw new ApiError(409,"Email already exists");
    }
    
    const isExistingUsername = await prisma.user.findUnique({
        where:{
            username:username
        }
    })

    if(isExistingUsername){
        throw new ApiError(409,"Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser  = await prisma.user.create({
        data:{
            firstName,
            lastName,
            email,
            username,
            password:hashedPassword,
        }
    })
    if(!newUser){
        throw new ApiError(500,"Failed to create a new user. Internal server error");
    }
   const {unHashedToken,hashedToken,tokenExipry} = generateRandomTokens();

   newUser.isEmailVerifiedToken = hashedToken;
   newUser.isEmailVerifiedTokenExpiresAt = tokenExipry;

   const emailVerificationUrl = `${process.env.BASE_URL}/api/v1/emailverification?token=${unHashedToken}`;
    
   // to-do send email

   return res.status(200).json(new ApiResponse(201,"New User successfully created",{
     id:newUser.id,
     email:newUser.email,
     username:newUser.email,
     token:unHashedToken
   }))
});


const signIn = asyncHandler(async(req,res)=>{
    // to do check if email is verified
    const { loginCredential,password } = req.body;
    
    const user = await prisma.user.findFirst({
        where:{
            OR:[
                {email:loginCredential},
                {username:loginCredential}
            ]
        },
        select:{
            password:true,
            email:true,
            username:true,
            id:true,
            refreshToken:true
        }
        })
    if(!user){
        throw new ApiError(404,`User with crediential not found ${loginCredential}`);
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password)

    if(!isPasswordCorrect){
        throw new ApiError(401,"Incorrect password");
    }
    const accessToken = await generateAccessToken(user.id);

    if(!accessToken){
        throw new ApiError(500,"Failed to generate access Token");
    }
    const refreshToken = await generateRefreshToken(user.id);

    if(!refreshToken){
        throw new ApiError(500,"Failed to generate refresh token");
    }

    user.refreshToken = refreshToken;

    res.cookie("accessToken",accessToken,{
      httpOnly:true,
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
      })
    return res.status(200).json(new ApiResponse(200,"User signed in sucessfully",{
        refreshToken:refreshToken,
        accessToken:accessToken
    }))
 }) 


 const getProfile = asyncHandler(async(req,res)=>{
    const id = req.user.id;
    const user = await prisma.user.findUnique({
        where:{
            id:id
        },
        select:{
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    if(!user){
        throw new ApiError(404,"User not found");
    }
    return res.status(200).json(new ApiResponse(200,"Successfully retrived user data",{
        user
    }))
 })

 const logOut = asyncHandler(async(req,res)=>{

    const user = await prisma.user.findUnique({
        where:{
            id:req.user.id
        },
        select:{
            refreshToken:true
        }
    })
    if(!user){
        throw new ApiError(404,"User not Found");
    }
     user.refreshToken = null;
     res.clearCookie("accessToken");
     res.clearCookie("refreshToken");
     return res.status(200).json(new ApiResponse(200,"user logged out successfully"));
 })
export {signup,signIn,getProfile,logOut}
