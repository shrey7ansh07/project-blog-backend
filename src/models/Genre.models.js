import mongoose from "mongoose";

const GenreSchema = mongoose.Schema(
    {
        genrename:
        {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        blogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
        ]

    },
    {
        timestamps: true
    }

)

export const Genre = mongoose.model("Genre",GenreSchema)