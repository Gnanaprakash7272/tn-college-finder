const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const collegeRoutes = require('./routes/colleges');
const courseRoutes = require('./routes/courses');
const cutoffRoutes = require('./routes/cutoffs');
const placementRoutes = require('./routes/placements');
const searchRoutes = require('./routes/search');
const comparisonRoutes = require('./routes/comparison');
const notificationRoutes = require('./routes/notifications');
const predictionRoutes = require('./routes/predictions');
const districtRoutes = require('./routes/districts');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://collegefinder.tn', 'https://www.collegefinder.tn']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/cutoffs', cutoffRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/districts', districtRoutes);

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'College Finder Tamil Nadu API',
    version: '1.0.0',
    description: 'API for finding engineering colleges in Tamil Nadu',
    endpoints: {
      colleges: '/api/colleges',
      courses: '/api/courses',
      cutoffs: '/api/cutoffs',
      placements: '/api/placements',
      search: '/api/search',
      comparison: '/api/comparison',
      notifications: '/api/notifications',
      predictions: '/api/predictions',
      districts: '/api/districts'
    },
    documentation: '/api/docs',
    health: '/health'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_finder_tn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB database');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 College Finder API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;
