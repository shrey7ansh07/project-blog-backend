import { Router } from "express";
import {registerUser, loginUser,logOutUser,refreshAccessToken,updateUser,updatePassword, getUser, uploadImage} from "../controllers/user.controller.js"
import {upload} from "../middlewares/imageMW.js"
import {verifyUser} from "../middlewares/authMW.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//* secured routes that go via authentication of middlewares
router.route("/uploadimage").post(verifyUser,upload.single('coverimage'),uploadImage)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/logout").post(verifyUser,logOutUser)
router.route("/update").post(verifyUser,updateUser)
router.route("/changepassword").post(verifyUser,updatePassword)
router.route("/checkauth").post(verifyUser,getUser)


export default router