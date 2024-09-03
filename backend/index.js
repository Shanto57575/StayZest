import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import placeRoutes from './routes/place.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import tripPlannerRoutes from './routes/gemini.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import https from 'https';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(compression());

// CORS configuration
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://stay-zest-view.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/trip', tripPlannerRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send({ message: "API IS WORKING FINE!" });
});

// Error handling middleware
app.use(errorHandler);
app.use(notFound);

function keepAlive() {
    const url = `https://stayzest-backend.onrender.com/health`;
    https.get(url, (res) => {
        if (res.statusCode === 200) {
            console.log('Server kept alive');
        } else {
            console.error(`Failed to keep server alive: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error('Error keeping server alive:', err.message);
    });
}

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
    connectDB();

    setInterval(keepAlive, 14 * 60 * 1000);
});