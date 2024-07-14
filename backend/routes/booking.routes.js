import express from 'express';
import { cancelBooking, createBooking, getAllBookings, getBookingByEmail, getBookingById, updateBooking } from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';
import isAdmin from '../utils/protectedRoutes.js';

const bookingRoutes = express.Router();

bookingRoutes.post('/add-booking', verifyToken, createBooking);
bookingRoutes.get('/all-Bookings', verifyToken, isAdmin, getAllBookings);
bookingRoutes.get('/:id', verifyToken, getBookingById);
bookingRoutes.get('/user-bookings', verifyToken, getBookingByEmail);
bookingRoutes.put('/:id', verifyToken, updateBooking);
bookingRoutes.delete('/:id', verifyToken, cancelBooking);

export default bookingRoutes;