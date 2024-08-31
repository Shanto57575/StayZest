import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        minlength: 6,
        required: function () {
            return !this.googleId;
        },
    },
    profilePicture: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
    },
    role: {
        type: String,
        enum: ["ADMIN", "GUEST"],
        default: "GUEST",
    },
    bookingsCount: {
        type: Number,
        default: 0
    },
    googleId: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;