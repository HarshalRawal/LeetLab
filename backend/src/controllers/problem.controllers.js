import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/index.js";
import { getJudge0LanguageId,submitBatch,pollBatchResults } from "../utils/judge0-api.js";
const createProblem = asyncHandler(async(req,res)=>{

    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions} = req.body

    for(const[language,solutionCode] of Object.entries(referenceSolutions)){
        const languageId = getJudge0LanguageId(language);
        if(!languageId){
            throw new ApiError(400,`Language ${language} is not supported`);
        }
        const submissions = testcases.map(({input,output})=>{
            return {
            source_code:solutionCode,
            language_id:languageId,
            stdin:input,
            expected_output:output
        }
        })
        const submissionResults = await submitBatch(submissions);

        const tokens = submissionResults.map((obj)=> {
            return obj.token;
        })
        const results = await pollBatchResults(tokens);

        for (let i=0;i<results.length;i++){
            const result = results[i];
            if(result.status.id!==3){
              throw new ApiError(400,`Testcase ${i+1} failed for language ${language}`);
            }
        }
    }
    const newProblem = await prisma.problem.create({
       data:{
         title,
         description,
         difficulty,
         tags,
         examples,
         constraints,
         testcases,
         codeSnippets,
         referenceSolutions,
         userId:req.user.id
       }
    })
    if(!newProblem){
        throw new ApiError(500,"Failed to create a new Problem");
    }
    return res.status(201).json(new ApiResponse(201,"Successfully created New Problem",{
        problemId : newProblem.id
    }))
})

const getAllProblems = asyncHandler(async(req,res)=>{

})

const getProblemById = asyncHandler(async(req,res)=>{

})

const updateProblem = asyncHandler(async(req,res)=>{

})

const deleteProblem = asyncHandler(async(req,res)=>{

})

const getAllSolvedProblemsByUser = asyncHandler(async(req,res)=>{

})

export {createProblem, getAllProblems
    ,getProblemById,updateProblem
    ,deleteProblem,
    getAllSolvedProblemsByUser
}