import express from 'express';
import {
    cancelBooking,
    confirmBooking,
    createBookingIntent,
    getAllBookings,
    getBookingByEmail,
    getBookingById,
    updateBooking
} from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';
import isAdmin from '../utils/protectedRoutes.js';

const bookingRoutes = express.Router();

bookingRoutes.post('/create-booking-intent', verifyToken, createBookingIntent);
bookingRoutes.post('/confirm-booking', verifyToken, confirmBooking);
bookingRoutes.get('/all-Bookings', verifyToken, isAdmin, getAllBookings);
bookingRoutes.get('/:email', verifyToken, getBookingByEmail);
bookingRoutes.get('/:id', verifyToken, getBookingById);
bookingRoutes.put('/:id', verifyToken, isAdmin, updateBooking);
bookingRoutes.delete('/:id', verifyToken, cancelBooking);

export default bookingRoutes;