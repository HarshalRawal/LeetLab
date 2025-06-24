import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import prisma from "../db/index.js";

export const getAllSubmissions = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    if(!userId){
        throw new ApiError(400,"User ID is required");
    }
    const allSubmissions = await prisma.submissions.findMany({
        where:{
            userId
        }
    })
    if(!allSubmissions){
        throw new ApiError(500,`Failed to fetch all Submission by user`);
    }
    if(allSubmissions.length==0){
        return res.status(200).json(new ApiResponse(200,`User have no Submission`));
    }
    return res.status(200).json(new ApiResponse(200,`Successfully found all submissions by user`,{
        allSubmissions
    }))
})

export const getSubmissionsForProblem = asyncHandler(async()=>{
    const { problemId } = req.params
    const userId = req.user.id;
   const submission = await prisma.submissions.findMany({
    where:{
        userId,
        problemId
    }
   })
   if(!submission){
    throw new ApiError(500,"Failed to fetch submissions for the problem")
   }
   if(submission.length==0){
    return  res.status(200).json(new ApiResponse(200,`User has no submission for problem`,{
        submission
    }))
   }
   return res.status(200).json(new ApiResponse(200,`Successfully fetched all submissions for the problem by the user`,{
    submission
   }))
})

export const getAllSubmissionsForProblem = asyncHandler(async()=>{
    const {problemId} = req.params;
    const submission = await prisma.submissions.count({
        where:{
            problemId
        }
    })
    if(!submission){
        throw new ApiError(500,"Failed to fetch all submission for the problem");
    }
    return res.status(200).json(new ApiResponse(200,`Successfully fetched all submission for problem`,{
        count:submission
    }))
})