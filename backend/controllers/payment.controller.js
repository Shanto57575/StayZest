import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import Place from "../models/place.model.js";
import User from "../models/user.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getAllPayments = async (req, res) => {

    try {
        const payments = await stripe.paymentIntents.list({
            limit: 100,
        })

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving payments.' });
    }
}


const getPaymentByEmail = async (req, res) => {
    const { email } = req.params;
    console.log(`Searching for user with email: ${email}`);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const payments = await Payment.find({ user: user._id }).populate('booking')

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error retrieving payments by email:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving payments.' });
    }
};

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
        console.error(error);
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

            // Save payment information
            const payment = new Payment({
                user: userId,
                booking: booking._id,
                amount: total,
                status: 'completed',
                method: 'card',
            });

            await payment.save();

            res.status(200).json({ success: true, message: 'Booking confirmed' });
        } else {
            res.status(400).json({ error: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Error in confirmBooking:', error);
        res.status(500).json({ error: error.message });
    }
};


export {
    createBookingIntent,
    confirmBooking,
    getAllPayments,
    getPaymentByEmail
};
