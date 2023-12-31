import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    report:
    {
        type: String
    }
})

export const Report = mongoose.model("Report", reportSchema)