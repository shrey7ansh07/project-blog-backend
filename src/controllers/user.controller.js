import { asyncHandler } from "../utilities/asyncHandler.js"
import { ErrorDealer } from "../utilities/errorHandler.js"
import { User } from "../models/User.models.js"
import { Report } from "../models/Report.models.js"
import { Follow } from "../models/Follow.models.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utilities/imageUpload.js"
import { APIresponse } from "../utilities/apiHandlerRes.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        // console.log(userId)
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ErrorDealer(500, "Something went wrong while generating referesh and access token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    //* get the user details from the frontend
    //* validate it as no required feilds are left empty
    //* check if user already exist or not ( username || email )
    //* images are provided or not as 
    //* upload it to cloudinary
    //* images are uploaded or not on cloudinary
    //* create an user object and save it in the db (User)
    //* response to be received back by removing the password and refresh token

    const { username, fullname, email, password } = req.body //* step 1
    // console.log("email : ", email)
    if ([username, fullname, email, password].some((feild) => feild?.trim() === undefined)) { throw new ErrorDealer(400, "All feilds are necessary") } //* step 2

    const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] })
    if (existingUser) { throw new ErrorDealer(409, "User with email or username already exists") }
    //* step 3

    //* step 4
    const user = await User.create({
        fullname: fullname.toLowerCase(),
        email: email,
        password: password,
        username: username.toLowerCase(),
        coverimage: "",
        quote: "",
        bio: "",
        followers: 0,
        following: 0

    })
    //* step 5

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //* step 6

    if (!createdUser) {
        throw new ErrorDealer(400, "There was some issue while registering the user")
    }
    return res.status(201).json(
        new APIresponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res, next) => {
    //* get the data from the frontend
    //* check whether required feilds are present
    //* check if the user exist in the db if not then send an message
    //* check if the password entered is correct 
    //* if correct create refresh and access token
    //* check whether they are created and if so update them on the db 
    //* return an response to the user 

    const { username, email, password } = req.body  //* step 1



    if (username === undefined && email === undefined) { throw new ErrorDealer(418, "Enter email or username") } //* step 2


    const user = await User.findOne({ $or: [{ username: username }, { email: email }] })
    if (!user) { throw new ErrorDealer(404, "User not found") } //* step 3


    const existingUser = await user.isPasswordCorrect(password)



    if (!existingUser) { throw new ErrorDealer(500, "Invalid Credentials") } //* step 4

    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(user._id) //* step 5 and 6

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options1 = {
        httpOnly: true,
        secure: true,
        maxAge: 900000
    }
    const options2 = {
        httpOnly: true,
        secure: true,
        maxAge: 10800000
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options1)
        .cookie("refreshToken", refreshToken, options2)
        .json(
            new APIresponse(
                200,
                {
                    user: loggedInUser
                },
                "User logged In Successfully"
            )
        )
})

const logOutUser = asyncHandler(async (req, res) => {
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
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new APIresponse(200, "Logout Successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const { refreshToken: refreshTokenUser } = req.cookies;
    if (!refreshTokenUser) {
        throw new ErrorDealer(402, "unauthorized request : refreshtoken is invalid")
    }
    try {
        const decodedToken = jwt.verify(refreshTokenUser, process.env.REFRESH_TOKEN_SECRET)
        //* since i have only id as an attribute provided to the refreh token for a user we can use it 
        const user = await User.findById(decodedToken?._id)
        if (!user) { throw new ErrorDealer(401, "user does not exist") }
        if (refreshTokenUser !== user.refreshToken) {
            throw new ErrorDealer(402, "refresh token is expired")
        }
        const options1 = {
            httpOnly: true,
            secure: true,
            maxAge: 900000
        }
        const options2 = {
            httpOnly: true,
            secure: true,
            maxAge: 10800000
        }
        const { accessToken, refreshToken: newrefreshToken } = await generateAccessAndRefereshTokens(user._id)


        return res
            .status(200)
            .cookie("accessToken", accessToken, options1)
            .cookie("refreshToken", newrefreshToken, options2)
            .json(
                new APIresponse(200, "access token refreshed")
            )

    } catch (error) {
        next(error)
    }

})

const updateUser = asyncHandler(async (req, res, next) => {
    //*destructure the request

    const { username, fullname, email, bio, links, quote } = req.body

    //* update the user by finding him

    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            username: username,
            fullname: fullname,
            email: email,
            bio: bio,
            links: links,
            quote: quote,
        }, { new: true }).select("-password -refreshToken");
        if (!user) {
            throw new ErrorDealer(404, "User not found")
        }
        //* here the userdetails are Successfully changed
        res
            .status(200)
            .json(new APIresponse(
                200,
                {
                    user: user,
                },
                "Saved details Successfully"
            ))

    } catch (error) {
        next(error)
    }


})

const updatePassword = asyncHandler(async (req, res, next) => {
    //* destructure the information
    const { oldpassword, newpassword } = req.body
    //* find the user 
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            throw new ErrorDealer(404, "User not found while password update")
        }
        const isOldPasswordCorrect = await user.isPasswordCorrect(oldpassword)
        if (!isOldPasswordCorrect) {
            throw new ErrorDealer(401, "incorrect old password")
        }
        user.password = newpassword
        await user.save({ validateBeforeSave: false })

        res
            .status(200)
            .json(new APIresponse(200, "Password Changed Successfully"))

    } catch (error) {
        next(error)
    }

})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    res
        .status(200)
        .json(new APIresponse(
            200,
            {
                user: user
            },
            "welcome back"
        ))
})

const uploadImage = asyncHandler(async (req, res, next) => {
    //* get the image url
    const coverimageLocalPath = req.file.path;
    // console.log(coverimageLocalPath)
    //* uploaded on cloudinary
    const prevImage = req.user.coverimage


    try {
        const coverimage = await uploadOnCloudinary(coverimageLocalPath)
        if (!coverimage) {
            throw new ErrorDealer(500, "image not uploaded")
        }
        const coverimageUrl = coverimage?.url
        const user = await User.findByIdAndUpdate(req.user._id, {
            coverimage: coverimageUrl
        }, { new: true }).select("-password -refreshToken");
        if (!user) {
            throw new ErrorDealer(404, "User not found")
        }
        if (prevImage) {
            try {
                await deleteFromCloudinary(prevImage)
            }
            catch (error) {
                console.log(error);
            }
        }

        res
            .status(200)
            .json(new APIresponse(
                200,
                {
                    user: user,
                },
                "Saved details Successfully"
            ))

    } catch (error) {
        next(error)
    }


})

const report = asyncHandler(async (req, res, next) => {
    const { issue: issue } = req.body
    //* find the user to verify is it working
    try {
        const report = await Report.create({
            user: req.user._id,
            report: issue
        })

        if (!report) {
            throw new ErrorDealer(500, "report failed to submit")
        }

        res
            .status(200)
            .json(new APIresponse(
                200,
                "Report submitted successfully"
            ))

    } catch (error) {
        next(error)
    }


})

const isfollowing = asyncHandler(async (req, res, next) => {
    try {
        const userToFollow = await User.findById(req.params?.userId)

        if (!userToFollow) {
            throw new ErrorDealer(404, "user does not exist anymore")
        }

        const existingFollow = await Follow.findOne({ follower: req.user?._id, following: req.params?.userId });

        let value = false
        if (existingFollow) {
            value = existingFollow.isFollowed ? true : false
        }

        res
            .status(200)
            .json(new APIresponse(
                200,
                { value }
            ))

    } catch (error) {
        next(error)
    }
})

const followUser = asyncHandler(async (req, res, next) => {
    try {
        const userfollowing = await User.findById(req.user?._id)
        const userToFollow = await User.findById(req.params?.userId)

        if (!userToFollow) {
            throw new ErrorDealer(404, "user does not exist anymore")
        }

        const existingFollow = await Follow.findOne({ follower: req.user?._id, following: req.params?.userId });
        if (!existingFollow) {
            const follow = await Follow.create(
                {
                    follower: req.user?._id,
                    following: req.params?.userId,
                    isFollowed: true
                }
            )
            if (!follow) {
                throw new ErrorDealer(500, "Could not follow this account")
            }
            //* updating their follower and following 

            userToFollow.followers = userToFollow.followers + 1
            await userToFollow.save({ validateBeforeSave: false })
            userfollowing.following = userfollowing.following + 1
            await userfollowing.save({ validateBeforeSave: false })

            res
                .status(200)
                .json(new APIresponse(
                    200,
                    { value: true }
                ))
        }
        else {
            const currentStatus = existingFollow.isFollowed
            existingFollow.isFollowed = !currentStatus
            await existingFollow.save({ validateBeforeSave: false })
            userToFollow.followers = currentStatus ? userToFollow.followers - 1 : userToFollow.followers + 1
            await userToFollow.save({ validateBeforeSave: false })
            userfollowing.following = currentStatus ? userfollowing.following - 1 : userfollowing.following + 1
            await userfollowing.save({ validateBeforeSave: false })
            const value = currentStatus ? false : true
            res
                .status(200)
                .json(new APIresponse(
                    200,
                    { value }
                ))
        }

    } catch (error) {
        next(error)
    }
})


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    updateUser,
    updatePassword,
    getUser,
    uploadImage,
    report,
    followUser,
    isfollowing
}
