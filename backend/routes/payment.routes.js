import express from 'express';
import { verifyToken } from '../utils/jwtUtils.js';
import { getAllBookings } from '../controllers/booking.controller.js';
import { confirmBooking, createBookingIntent, getPaymentByEmail } from '../controllers/payment.controller.js';
import { isAdmin } from '../utils/protectedRoutes.js';

const paymentRoutes = express.Router();

paymentRoutes.get('/all-payments', verifyToken, isAdmin, getAllBookings);
paymentRoutes.post('/create-booking-intent', verifyToken, createBookingIntent);
paymentRoutes.post('/confirm-booking', verifyToken, confirmBooking);
paymentRoutes.get('/:email', verifyToken, getPaymentByEmail);

export default paymentRoutes;