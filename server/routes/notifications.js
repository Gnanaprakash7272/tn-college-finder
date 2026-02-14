const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET /api/notifications - Get notifications
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// POST /api/notifications/subscribe - Subscribe to notifications
router.post('/subscribe', notificationController.subscribe);

// POST /api/notifications/unsubscribe - Unsubscribe from notifications
router.post('/unsubscribe', notificationController.unsubscribe);

module.exports = router;
