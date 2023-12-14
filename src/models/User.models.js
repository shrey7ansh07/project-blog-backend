import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

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

UserSchema.pre("save", async function(next)
{
    if(!this.isModified("password")) return next();
    try{
        this.password = await bcrypt.hash(this.password,process.env.SALT_ROUNDS);
        next();
    }
    catch (error){
        next(error)
    }
})

UserSchema.methods.isPasswordCorrect = async function(password)
{
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function()
{
    jwt.sign({
        id: _id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}
UserSchema.methods.generateRefreshToken = function()
{
    jwt.sign({
        id: _id,
    },
        process.env.REFRESH_TOKEN_SECRET,
       { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User", UserSchema)