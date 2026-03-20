require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const adminRoutes = require('./routes/admin.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ─── Global Middleware ───
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalLimiter);

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Health Check ───
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Job Portal API is running', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Start Server ───
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
});

module.exports = app;
