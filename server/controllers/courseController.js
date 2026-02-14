const Course = require('../models/Course');
const College = require('../models/College');
const mongoose = require('mongoose');

// GET /api/courses - Get all courses with filters
exports.getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      collegeId,
      courseCode,
      nbaAccredited,
      sortBy = 'courseName',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (collegeId) {
      query.collegeId = collegeId;
    }
    
    if (courseCode) {
      query.courseCode = new RegExp(courseCode, 'i');
    }
    
    if (nbaAccredited === 'true') {
      query['accreditation.nba.accredited'] = true;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const courses = await Course.find(query)
      .populate('collegeId', 'collegeName collegeType address.district rankings')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// GET /api/courses/college/:collegeId - Get courses by college
exports.getCoursesByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const courses = await Course.findByCollege(collegeId);

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error in getCoursesByCollege:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college courses',
      error: error.message
    });
  }
};

// GET /api/courses/code/:courseCode - Get courses by course code
exports.getCoursesByCode = async (req, res) => {
  try {
    const { courseCode } = req.params;
    
    const courses = await Course.findByCourseCode(courseCode);

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error in getCoursesByCode:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses by code',
      error: error.message
    });
  }
};

// GET /api/courses/fee-range - Get courses by fee range
exports.getCoursesByFeeRange = async (req, res) => {
  try {
    const { minFee, maxFee, category = 'government' } = req.query;
    
    if (!minFee || !maxFee) {
      return res.status(400).json({
        success: false,
        message: 'minFee and maxFee are required'
      });
    }

    const courses = await Course.findByFeeRange(
      parseFloat(minFee),
      parseFloat(maxFee),
      category
    );

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error in getCoursesByFeeRange:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses by fee range',
      error: error.message
    });
  }
};

// GET /api/courses/nba-accredited - Get NBA accredited courses
exports.getNBAAccreditedCourses = async (req, res) => {
  try {
    const courses = await Course.findNBAAccredited();

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error in getNBAAccreditedCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NBA accredited courses',
      error: error.message
    });
  }
};

// GET /api/courses/:id - Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const course = await Course.findById(id)
      .populate('collegeId', 'collegeName collegeType address district rankings');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error in getCourseById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// POST /api/courses - Create new course
exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    
    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error in createCourse:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// PUT /api/courses/:id - Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Error in updateCourse:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// DELETE /api/courses/:id - Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};
