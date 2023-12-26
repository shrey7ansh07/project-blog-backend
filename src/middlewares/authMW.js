import { asyncHandler } from "../utilities/asyncHandler.js"
import { ErrorDealer } from "../utilities/errorHandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/User.models.js"
const verifyUser = asyncHandler(async (req,res,next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) {throw new ErrorDealer(401, "Unauthorized request")}

        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
        if(!user) {throw new ErrorDealer(401,"Invalid access token")}
        req.user = user
        console.log(req);
        next()
    } catch (error) {
        next(error)
    }
} )

export {verifyUser}