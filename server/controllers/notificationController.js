const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// GET /api/notifications - Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      priority,
      unreadOnly = false
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (type) {
      query.type = type;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (unreadOnly === 'true') {
      query.read = false;
    }

    // Execute query with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// PUT /api/notifications/:id/read - Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// POST /api/notifications/subscribe - Subscribe to notifications
exports.subscribe = async (req, res) => {
  try {
    const { email, phone, preferences = {} } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required'
      });
    }

    // Here you would typically save the subscription to a database
    // For now, we'll just return a success response
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to notifications'
    });
  } catch (error) {
    console.error('Error in subscribe:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to notifications',
      error: error.message
    });
  }
};

// POST /api/notifications/unsubscribe - Unsubscribe from notifications
exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required'
      });
    }

    // Here you would typically remove the subscription from database
    // For now, we'll just return a success response
    
    res.json({
      success: true,
      message: 'Successfully unsubscribed from notifications'
    });
  } catch (error) {
    console.error('Error in unsubscribe:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing from notifications',
      error: error.message
    });
  }
};
