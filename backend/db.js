import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('⚠️ MONGODB_URI is not defined in .env! Database connection skipped.');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB Connected Successfully!');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Do not process.exit(1); keep the server alive
    }
};

export default connectDB;
