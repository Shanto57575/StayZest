import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    photos: [{
        type: String,
        required: true,
    }],
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    availability: [
        {
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            }
        }
    ],
    placeTypes: {
        type: String,
        required: true,
        enum: ["lakefront", "beachfront", "countryside", "cabins", "castles", "rooms", "camp", "caves"]
    },
    totalGuests: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Place = mongoose.model("Place", placeSchema);

export default Place;
