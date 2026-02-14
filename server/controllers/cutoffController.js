const Cutoff = require('../models/Cutoff');
const Course = require('../models/Course');
const College = require('../models/College');
const mongoose = require('mongoose');

// GET /api/cutoffs - Get all cutoffs with filters
exports.getCutoffs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      collegeId,
      courseId,
      year,
      community,
      round,
      isPredicted
    } = req.query;

    // Build query
    const query = {};
    
    if (collegeId) query.collegeId = collegeId;
    if (courseId) query.courseId = courseId;
    if (year) query.year = parseInt(year);
    if (round) query.round = round;
    if (isPredicted !== undefined) query.isPredicted = isPredicted === 'true';
    
    if (community) {
      query[`communityCutoffs.${community.toLowerCase()}`] = { $exists: true };
    }

    // Execute query with pagination
    const cutoffs = await Cutoff.find(query)
      .populate('collegeId', 'collegeName collegeType address.district')
      .populate('courseId', 'courseName courseCode')
      .sort({ year: -1, round: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Cutoff.countDocuments(query);

    res.json({
      success: true,
      data: cutoffs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getCutoffs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cutoffs',
      error: error.message
    });
  }
};

// GET /api/cutoffs/latest - Get latest cutoff for college and course
exports.getLatestCutoff = async (req, res) => {
  try {
    const { collegeId, courseId, community = 'oc' } = req.query;
    
    if (!collegeId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'collegeId and courseId are required'
      });
    }

    const cutoff = await Cutoff.findOne({
      collegeId,
      courseId,
      isPredicted: false
    })
    .sort({ year: -1, round: 1 })
    .populate('collegeId', 'collegeName')
    .populate('courseId', 'courseName courseCode');

    res.json({
      success: true,
      data: cutoff
    });
  } catch (error) {
    console.error('Error in getLatestCutoff:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest cutoff',
      error: error.message
    });
  }
};

// GET /api/cutoffs/year-community - Get cutoffs by year and community
exports.getCutoffsByYearAndCommunity = async (req, res) => {
  try {
    const { year, community, limit = 50 } = req.query;
    
    if (!year || !community) {
      return res.status(400).json({
        success: false,
        message: 'year and community are required'
      });
    }

    const cutoffs = await Cutoff.find({
      year: parseInt(year),
      [`communityCutoffs.${community.toLowerCase()}`]: { $exists: true },
      isPredicted: false
    })
    .populate('collegeId', 'collegeName collegeType address.district')
    .populate('courseId', 'courseName courseCode')
    .sort({ [`communityCutoffs.${community.toLowerCase()}.closing`]: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: cutoffs,
      count: cutoffs.length
    });
  } catch (error) {
    console.error('Error in getCutoffsByYearAndCommunity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cutoffs by year and community',
      error: error.message
    });
  }
};

// GET /api/cutoffs/historical - Get historical cutoffs for prediction
exports.getHistoricalCutoffs = async (req, res) => {
  try {
    const { collegeId, courseId, years = 5 } = req.query;
    
    if (!collegeId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'collegeId and courseId are required'
      });
    }

    const startYear = new Date().getFullYear() - parseInt(years);
    
    const cutoffs = await Cutoff.find({
      collegeId,
      courseId,
      year: { $gte: startYear },
      isPredicted: false
    })
    .sort({ year: 1, round: 1 });

    res.json({
      success: true,
      data: cutoffs,
      count: cutoffs.length
    });
  } catch (error) {
    console.error('Error in getHistoricalCutoffs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching historical cutoffs',
      error: error.message
    });
  }
};

// GET /api/cutoffs/trends - Get cutoff trends
exports.getCutoffTrends = async (req, res) => {
  try {
    const { collegeId, courseId, community = 'oc' } = req.query;
    
    if (!collegeId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'collegeId and courseId are required'
      });
    }

    const trends = await Cutoff.getCutoffTrends(collegeId, courseId, community.toLowerCase());

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error in getCutoffTrends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cutoff trends',
      error: error.message
    });
  }
};

// GET /api/cutoffs/within-range - Find colleges within cutoff range
exports.findCollegesWithinCutoff = async (req, res) => {
  try {
    const { mark, community = 'oc', year } = req.query;
    
    if (!mark) {
      return res.status(400).json({
        success: false,
        message: 'mark is required'
      });
    }

    const cutoffs = await Cutoff.findCollegesWithinCutoff(
      parseFloat(mark),
      community.toLowerCase(),
      year ? parseInt(year) : new Date().getFullYear() - 1
    );

    res.json({
      success: true,
      data: cutoffs,
      count: cutoffs.length
    });
  } catch (error) {
    console.error('Error in findCollegesWithinCutoff:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding colleges within cutoff range',
      error: error.message
    });
  }
};

// GET /api/cutoffs/:id - Get cutoff by ID
exports.getCutoffById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cutoff ID'
      });
    }

    const cutoff = await Cutoff.findById(id)
      .populate('collegeId', 'collegeName collegeType address.district')
      .populate('courseId', 'courseName courseCode');

    if (!cutoff) {
      return res.status(404).json({
        success: false,
        message: 'Cutoff not found'
      });
    }

    res.json({
      success: true,
      data: cutoff
    });
  } catch (error) {
    console.error('Error in getCutoffById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cutoff',
      error: error.message
    });
  }
};

// POST /api/cutoffs - Create new cutoff
exports.createCutoff = async (req, res) => {
  try {
    const cutoffData = req.body;
    
    const cutoff = new Cutoff(cutoffData);
    await cutoff.save();

    res.status(201).json({
      success: true,
      message: 'Cutoff created successfully',
      data: cutoff
    });
  } catch (error) {
    console.error('Error in createCutoff:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating cutoff',
      error: error.message
    });
  }
};

// PUT /api/cutoffs/:id - Update cutoff
exports.updateCutoff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cutoff ID'
      });
    }

    const cutoff = await Cutoff.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!cutoff) {
      return res.status(404).json({
        success: false,
        message: 'Cutoff not found'
      });
    }

    res.json({
      success: true,
      message: 'Cutoff updated successfully',
      data: cutoff
    });
  } catch (error) {
    console.error('Error in updateCutoff:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating cutoff',
      error: error.message
    });
  }
};

// DELETE /api/cutoffs/:id - Delete cutoff
exports.deleteCutoff = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cutoff ID'
      });
    }

    const cutoff = await Cutoff.findByIdAndDelete(id);

    if (!cutoff) {
      return res.status(404).json({
        success: false,
        message: 'Cutoff not found'
      });
    }

    res.json({
      success: true,
      message: 'Cutoff deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCutoff:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting cutoff',
      error: error.message
    });
  }
};
