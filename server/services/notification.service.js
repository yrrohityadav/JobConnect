const Notification = require('../models/Notification.model');

// Store io reference globally
let io = null;

const setIO = (socketIO) => {
    io = socketIO;
};

/**
 * Create a notification and optionally emit via Socket.io
 */
const createNotification = async ({ recipient, type, title, message, link }) => {
    try {
        const notification = await Notification.create({
            recipient,
            type,
            title,
            message,
            link: link || '',
        });

        // Emit real-time notification if socket.io is available
        if (io) {
            io.to(`user_${recipient.toString()}`).emit('notification', {
                _id: notification._id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                link: notification.link,
                isRead: false,
                createdAt: notification.createdAt,
            });
        }

        return notification;
    } catch (error) {
        console.error('Notification creation error:', error.message);
    }
};

module.exports = { createNotification, setIO };
