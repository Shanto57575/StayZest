import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema({
    place: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Place'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELED'],
        default: 'PENDING'
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
