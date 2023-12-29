import mongoose from "mongoose";


const FollowSchema = mongoose.Schema({
    follower: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    following:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   
        required: true, 
    },

},
{
    timestamps: true,
}
)

export const Follow = mongoose.model("Follow",FollowSchema)

