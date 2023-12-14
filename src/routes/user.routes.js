import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/imageMW.js"

const router = Router()

router.route("/register").post(
    upload.single({
        name: "coverimage",
        maxCount: 1,
    }),
    registerUser)


//* here if the request is via post then we will know that we have to move to the register route



export default router