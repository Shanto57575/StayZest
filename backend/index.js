import cors from 'cors';
import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import placeRoutes from './routes/place.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import tripPlannerRoutes from './routes/gemini.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/trip', tripPlannerRoutes);

app.get('/', (req, res) => {
    res.send({ message: "API IS WORKING FINE!" })
})

app.use(errorHandler);
app.use(notFound)

app.listen(PORT, () => {
    console.log(`App listening  to PORT : ${PORT}`)
    connectDB()
})