import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionString = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected! Host: ${connectionString.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
