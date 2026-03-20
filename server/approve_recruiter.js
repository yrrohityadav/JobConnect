require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');
const Recruiter = require('./models/Recruiter.model');

async function approveAll() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Approve the User accounts
        const userResult = await User.updateMany(
            { role: 'recruiter', isApproved: false },
            { isApproved: true }
        );
        
        // 2. Verify the Recruiter profiles
        const recruiterResult = await Recruiter.updateMany(
            { isVerified: false },
            { isVerified: true }
        );
        
        console.log(`Successfully approved ${userResult.modifiedCount} user(s) and verified ${recruiterResult.modifiedCount} recruiter profile(s)!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

approveAll();
