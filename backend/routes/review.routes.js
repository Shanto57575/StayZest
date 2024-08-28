import express from 'express';
import { verifyToken } from '../utils/jwtUtils.js';
import isAdmin from '../utils/protectedRoutes.js';
import { createReview, deleteReview, getAllReviews, getReviewsByPlace, updateReview } from '../controllers/review.controller.js';

const reviewRoutes = express.Router();

reviewRoutes.post('/add-review', verifyToken, createReview);
reviewRoutes.get('/all-reviews', verifyToken, isAdmin, getAllReviews);
reviewRoutes.get('/reviews-by-place/:place', verifyToken, getReviewsByPlace);
reviewRoutes.put('/:id', verifyToken, updateReview);
reviewRoutes.delete('/:id', verifyToken, deleteReview);

export default reviewRoutes;