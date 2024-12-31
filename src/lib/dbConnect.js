import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            // If already connected, return
            return;
        }

        await mongoose.connect(MONGODB_URI, {
            dbName: 'next-js-test',
            bufferCommands: false,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
