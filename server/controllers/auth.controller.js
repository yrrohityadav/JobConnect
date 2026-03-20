const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Student = require('../models/Student.model');
const Recruiter = require('../models/Recruiter.model');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');

// Generate tokens
const generateAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, companyName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered.',
            });
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            isApproved: role === 'recruiter' ? false : true,
            verificationToken,
        });

        // Create role-specific profile
        if (role === 'recruiter') {
            await Recruiter.create({
                user: user._id,
                company: { name: companyName || 'My Company' },
            });
        } else {
            await Student.create({
                user: user._id,
            });
        }

        // Send verification email (non-blocking)
        sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            success: true,
            message: role === 'recruiter'
                ? 'Registration successful. Please verify your email. Your account will be reviewed by an admin.'
                : 'Registration successful. Please verify your email.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        if (!user.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending admin approval.',
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            message: 'Login successful.',
            data: {
                accessToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = async (req, res, next) => {
    try {
        // Clear refresh token from DB
        await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

        // Clear cookie
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Logged out successfully.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId).select('+refreshToken');

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token.',
            });
        }

        // Generate new tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            data: { accessToken },
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired. Please login again.',
            });
        }
        next(error);
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token }).select('+verificationToken');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token.',
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({
            success: true,
            message: 'Email verified successfully.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password — send OTP
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists
            return res.json({
                success: true,
                message: 'If this email exists, an OTP has been sent.',
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOTP = otp;
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save({ validateBeforeSave: false });

        sendPasswordResetEmail(email, otp);

        res.json({
            success: true,
            message: 'If this email exists, an OTP has been sent.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordExpiry');
        if (!user || user.resetPasswordOTP !== otp || user.resetPasswordExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP.',
            });
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const user = req.user;
        let profile = null;

        if (user.role === 'student') {
            profile = await Student.findOne({ user: user._id });
        } else if (user.role === 'recruiter') {
            profile = await Recruiter.findOne({ user: user._id });
        }

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    isApproved: user.isApproved,
                },
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
};
