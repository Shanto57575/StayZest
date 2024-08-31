import Review from "../models/review.model.js";
import mongoose from "mongoose";

const createReview = async (req, res) => {
    try {
        const { user, place, comments } = req.body;

        if (!user || !place || !comments) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newReview = new Review({ user, place, comments });

        await newReview.save();
        res.status(200).json({ message: "Review Added Successfully", newReview });
    } catch (error) {
        res.status(500).json({ error: "Server error. Could not create review.", error });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('user', 'username').populate('place', "location country").sort({ createdAt: -1 })
        res.status(200).json({ message: "All reviews", reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Server error. Could not fetch reviews.", error });
    }
};

const getReviewsByPlace = async (req, res) => {
    try {
        const { place } = req.params;

        const reviews = await Review.find({ place })
            .populate('user', 'username')

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No review Yet" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Server error. Could not fetch reviews.", error });
    }
};

const getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(mongoose.Types.ObjectId(reviewId))
            .populate('user', 'name')
            .populate('place', 'name');

        if (!review) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: "Server error. Could not fetch review.", error });
    }
};

// Update a review by ID
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;

        if (!comments) {
            return res.status(400).json({ error: "Nothing to update." });
        }

        const updatedReview = await Review.findByIdAndUpdate(id, { comments }, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.status(200).json({ message: "review updated successfully", updatedReview });
    } catch (error) {
        res.status(500).json({ error: "Server error. Could not update review.", error });
    }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error. Could not delete review.", error });
    }
};

export {
    createReview,
    getReviewById,
    getAllReviews,
    getReviewsByPlace,
    updateReview,
    deleteReview
}