const College = require('../models/College');
const Course = require('../models/Course');
const Cutoff = require('../models/Cutoff');
const Placement = require('../models/Placement');
const mongoose = require('mongoose');

// GET /api/colleges - Get all colleges with filters and pagination
exports.getColleges = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      district,
      type,
      nbaAccredited,
      nirfRanked,
      sortBy = 'collegeName',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (district) {
      query['address.district'] = new RegExp(district, 'i');
    }
    
    if (type) {
      query.collegeType = type;
    }
    
    if (nbaAccredited === 'true') {
      query['accreditation.nba.accredited'] = true;
    }
    
    if (nirfRanked === 'true') {
      query['rankings.nirf.engineeringRank'] = { $exists: true };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const colleges = await College.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('collegeName collegeCode tneaCode address district collegeType accreditation rankings establishmentYear');

    const total = await College.countDocuments(query);

    res.json({
      success: true,
      data: colleges,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getColleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges',
      error: error.message
    });
  }
};

// GET /api/colleges/top - Get top colleges by NIRF ranking
exports.getTopColleges = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const colleges = await College.findTopColleges(parseInt(limit))
      .select('collegeName collegeCode tneaCode address district collegeType rankings accreditation');

    res.json({
      success: true,
      data: colleges
    });
  } catch (error) {
    console.error('Error in getTopColleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top colleges',
      error: error.message
    });
  }
};

// GET /api/colleges/district/:district - Get colleges by district
exports.getCollegesByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const { type } = req.query;
    
    const colleges = await College.findByDistrictAndType(district, type)
      .select('collegeName collegeCode tneaCode address collegeType rankings');

    res.json({
      success: true,
      data: colleges,
      count: colleges.length
    });
  } catch (error) {
    console.error('Error in getCollegesByDistrict:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges by district',
      error: error.message
    });
  }
};

// GET /api/colleges/type/:type - Get colleges by type
exports.getCollegesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { district } = req.query;
    
    const colleges = await College.findByDistrictAndType(district, type)
      .select('collegeName collegeCode tneaCode address collegeType rankings');

    res.json({
      success: true,
      data: colleges,
      count: colleges.length
    });
  } catch (error) {
    console.error('Error in getCollegesByType:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges by type',
      error: error.message
    });
  }
};

// GET /api/colleges/search - Search colleges by name or code
exports.searchColleges = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const colleges = await College.find({
      isActive: true,
      $or: [
        { collegeName: new RegExp(q, 'i') },
        { collegeCode: new RegExp(q, 'i') },
        { tneaCode: new RegExp(q, 'i') }
      ]
    })
    .limit(parseInt(limit))
    .select('collegeName collegeCode tneaCode address district collegeType rankings');

    res.json({
      success: true,
      data: colleges,
      count: colleges.length
    });
  } catch (error) {
    console.error('Error in searchColleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching colleges',
      error: error.message
    });
  }
};

// GET /api/colleges/:id - Get college by ID
exports.getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const college = await College.findById(id)
      .populate('infrastructure.departments');

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      data: college
    });
  } catch (error) {
    console.error('Error in getCollegeById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college',
      error: error.message
    });
  }
};

// POST /api/colleges - Create new college
exports.createCollege = async (req, res) => {
  try {
    const collegeData = req.body;
    
    const college = new College(collegeData);
    await college.save();

    res.status(201).json({
      success: true,
      message: 'College created successfully',
      data: college
    });
  } catch (error) {
    console.error('Error in createCollege:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating college',
      error: error.message
    });
  }
};

// PUT /api/colleges/:id - Update college
exports.updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const college = await College.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      message: 'College updated successfully',
      data: college
    });
  } catch (error) {
    console.error('Error in updateCollege:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating college',
      error: error.message
    });
  }
};

// DELETE /api/colleges/:id - Delete college
exports.deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const college = await College.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      message: 'College deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCollege:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting college',
      error: error.message
    });
  }
};

// GET /api/colleges/:id/courses - Get all courses for a college
exports.getCollegeCourses = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const courses = await Course.findByCollege(id);

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error in getCollegeCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college courses',
      error: error.message
    });
  }
};

// GET /api/colleges/:id/cutoffs - Get cutoffs for a college
exports.getCollegeCutoffs = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, community, round } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const query = { collegeId: id };
    if (year) query.year = parseInt(year);
    if (community) query[`communityCutoffs.${community}`] = { $exists: true };
    if (round) query.round = round;

    const cutoffs = await Cutoff.find(query)
      .populate('courseId', 'courseName courseCode')
      .sort({ year: -1, round: 1 });

    res.json({
      success: true,
      data: cutoffs,
      count: cutoffs.length
    });
  } catch (error) {
    console.error('Error in getCollegeCutoffs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college cutoffs',
      error: error.message
    });
  }
};

// GET /api/colleges/:id/placements - Get placement data for a college
exports.getCollegePlacements = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const query = { collegeId: id };
    if (year) query.year = parseInt(year);

    const placements = await Placement.find(query)
      .populate('courseId', 'courseName courseCode')
      .sort({ year: -1 });

    res.json({
      success: true,
      data: placements,
      count: placements.length
    });
  } catch (error) {
    console.error('Error in getCollegePlacements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college placements',
      error: error.message
    });
  }
};

// GET /api/colleges/:id/statistics - Get comprehensive statistics for a college
exports.getCollegeStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Get courses count
    const coursesCount = await Course.countDocuments({ 
      collegeId: id, 
      isActive: true 
    });

    // Get latest cutoffs
    const latestCutoffs = await Cutoff.find({ 
      collegeId: id,
      year: new Date().getFullYear() - 1 
    }).populate('courseId', 'courseName courseCode');

    // Get latest placements
    const latestPlacements = await Placement.find({ 
      collegeId: id,
      year: new Date().getFullYear() - 1 
    }).populate('courseId', 'courseName courseCode');

    const statistics = {
      college: {
        name: college.collegeName,
        type: college.collegeType,
        district: college.address.district,
        establishmentYear: college.establishmentYear,
        age: college.age,
        studentFacultyRatio: college.studentFacultyRatio
      },
      academics: {
        totalCourses: coursesCount,
        nbaAccreditedCourses: college.accreditation.nba.courses.length,
        naacGrade: college.accreditation.naac.grade,
        nirfRank: college.getNIRFDisplay()
      },
      cutoffs: {
        totalCoursesWithCutoffs: latestCutoffs.length,
        averageCutoffs: latestCutoffs.map(cutoff => ({
          course: cutoff.courseId.courseName,
          oc: cutoff.communityCutoffs.oc?.average,
          bc: cutoff.communityCutoffs.bc?.average,
          sc: cutoff.communityCutoffs.sc?.average
        }))
      },
      placements: {
        totalCoursesWithPlacements: latestPlacements.length,
        averagePlacementPercentage: latestPlacements.reduce((sum, p) => 
          sum + (p.placementStatistics?.placementPercentage || 0), 0) / latestPlacements.length || 0,
        highestPackage: Math.max(...latestPlacements.map(p => p.salaryStatistics?.highest || 0)),
        averagePackage: latestPlacements.reduce((sum, p) => 
          sum + (p.salaryStatistics?.average || 0), 0) / latestPlacements.length || 0
      }
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error in getCollegeStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college statistics',
      error: error.message
    });
  }
};
