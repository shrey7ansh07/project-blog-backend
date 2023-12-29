import mongoose from "mongoose";

const BlogSchema = mongoose.Schema(
    {
        blogtitle: 
        {
            type: String,
            required: true,
            lowercase: true,
        },
        author:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        blogcontent: 
        {
            type: String,
            required: true,
        },
        images:
        {
            type: String,
            default: ""
        },
        likescount:
        {
            type: Number,
            default: 0,
        },
        isPosted:
        {
            type: Boolean,
            default: false
        },
        genre:
        {
            type: String,
            enum: ["Personal", "Business", "News", "Professional", "Niche", "Lifestyle", "Fitness", "Food", "Travel", "Fashion", "Beauty", "DIY", "Finance", "Parenting", "Health and Wellness", "Music", "Movie", "Car", "Gaming", "Tech"],
            required: true,
        }
    },
    {
        timestamps: true
    }
    
)

export const Blog = mongoose.model("Blog",BlogSchema)