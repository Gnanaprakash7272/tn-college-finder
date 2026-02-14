const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['counselling', 'cutoff', 'college', 'general'],
    index: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    index: true
  },
  targetAudience: [{
    type: String,
    enum: ['all', 'oc', 'bc', 'bcm', 'mbc', 'sc', 'sca', 'st']
  }],
  validFrom: {
    type: Date,
    default: Date.now,
    index: true
  },
  validUntil: {
    type: Date,
    index: true
  },
  actionUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  sentVia: {
    email: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
notificationSchema.index({ validFrom: 1, validUntil: 1 });
notificationSchema.index({ type: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ targetAudience: 1, isActive: 1 });

// Virtual for notification status
notificationSchema.virtual('status').get(function() {
  const now = new Date();
  if (!this.isActive) return 'inactive';
  if (this.validUntil && now > this.validUntil) return 'expired';
  if (this.validFrom && now < this.validFrom) return 'scheduled';
  if (this.read) return 'read';
  return 'active';
});

// Static method to get active notifications
notificationSchema.statics.getActiveNotifications = function(targetAudience = 'all') {
  const now = new Date();
  const query = {
    isActive: true,
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gt: now } }
    ],
    $or: [
      { validFrom: { $exists: false } },
      { validFrom: { $lte: now } }
    ],
    $or: [
      { targetAudience: 'all' },
      { targetAudience: targetAudience }
    ]
  };
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 });
};

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  // Set validUntil if not provided (default to 30 days from validFrom)
  if (this.validFrom && !this.validUntil) {
    this.validUntil = new Date(this.validFrom.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
  }
  
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
