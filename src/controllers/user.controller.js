import {asyncHandler} from "../utilities/asyncHandler.js"
import {ErrorDealer} from "../utilities/errorHandler.js"
import {User} from "../models/User.models.js"
import {uploadOnCloudinary} from "../utilities/imageUpload.js"
import {APIresponse} from "../utilities/apiHandlerRes.js"

const generateAccessAndRefereshTokens = async (userId) =>{
    try {
        // console.log(userId)
        const user = await User.findById(userId)
        
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        // console.log("refresh token ",refreshToken)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ErrorDealer(500, "Something went wrong while generating referesh and access token")
    }
    }
const registerUser = asyncHandler(async (req,res) => {
    //* get the user details from the frontend
    //* validate it as no required feilds are left empty
    //* check if user already exist or not ( username || email )
    //* images are provided or not as 
    //* upload it to cloudinary
    //* images are uploaded or not on cloudinary
    //* create an user object and save it in the db (User)
    //* response to be received back by removing the password and refresh token

    var coverimageUrl = ""
    const {username, fullname, email, password} = req.body //* step 1
    // console.log("email : ", email)
    if([username,fullname,email,password].some((feild) => feild?.trim() === undefined))
        {throw new ErrorDealer(400, "All feilds are necessary")} //* step 2

    const existingUser = await User.findOne({$or: [{username :username}, {email :email}]})
    if(existingUser) {throw new ErrorDealer(409, "User with email or username already exists")}
    //* step 3


    if(req.files&&Array.isArray(req.files.coverimage)&&req.files.coverimage.length > 0)
    {
        // console.log(req.files)
        const coverimageLocalPath = req.files.coverimage[0].path;
        // console.log(coverimageLocalPath)
        const coverimage = await uploadOnCloudinary(coverimageLocalPath)
        coverimageUrl = coverimage?.url
    }
    //* step 4
    const user = await User.create({
        fullname: fullname.toLowerCase(),
        email : email,
        password: password,
        username: username.toLowerCase(),
        coverimage: coverimageUrl,
    })
    //* step 5
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //* step 6

    if(!createdUser)
    {
        throw new ErrorDealer(400, "There was some issue while registering the user")
    }
    return res.status(201).json(
        new APIresponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {
    //* get the data from the frontend
    //* check whether required feilds are present
    //* check if the user exist in the db if not then send an message
    //* check if the password entered is correct 
    //* if correct create refresh and access token
    //* check whether they are created and if so update them on the db 
    //* return an response to the user 

    const {username, email, password} = req.body  //* step 1
    // console.log(username,email,password)

    if(username === undefined && email === undefined) {throw new ErrorDealer(418, "Enter email or username")} //* step 2

    const user = await User.findOne({$or: [{username :username}, {email :email}]})
    if(!user) {throw new ErrorDealer(409, "User not found")} //* step 3

    const existingUser = await user.isPasswordCorrect(password)

    if(!existingUser) {throw new ErrorDealer(418, "Invalid Credentials")} //* step 4

    const {refreshToken, accessToken} = await generateAccessAndRefereshTokens(user._id) //* step 5 and 6

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new APIresponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )})

const logOutUser =  asyncHandler(async (req,res) => {
    // const newuser = await User.findByIdAndUpdate(req.user._id,{$set: {refreshToken: undefined}},{new : true})
    // console.log(newuser)
    const user = await User.findById(req.user._id)
    user.refreshToken = undefined
    await user.save({ validateBeforeSave: false })    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new APIresponse(200, "Logout Successfully"))
})

export {registerUser,loginUser, logOutUser}