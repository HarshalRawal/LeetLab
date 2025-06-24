import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import prisma from "../db/index.js";


export const createPlaylist = asyncHandler(async()=>{
    const {name,description} = req.body
    const userId =  req.user.id
    const existingPlaylist = await prisma.playlist.findUnique({
        where:{
            name,
            userId
        }
    })
    if(existingPlaylist){
        throw new ApiError(409,`Playlist with name:${name} already exists`);
    }
    const newPlaylist  = await prisma.playlist.create({
        data:{
            name,
            description,
            userId
        }
    })
    if(!newPlaylist){
        throw new ApiError(500,`Failed to create new Playlist`)
    }
    return res.status(201).json(new ApiResponse(201,`Successfully created new Playlist`,{
        newPlaylist
    }))
})

export const getAllPlaylistDetails = asyncHandler(async()=>{
    const userId = req.user.id;

    const playlist = await prisma.playlist.findMany({
        where:{
            userId
        },
        include:{
            problems:{
                include:{
                    problem:true
                }
            }
        }
    })
    if(!playlist){
        throw new ApiError(500,"Failed to fetch all playlist")
    }
    return res.status(200).json(new ApiResponse(200,`Successfully fetched all playlist`))
})

export const getPlaylistDetails = asyncHandler(async () => {
    const {playlistId} = req.params
    const userId = req.user.id
    const playlist = await prisma.playlist.findUnique({
        where:{
            userId,
            id:playlistId
        },
        include:{
            problems:{
                include:{
                    problem:true
                }
            }
        }
    })
    if(!playlist){
        throw new ApiError(404,`Playlist Not Found`)
    }
    return res.status(200).json(new ApiResponse(200,`Playlist Found`,{
        playlist
    }))
})

export const addProblems = asyncHandler(async()=>{
    const {playlistId}= req.params
    const {problems} = req.body;

    if(!Array.isArray(problems)){
        throw new ApiError('Invalid Problems data-type. Problems must be an array')
    }
    const problemInPlaylist = await prisma.problemInPlaylist.createMany({
        data:problems.map((problemId)=>({
            playlistId,
            problemId
        }))
    })
    return res.status(200).json(new ApiResponse(200,`Problems added successfully`),{
        problemInPlaylist
    })
})

export const removeProblems = asyncHandler(async()=>{
    const {playlistId} = req.params
    const {problems} = req.body;

    if(!Array.isArray(problems)){
        throw new ApiError(400,'Invalid Problems data-type. Problems must be an array')
    }
    const existingProblems = await prisma.problemInPlaylist.findMany({
        where:{
            playlistId,
            problemId:{
                in:problems
            }
        },
        select:{
            problemId:true
        }
    })
    const existingProblemsIds = existingProblems.map((problem)=> problem.problemId);

    if (existingProblemsIds.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No matching problems found in playlist", {
          requestedDeletion: problems.length,
          deletedCount: 0,
          deletedIds: []
        }));
      }
    const deletedProblems = await prisma.problemInPlaylist.deleteMany({
        where:{
            playlistId,
            problemId:{
                in:existingProblemsIds
            }
        }
    })
    return res.status(200).json(new ApiResponse(200,`Problems removed successfully`,{
        requestedDeletion:problems.length,
        deletedCount:deletedProblems.count,
        deletedIds:existingProblemsIds
    }))
})


export const deletePlaylist = asyncHandler(async()=>{
    const {playlistId} = req.params;
    const userId = req.user.id
    const deletedPlaylist = await prisma.playlist.delete({
        where:{
            id:playlistId,
            userId:userId
        }
    })
    return res.status(200).json(new ApiResponse(200,`Successfully deleted playlist`,{
        deletedPlaylist
    }))
})

export const renamePlaylist = asyncHandler(async () => {
    const {playlistId} = await req.params;
    const {newName} = req.body;
    const userId = req.user.id
    const updatedPlaylist = await prisma.playlist.update({
        where:{
            id:playlistId,
            userId
        },
        data:{
            name:newName
        }
    })
    return res.status(200).json(new ApiResponse(200,`Successfully renamed the playlist`,{
        updatedPlaylist
    }))
})