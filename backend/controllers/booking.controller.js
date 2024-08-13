import Booking from "../models/booking.model.js";
import Place from "../models/place.model.js";
import User from "../models/user.model.js";
import Stripe from 'stripe';

import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createBookingIntent = async (req, res) => {
    try {
        const {
            placeId,
            userId,
            checkIn,
            checkOut,
            totalGuests,
            total
        } = req.body;

        const user = await User.findById(userId);
        const place = await Place.findById(placeId);

        if (!place || !user) {
            return res.status(404).json({ error: 'Place or User not found' });
        }

        const imageUrl = place.photos && place.photos.length > 0 ? place.photos[0] : null;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout-cancel`,
            customer_email: user.email,
            client_reference_id: placeId,
            metadata: {
                userId,
                placeId,
                checkIn,
                checkOut,
                totalGuests,
                total
            },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: total * 100,
                        product_data: {
                            name: place.location,
                            description: place.description,
                            images: imageUrl ? [imageUrl] : []
                        }
                    },
                    quantity: 1
                }
            ]
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const {
                userId,
                placeId,
                checkIn,
                checkOut,
                totalGuests,
                total
            } = session.metadata;


            const booking = new Booking({
                user: userId,
                place: placeId,
                checkIn,
                checkOut,
                guests: totalGuests,
                price: total,
                email: session.customer_email,
                session: sessionId,
                imageUrl: session.line_items?.data[0]?.price?.product?.images?.[0],
                location: session.line_items?.data[0]?.price?.product?.name
            });

            await booking.save();

            res.status(200).json({ success: true, message: 'Booking confirmed' });
        } else {
            res.status(400).json({ error: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Error in confirmBooking:', error);
        res.status(500).json({ error: error.message });
    }
};
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('place', "title location price photos")
            .populate('user', "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error(`Error fetching bookings: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const getBookingById = async (req, res) => {
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findById(bookingId).populate('place', "title location price").populate('user', "username email")

        if (!booking) {
            return res.status(404).json({ error: 'Booking Not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error(`Error fetching booking: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const getBookingByEmail = async (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bookings = await Booking.find({ user: user._id })
            .populate('place', "title location price photos")
            .populate('user', "username email")
            .sort({ createdAt: -1 })

        res.status(200).json(bookings);
    } catch (error) {
        console.error(`Error fetching bookings: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const { status } = req.body;

    try {
        const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        console.error(`Error updating booking: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const cancelBooking = async (req, res) => {
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findByIdAndDelete(bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(`Error deleting booking: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export {
    createBookingIntent,
    confirmBooking,
    getAllBookings,
    getBookingById,
    getBookingByEmail,
    updateBooking,
    cancelBooking,
};
