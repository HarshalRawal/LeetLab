import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import prisma from "../db/index.js";
import { VoteType } from "@prisma/client";
export const createSolution = asyncHandler(async (req,res) => {
    const {title,content,problemId} = req.body;
    const userId = req.user.id;
    const problemExists = await prisma.problem.findUnique({
        where: { id: problemId }
      });
      if (!problemExists) {
        throw new ApiError(404, "Problem not found");
     }
    const newSolution = await prisma.solution.create({
        data:{
            title,
            content,
            problemId,
            userId
        }
    })
    if(!newSolution){
        throw new ApiError(500,`Failed to create solution`)
    }
    return res.status(201).json(new ApiResponse(201,`new solution registered successfully`,{
        newSolution
    }))
})

export const getAllSolutions = asyncHandler(async (req,res) => {
    const {problemId} = req.params;
    const {cursor,limit} = req.query;
    const take = parseInt(limit) + 1;
    const problem = await prisma.problem.findUnique({
        where:{
            id:problemId
        }
    })
    if(!problem){
        throw new ApiError(404,"Problem does not exists")
    }
    const query = {
        where:{
            problemId
        },
        take:take,
        select:{
            id:true,
            title:true,
            upvotes:true,
            viewCount:true,
            createdAt:true,
            user:{
                select:{
                    id:true,
                    username:true,
                }
            },
            _count:{
                select:{
                    comments:true
                }
            }
        },
        orderBy:[
            {viewCount:"desc"},
            {upvotes:"desc"}
        ] 
    }
    if(cursor){
        query.cursor = {id:cursor}
        query.skip = 1
    }
    const solutions = await prisma.solution.findMany(query)

    const hasMore = solutions.length > limit;
    if(hasMore) solutions.pop();
    const formattedSolutions = solutions.map((sol)=> ({
        id:sol.id,
        title:sol.title,
        username:sol.user.username,
        upvotes: sol.upvotes,
        viewCount:sol.viewCount,
        commentCount:sol._count.comments,
        createdAt:sol.createdAt
    }))
    return res.status(200).json(new ApiResponse(200,`Successfully fetched all solutions`,{
        solutions:formattedSolutions,
        nextCursor: hasMore ? formattedSolutions[formattedSolutions.length-1].id:null
    }))
})

export const getSolution = asyncHandler(async(req,res)=>{
    const {solutionId} = req.params
    const userId = req.user.id

    const hasUserViewed = await prisma.solutionView.findUnique({
        where:{
            solutionId_userId:{
                solutionId,
                userId
            }
        }
    })
    const vote = await prisma.vote.findUnique({
        where:{
            solutionId_userId:{
                solutionId,
                userId
            }
        },
        select:{
            id:true,
            type:true
        }
    })
    if(!hasUserViewed){
        await prisma.$transaction([
             prisma.solutionView.create({
                data: { userId, solutionId }
              }),
             prisma.solution.update({
                where:{
                    id:solutionId
                },
                data:{
                    viewCount:{increment:1}
                }
            })
        ])
    }
    const solution = await prisma.solution.findUnique({
        where:{
            id:solutionId
        },
        select:{
            id:true,
            upvotes:true,
            downvotes:true,
            title:true,
            viewCount:true,
            content:true,
            createdAt:true,
            user:{
                select:{
                    id:true,
                    username:true
                }
            },
            _count:{
                select:{comments:true}
            },
            comments:{
                where:{parentCommentId:null},
                orderBy:[
                    {createdAt:"desc"},
                    {like:"desc"},
                    {dislike:"asc"}
                ],
                take:3,
                select:{
                    like:true,
                    dislike:true,
                    createdAt:true,
                    id:true,
                    content:true,
                    user:{
                        select:{
                            id:true,
                            username:true
                        }
                    },
                    _count:{
                        select:{
                            replies:true
                        }
                    }
                }
            }
        }
    })

    res.status(200).json(new ApiResponse(200,`Successfully fetched the solution`,{
        id:solution.id,
        title:solution.title,
        createdAt:solution.createdAt,
        viewCount:solution.viewCount,
        upvotes:solution.upvotes,
        downvotes:solution.downvotes,
        content:solution.content,
        username:solution.user.username,
        comments:solution.comments,
        commentCount:solution._count.comments,
        hasVoted:vote
    }))
})

export const vote = asyncHandler(async(req,res)=>{
       const userId = req.user.id;
       const {solutionId} = req.params;
       const {voteType} = req.body;
       if (!["UPVOTE", "DOWNVOTE"].includes(voteType)) {
        throw new ApiError(400, "Invalid vote type");
      }
       const type = voteType==="UPVOTE"?VoteType.UPVOTE:VoteType.DOWNVOTE

       const hasVoted = await prisma.vote.findUnique({
        where:{
            solutionId_userId:{
                solutionId,
                userId
            }
        },
        select:{
            id:true,
            type:true
        }
       })
       if(!hasVoted){
         await prisma.$transaction(
            [
                prisma.vote.create({
                    data:{
                        solutionId,
                        userId,
                        type
                    }    
                }),
                
                prisma.solution.update({
                    where:{
                        id:solutionId
                    },
                    data:{
                    upvotes: type===VoteType.UPVOTE?{increment:1}:undefined,
                    downvotes : type===VoteType.DOWNVOTE?{increment:1}:undefined,
                    }
                })
            ]
         )
         return res.status(200).json(new ApiResponse(200,`Successfully ${type} the problem`))
       }
    if(hasVoted.type===type){
        await prisma.$transaction([
            prisma.vote.delete({
                where:{
                    solutionId_userId:{
                        solutionId,
                        userId
                    }
                }
            }),
            prisma.solution.update({
                where:{
                    id:solutionId
                },
                data:{
                    upvotes:type===VoteType.UPVOTE ? {decrement:1}:undefined,
                    downvotes:type===VoteType.DOWNVOTE ? {decrement:1}:undefined
                }
            })
        ])

        return res.status(200).json(new ApiResponse(200,`Vote removed`))
    }
    
    await prisma.$transaction([
         prisma.vote.update({
            where:{
                solutionId_userId:{
                    solutionId,
                    userId
                }
            },
            data:{
                type
            }
        }),
        prisma.solution.update({
            where:{
                id:solutionId
            },
            data:{
                upvotes : {
                    increment : type===VoteType.UPVOTE ? 1 : -1
                },
                downvotes :{
                    increment : type===VoteType.DOWNVOTE ? 1 : -1
                }
            }
        })
    ])
    return res.status(200).json(new ApiResponse(200,`Vote Updated`));
})

export const updateSolution =  asyncHandler(async(req,res)=>{
    const {solutionId} = req.params;
    const {title,content} = req.body;
    if(!title && !content){
        throw new ApiError(400,`title or content are required`)
    }
    const userId  = req.user.id
    const solution = await prisma.solution.findUnique({
        where:{
            id :solutionId
        }
    })
    if(solution.userId !== userId){
        throw new ApiError(400,`You are not authorized to update the solution`)
    }
    const updateSolution = await prisma.solution.update({
        where:{
            id:solutionId
        },
        data:{
            title : title ? title : undefined,
            content: content ? content : undefined
        },
    })
    return res.status(200).json(new ApiResponse(200,`Solution Updated`,{
        updateSolution
    }))
})

export const deleteSolution = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const {solutionId} = req.params;
    const solution = await prisma.solution.findUnique({
        where:{
            id:solutionId
        }
    })
    if(solution.userId!==userId){
        throw new ApiError(400,`You are unauthorized to delete this solution`)
    }
    const deletedSolution = await prisma.solution.delete({
          where:{
            id:solutionId,  
          }
    })
    return res.status(200).json(new ApiResponse(200,`Solution deleted Successfully`,{
        deletedSolution
    }))
})