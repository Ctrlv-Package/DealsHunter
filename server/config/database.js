const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deals_db';
        console.log('Attempting to connect to MongoDB at:', mongoURI);
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Increased timeout
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Connection state:', mongoose.connection.readyState);
        
        // Test the connection by trying to list databases
        const admin = conn.connection.db.admin();
        const listDatabases = await admin.listDatabases();
        console.log('Available databases:', listDatabases.databases.map(db => db.name));
        
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            codeName: error.codeName
        });
        throw error;
    }
};

module.exports = connectDB;
