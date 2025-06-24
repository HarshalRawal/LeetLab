import express from "express";
import { getPlaylistDetails,getAllPlaylistDetails,createPlaylist,addProblems,removeProblems,renamePlaylist,deletePlaylist } from "../controllers/playlist.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
const playlistRoutes = express.Router();


playlistRoutes.get("/",verifyJwt,getAllPlaylistDetails);
playlistRoutes.get("/:playlistId",verifyJwt,getPlaylistDetails);
playlistRoutes.post("/create",verifyJwt,checkAdmin,createPlaylist);
playlistRoutes.post("/addProblems/:playlistId",verifyJwt,checkAdmin,addProblems);
playlistRoutes.post("/rename/:playlistId",verifyJwt,checkAdmin,renamePlaylist)
playlistRoutes.delete('/removeProblems/:playlistId',verifyJwt,checkAdmin,removeProblems);
playlistRoutes.delete('/delete/:playlistId',verifyJwt,checkAdmin,deletePlaylist);

export default playlistRoutes