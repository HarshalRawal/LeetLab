import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import prisma from "../db/index.js";

export const create = asyncHandler(async(req,res)=>{
    const {solutionId} = req.params
    const {parentCommentId,content} = req.body;
    const userId = req.user.id
    const solution = await prisma.solution.findUnique({
        where:{
            id:solutionId
        }
    })
    if(!solution){
        throw new ApiError(404,`Solution Not Found`)
    }
    const comment = await prisma.comment.create({
        data:{
            solutionId,
            userId,
            parentCommentId:parentCommentId ? parentCommentId : null,
            content,
        },
    })
    return res.status(201).json(new ApiResponse(201,`Comment created successfully`,{
        comment
    }))
})

export const getComments = asyncHandler(async(req,res)=>{
    const {solutionId} = req.params;
    const {limit,cursor} = req.query;
    const take = parseInt(limit) + 1
    const allComments = await prisma.comment.findMany({
        where:{
            solutionId,
            parentCommentId:null
        },
        take:take,
        ...(cursor && {
            cursor : {id : cursor},
            skip : 1
        }),
        orderBy : [
            {like:"desc"},
            {dislike:"asc"},
            {createdAt:"desc"}
        ],
        select:{
            id:true,
            content:true,
            user:{
                select :{
                  id:true,
                  username:true 
                }
            },
            createdAt : true,
            like:true,
            dislike:true,
            _count:{
                select : {replies : true}
            }
        }
    })
    const hasMoreComment = allComments.length > limit;
    if(hasMoreComment){
        allComments.pop()
    }
    const formattedComments = allComments.map((comment)=>({
        id:comment.id,
        content:comment.content,
        username:comment.user.username,
        likes:comment.like,
        dislikes:comment.dislike,
        createdAt:comment.createdAt,
        replies:comment._count.replies
    }))
    return res.status(200).json(new ApiResponse(200,`fetched comments successfully`,{
        comments:formattedComments,
        nextCursor: hasMoreComment ? formattedComments[formattedComments.length - 1].id : null
    }))
})

export const getReplies = asyncHandler(async(req,res)=>{
    const { parentCommentId } = req.params;
    const {limit,cursor} = req.query;
    const take = parseInt(limit) + 1 || 10;

    const parentComment = await prisma.comment.findUnique({
        where:{
            id:parentCommentId
        },
        select:{
            id:true
        }
    })

    if(!parentComment){
       throw new ApiError(404,`No parent comment found`);
    }

    const replies = await prisma.comment.findMany({
        where:{
            parentCommentId
        },
        take:take,
        ...(cursor && {
            cursor : {id : cursor},
            skip:1
        }),
        select:{
            parentCommentId:true,
            id:true,
            like:true,
            dislike:true,
            content:true,
            createdAt:true,
            user:{
                select:{
                    id:true,
                    username:true
                }
            },
            _count:{
                select:{replies:true}
            }
        },
        orderBy:[
            {like:"desc"},
            {dislike:"asc"},
            {createdAt:"desc"}
        ]
    })
   const hasMoreReplies = replies.length > limit;
   if(hasMoreReplies){
    replies.pop();
   }
   const formattedReplies = replies.map((reply)=>({
    id:reply.id,
    content:reply.content,
    parentCommentId:reply.parentCommentId,
    username:reply.user.username,
    createdAt:reply.createdAt,
    likes:reply.like,
    dislike:reply.dislike,
    replies:reply._count.replies,
   }))

   return res.status(200).json(new ApiResponse(200,`Fetched replies`,{
    replies:formattedReplies,
    nextCursor: hasMoreReplies ? formattedReplies[formattedReplies.length - 1].id : null
   }))
})

export const update = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const {content} = req.body;
   const updatedComment = await prisma.comment.update({
    where:{
        id:commentId
    },
    data:{
        content
    },
    select:{
        id:true,
        content:true,
        updatedAt:true
    }
   })
   return res.status(200).json(new ApiResponse(200,"Comment updated successfully",{
    id:updatedComment.id,
    content:updatedComment.content,
    updatedAt:updatedComment.updatedAt
   }))
})

export const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const userId = req.user.id;
    const comment = await prisma.comment.findUnique({
        where:{
            id:commentId
        },
        select:{
            id:true,
            userId:true
        }
    })
    if(!comment){
        throw new ApiError(400,`Comment Not Found`);
    }
    if(comment.userId!==userId){
       throw new ApiError(403,`You are unauthorized to delete this comment`)
    }
    const deletedComment = await prisma.comment.delete({
        where:{
            id:commentId
        },
        select:{
            id:true
        }
    })
    return res.status(200).json(new ApiResponse(200,`Comment deleted Successfully`,{
        id:deletedComment.id
    }))
})

export const likeDislikeComment = asyncHandler(async (req, res) => {  
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;
  
    if (!["LIKE", "DISLIKE"].includes(type)) {
      throw new ApiError(400, "Invalid type. Must be LIKE or DISLIKE");
    }
  
    const existing = await prisma.likeDislike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    });
  
    if (!existing) {
      // User has not liked/disliked yet → create record & increment count
      await prisma.$transaction([
        prisma.likeDislike.create({
          data: {
            userId,
            commentId,
            type
          }
        }),
        prisma.comment.update({
          where: { id: commentId },
          data: {
            like: type === "LIKE" ? { increment: 1 } : undefined,
            dislike: type === "DISLIKE" ? { increment: 1 } : undefined
          }
        })
      ]);
      return res.status(200).json(new ApiResponse(200, `Successfully ${type === "LIKE" ? "liked" : "disliked"} the comment`));
    }
  
    if (existing.type === type) {
      // User clicked same option again → remove record & decrement count
      await prisma.$transaction([
        prisma.likeDislike.delete({
          where: {
            userId_commentId: {
              userId,
              commentId
            }
          }
        }),
        prisma.comment.update({
          where: { id: commentId },
          data: {
            like: type === "LIKE" ? { decrement: 1 } : undefined,
            dislike: type === "DISLIKE" ? { decrement: 1 } : undefined
          }
        })
      ]);
      return res.status(200).json(new ApiResponse(200, `Removed ${type === "LIKE" ? "like" : "dislike"}`));
    }
  
    // User switched from like → dislike or vice versa
    await prisma.$transaction([
      prisma.likeDislike.update({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        },
        data: { type }
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          like: { increment: type === "LIKE" ? 1 : -1 },
          dislike: { increment: type === "DISLIKE" ? 1 : -1 }
        }
      })
    ]);
  
    return res.status(200).json(new ApiResponse(200, `Updated to ${type.toLowerCase()}`));
});
  