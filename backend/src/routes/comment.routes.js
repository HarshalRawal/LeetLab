import express from "express"
import { create,getComments,getReplies,update,deleteComment,likeDislikeComment } from "../controllers/comment.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const commentRoutes = express.Router();

commentRoutes.post("/create/:solutionId",verifyJwt,create);
commentRoutes.get("/:solutionId",verifyJwt,getComments);
commentRoutes.get("/relpies/:parentCommentId",verifyJwt,getReplies);
commentRoutes.patch("/update/:commentId",verifyJwt,update);
commentRoutes.patch("/react/:commentId",verifyJwt,likeDislikeComment);
commentRoutes.delete("/:commentId",verifyJwt,deleteComment);

export default commentRoutes