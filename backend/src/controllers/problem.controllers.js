import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/index.js";
import { getJudge0LanguageId,submitBatch,pollBatchResults } from "../utils/judge0-api.js";
import { getExpectedTimeLimit,getExpectedMemoryLimit } from "../utils/expectedLimits.js";
const createProblem = asyncHandler(async(req,res)=>{

    const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions,expectedTimeComplexity,maxInputSize} = req.body
    let {expectedTimeLimit,expectedMemoryLimit} = req.body;
       if(!expectedTimeLimit){
           expectedTimeLimit = getExpectedTimeLimit(maxInputSize,expectedTimeComplexity);
       }
       if(!expectedMemoryLimit){
        expectedMemoryLimit = getExpectedMemoryLimit(maxInputSize);
       }
       expectedMemoryLimit = Math.floor(expectedMemoryLimit * 1024);
       expectedMemoryLimit = Math.min(256000,expectedMemoryLimit);
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
            expected_output:output,
            cpu_time_limit:expectedTimeLimit,
            memory_limit: expectedMemoryLimit
        }
        })
    }
    const newProblem = await prisma.problem.create({
       data:{
         title,
         description,
         difficulty,
         tags,
         examples,
         maxInputSize,
         expectedTimeComplexity,
         expectedMemoryLimit,
         expectedTimeLimit,
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
     const allProblems = await prisma.problem.findMany({
        select:{
            id:true,
            title:true,
            difficulty:true,
            tags:true,
        }
     });
     if(!allProblems){
        throw new ApiError(404,"No Problem found")
     }
     return res.status(200).json(new ApiResponse(200,"Problems found",{
        allProblems
     }))
})

const getProblemById = asyncHandler(async(req,res)=>{
   const {id} = req.params;

   const problem = await prisma.problem.findUnique({
    where:{
        id:id
    }
   })
   if(!problem){
    throw new ApiError(404,`Problem with id ${id} not found`);
   }
   return res.status(200).json(new ApiResponse(200,`Successfully found problem with id: ${id}`,{
    problem
   }))
})

const updateProblem = asyncHandler(async(req,res)=>{
       const {id} = req.params;
       const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions} = req.body

       const existingProblem = await prisma.problem.findUnique({
        where:{
            id
        }
       })
       if(!existingProblem){
        throw new ApiError(404,`Problem with id: ${id} not found`);
       }
       
       const isTestcasesChanged = testcases  && testcases.length > 0;
       const isReferenceSolutionChanged =
       referenceSolutions && typeof referenceSolutions === "object" && Object.keys(referenceSolutions).length > 0;   
       console.log(`isTestcasesChanged: ${isTestcasesChanged}`);
       console.log(`isReferenceSolutionChanged: ${isReferenceSolutionChanged}`);


       if(isTestcasesChanged || isReferenceSolutionChanged){
        let finalReferenceSolution = {};
        if(referenceSolutions){
            finalReferenceSolution = {...existingProblem.referenceSolutions,...referenceSolutions};
        }else{
            finalReferenceSolution = existingProblem.referenceSolutions;
        }
         
         for(const [language,solutionCode] of Object.entries(finalReferenceSolution)){
             const laguageId = getJudge0LanguageId(language);
             const submissions = testcases.map(({input,output})=>{
                return {
                    source_code:solutionCode,
                    language_id:laguageId,
                    stdin:input,
                    expected_output:output
                }
             })
             const submissionResults = await submitBatch(submissions);
             const tokens = submissionResults.map((obj)=> { return obj.token})
             const results = await pollBatchResults(tokens);
             
             for(let i=0;i<results.length;i++){
                const result = results[i];
                if(result.status.id!==3){
                    throw new ApiError(500,`Testcase ${i+1} failed for language: ${language}`);
                }
             }
         }
       }
       const updatePayload = {};
       if(title) updatePayload.title = title;
       if(description) updatePayload.description = description;
       if(difficulty) updatePayload.difficulty = difficulty;
       if(tags) updatePayload.tags = tags;
       if(examples) updatePayload.examples = examples;
       if(constraints) updatePayload.constraints = constraints;
       if(testcases) updatePayload.testcases = testcases;
       if(codeSnippets) updatePayload.codeSnippets = codeSnippets;
       if(referenceSolutions) updatePayload.referenceSolutions = referenceSolutions;

       const updatedProblem = await prisma.problem.update({
        where:{
            id
        },
        data:updatePayload,
       })
       if(!updatedProblem){
         throw new ApiError(500,"Failed to update Problem");
       }
      // console.log(updatedProblem);//
       return res.status(200).json(new ApiResponse(200, "Problem updated successfully", {
        problemId: updatedProblem.id
      }));
})

const deleteProblem = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const problem = await prisma.problem.findUnique({where:{id}});
    if(!problem){
        throw new ApiError(404,`Problem with id:${id} not found`);
    }
    const deletedProblem = await prisma.problem.delete({where:{id}});
    if(!deleteProblem){
        throw new ApiError(500,`Failed to delete problem with id:${id}`);
    }
    return res.status(200).json(new ApiResponse(200,`Problem with id: ${id} deleted successfully`,{
        deletedProblem
    }))
})

const getAllSolvedProblemsByUser = asyncHandler(async(req,res)=>{
      const userId = req.user.id;
      const allProblemsSolvedByUser = await prisma.solvedProblem.findMany({
        where: { userId },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
        },
      });
     // console.log(allProblemsSolvedByUser)
      if(!allProblemsSolvedByUser){
        throw new ApiError(500,`Failed To get problems solved my user`)
      }
      if(Array.isArray(allProblemsSolvedByUser) && allProblemsSolvedByUser.length === 0){
        return res.status(200).json(new ApiResponse(200,"User has not solved any problem",[]))
      }
      return res.status(200).json(new ApiResponse(200,"Successfully fetched all problems solved by user",{
       allProblemsSolvedByUser
      }))
})

export {createProblem, getAllProblems
    ,getProblemById,updateProblem
    ,deleteProblem,
    getAllSolvedProblemsByUser
}