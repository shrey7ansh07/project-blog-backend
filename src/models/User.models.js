import mongoose from "mongoose";

const UserSchema =  mongoose.Schema(
{
    username : {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
    },
    email : {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    fullname : {
        type: String,
        required: true,
        lowercase: true,
    },
    coverImage : {
        type: String, //* url from cloudinary
        default: ""
    },
    blogsread : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "blogs" 
        }],
    blogsliked : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "blogs"
    }],
    //* these consist of the id's of the blogs he read
    password : {
        required: [true, "password is required"],
        type: String //* because we will decrypt the password before storing it 
    }
},
{
    timestamps: true
}
)

export const User = mongoose.model("User", UserSchema)