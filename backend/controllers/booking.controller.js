import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

const createBooking = async (req, res) => {
    const { place, user, checkIn, checkOut, email, price, guests } = req.body;

    if (!place || !user || !checkIn || !checkOut || !email || !price || !guests) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newBooking = new Booking({ place, user, checkIn, checkOut, email, price, guests });
        await newBooking.save();

        res.status(200).json(newBooking);
    } catch (error) {
        console.error(`Error creating booking: ${error.message}`);
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
    const email = req.query.email

    if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bookings = await Booking.find({ user: user._id }).populate('place', "title location price").populate('user', "username email");

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
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingByEmail,
    updateBooking,
    cancelBooking,
};
