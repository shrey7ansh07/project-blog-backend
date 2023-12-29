import { Router } from "express";
import { verifyUser } from "../middlewares/authMW.js";
import {postBlog,getBlog, editBlog,deleteBlog} from "../controllers/blog.controller.js"

const router = Router()

//* protected routes
router.route("/addblog").post(verifyUser,postBlog)
router.route("/editblog/:userId").patch(verifyUser,editBlog,getBlog)
router.route("/getblogs/:userId").get(verifyUser,getBlog)
router.route("/deleteblog/:blogId").post(verifyUser,deleteBlog)

export default router