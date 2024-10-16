// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const mongoURI = "mongodb://localhost:27017/mernTodo";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

export default connectToMongo
