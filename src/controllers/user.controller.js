import {asyncHandler} from "../utilities/asyncHandler.js"
import {} from "../utilities/errorHandler.js"
const registerUser = asyncHandler(async (req,res) => {
    //* get the user details from the frontend
    //* validate it as no required feilds are left empty
    //* check if user already exist or not ( username || email )
    //* images are provided or not as it is a mandatory field 
    //* upload it to cloudinary
    //* images are uploaded or not on cloudinary
    //* create an user object and save it in the db (User)
    //* response to be received back by removing the password and refresh token


    const {username, fullname, email, password} = req.body
    // console.log("email : ", email)
    // if(
    //     [username,fullname,email,password].some((feild) => feild?.trim() === "")
    // )
    
    

})

export {registerUser}