import { asyncHandler } from "../utilities/asyncHandler.js";
import { ErrorDealer } from "../utilities/errorHandler.js";
import {Blog} from "../models/Blog.models.js"
import {APIresponse} from "../utilities/apiHandlerRes.js"
import {User} from "../models/User.models.js"


const postBlog = asyncHandler(async(req,res,next) => {
    //* fetch the blog data 
 try {
       const data = req.body
       //* get the user 
       const user = await User.findById(req.user._id)
       if(!user)
       {
           throw new ErrorDealer(404, "user not found while posting blog")
       }
       //* use the authorId
       const authorId = req.user?._id
       //* create a blog in the data base
       const newBlog = await Blog.create({
           blogtitle: data.blogtitle,
           author: authorId,
           blogcontent: data.blogcontent,
           genre: data.genre
       })
       if(!newBlog)
       {
           throw new ErrorDealer(500,"Some issue while saving the blog")
       }
       res
       .status(200)
       .json(new APIresponse(
           200,
           {
               newBlog,
           },
           "Blog saved successfully"
       ))
 } catch (error) {
    next(error)
 }



})

const getBlog =  asyncHandler(async(req,res,next) => {
    try {
        const userId = req.params.userId
        if(!userId)
        {
            throw new ErrorDealer(401, "Unauthorized request for fetching blogs")
        }
        const blogs = await Blog.find({author: userId})
        res
        .status(200)
        .json(new APIresponse(
            200,
            {
                blogs
            },
            "checked for the blogs successfully"
        ))
    }
     catch (error) {
        next(error)
    }}
)

const editBlog = asyncHandler(async(req,res,next) => {
    //* fetch the blog
try {
        const blog = await Blog.findByIdAndUpdate(req.body._id,{
            blogtitle:req.body.blogtitle,
            genre: req.body.genre,
            blogcontent: req.body.blogcontent
        })
        if(!blog)
        {
            throw new ErrorDealer(500,"Unable to make changes")
        }
        next()
} catch (error) {
    next(error)
}


})

const deleteBlog = asyncHandler(async(req,res,next) => {
    try {
        //* get the blog to be deleted 
        const blog = await Blog.findById(req.params.blogId)
        if(!blog)
        {
            throw new ErrorDealer(404,"Blog not found")
        }
        const response = await Blog.deleteOne(blog._id)
        if(!response)
        {
            throw new ErrorDealer(500,"Blog can not be deleted")
        }
        //* blog deleted successfully
        res
        .status(200)
        .json(new APIresponse(
            200,
            "Blog deleted Successfully"
        ))
      }
     catch (error) 
     {
        next(error)
     }

})

export {
    postBlog,
    getBlog,
    editBlog,
    deleteBlog
}