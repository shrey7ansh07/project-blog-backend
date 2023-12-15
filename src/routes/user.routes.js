import { Router } from "express";
import {registerUser, loginUser,logOutUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/imageMW.js"
import {verifyUser} from "../middlewares/authMW.js"

const router = Router()

router.route("/register").post(
    upload.fields([{name: "coverimage"}]),
    registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyUser,logOutUser)

export default router