import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import placeRoutes from './routes/place.routes.js';
import bookingRoutes from './routes/booking.routes.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/booking', bookingRoutes);


app.get('/', (req, res) => {
    res.send({ message: "API IS WORKING FINE!" })
})

// Error handling middleware
app.use(errorHandler);
app.use(notFound)

app.listen(PORT, () => {
    console.log(`App listening  to PORT : ${PORT}`)
    connectDB()
})