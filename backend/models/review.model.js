import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

const Review = mongoose.model("Review", reviewSchema)

export default Review;