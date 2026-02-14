const College = require('../models/College');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// GET /api/search - Global search
exports.globalSearch = async (req, res) => {
  try {
    const { q, type, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    let results = [];

    // Search colleges
    if (type === 'all' || type === 'colleges') {
      const colleges = await College.find({
        isActive: true,
        $or: [
          { collegeName: searchRegex },
          { collegeCode: searchRegex },
          { tneaCode: searchRegex },
          { 'address.district': searchRegex },
          { 'address.city': searchRegex }
        ]
      })
      .select('collegeName collegeCode tneaCode address district collegeType rankings')
      .limit(parseInt(limit));

      results = results.concat(colleges.map(college => ({
        ...college.toObject(),
        type: 'college'
      })));
    }

    // Search courses
    if (type === 'all' || type === 'courses') {
      const courses = await Course.find({
        isActive: true,
        $or: [
          { courseName: searchRegex },
          { courseCode: searchRegex },
          { branchCode: searchRegex }
        ]
      })
      .populate('collegeId', 'collegeName collegeType address.district')
      .limit(parseInt(limit));

      results = results.concat(courses.map(course => ({
        ...course.toObject(),
        type: 'course'
      })));
    }

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error in globalSearch:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
};

// GET /api/search/autocomplete - Autocomplete suggestions
exports.getAutocompleteSuggestions = async (req, res) => {
  try {
    const { q, type = 'all', limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchRegex = new RegExp(q, 'i');
    let suggestions = [];

    // College suggestions
    if (type === 'all' || type === 'colleges') {
      const colleges = await College.find({
        isActive: true,
        $or: [
          { collegeName: searchRegex },
          { collegeCode: searchRegex }
        ]
      })
      .select('collegeName collegeCode')
      .limit(parseInt(limit));

      suggestions = suggestions.concat(colleges.map(college => ({
        text: college.collegeName,
        type: 'college',
        code: college.collegeCode
      })));
    }

    // Course suggestions
    if (type === 'all' || type === 'courses') {
      const courses = await Course.find({
        isActive: true,
        $or: [
          { courseName: searchRegex },
          { courseCode: searchRegex }
        ]
      })
      .select('courseName courseCode')
      .limit(parseInt(limit));

      suggestions = suggestions.concat(courses.map(course => ({
        text: course.courseName,
        type: 'course',
        code: course.courseCode
      })));
    }

    res.json({
      success: true,
      data: suggestions.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error in getAutocompleteSuggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions',
      error: error.message
    });
  }
};

// POST /api/search/advanced - Advanced search
exports.advancedSearch = async (req, res) => {
  try {
    const {
      query,
      filters = {},
      type = 'all',
      limit = 20,
      page = 1
    } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(query, 'i');
    let results = [];

    // Advanced college search
    if (type === 'all' || type === 'colleges') {
      const collegeQuery = {
        isActive: true,
        $or: [
          { collegeName: searchRegex },
          { collegeCode: searchRegex },
          { tneaCode: searchRegex }
        ]
      };

      // Apply filters
      if (filters.district) {
        collegeQuery['address.district'] = filters.district;
      }
      if (filters.collegeType) {
        collegeQuery.collegeType = filters.collegeType;
      }
      if (filters.nbaAccredited) {
        collegeQuery['accreditation.nba.accredited'] = true;
      }
      if (filters.nirfRanked) {
        collegeQuery['rankings.nirf.engineeringRank'] = { $exists: true };
      }

      const colleges = await College.find(collegeQuery)
        .select('collegeName collegeCode tneaCode address district collegeType rankings accreditation')
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

      results = results.concat(colleges.map(college => ({
        ...college.toObject(),
        type: 'college'
      })));
    }

    // Advanced course search
    if (type === 'all' || type === 'courses') {
      const courseQuery = {
        isActive: true,
        $or: [
          { courseName: searchRegex },
          { courseCode: searchRegex }
        ]
      };

      // Apply filters
      if (filters.minFee || filters.maxFee) {
        courseQuery['fees.totalAnnual.government'] = {};
        if (filters.minFee) {
          courseQuery['fees.totalAnnual.government'].$gte = parseFloat(filters.minFee);
        }
        if (filters.maxFee) {
          courseQuery['fees.totalAnnual.government'].$lte = parseFloat(filters.maxFee);
        }
      }
      if (filters.nbaAccredited) {
        courseQuery['accreditation.nba.accredited'] = true;
      }

      const courses = await Course.find(courseQuery)
        .populate('collegeId', 'collegeName collegeType address.district')
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

      results = results.concat(courses.map(course => ({
        ...course.toObject(),
        type: 'course'
      })));
    }

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error in advancedSearch:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing advanced search',
      error: error.message
    });
  }
};
