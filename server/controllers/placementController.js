const Placement = require('../models/Placement');
const College = require('../models/College');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// GET /api/placements - Get placements with filters
exports.getPlacements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      collegeId,
      courseId,
      year,
      minPlacementPercentage,
      minPackage
    } = req.query;

    // Build query
    const query = {};
    
    if (collegeId) query.collegeId = collegeId;
    if (courseId) query.courseId = courseId;
    if (year) query.year = parseInt(year);
    
    if (minPlacementPercentage) {
      query['placementStatistics.placementPercentage'] = { $gte: parseFloat(minPlacementPercentage) };
    }
    
    if (minPackage) {
      query['salaryStatistics.average'] = { $gte: parseFloat(minPackage) };
    }

    // Execute query with pagination
    const placements = await Placement.find(query)
      .populate('collegeId', 'collegeName collegeType address.district')
      .populate('courseId', 'courseName courseCode')
      .sort({ year: -1, 'placementStatistics.placementPercentage': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Placement.countDocuments(query);

    res.json({
      success: true,
      data: placements,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getPlacements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placements',
      error: error.message
    });
  }
};

// GET /api/placements/college/:collegeId - Get placements by college
exports.getPlacementsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { year } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const query = { collegeId };
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
    console.error('Error in getPlacementsByCollege:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college placements',
      error: error.message
    });
  }
};

// GET /api/placements/course/:courseId - Get placements by course
exports.getPlacementsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { year } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const query = { courseId };
    if (year) query.year = parseInt(year);

    const placements = await Placement.find(query)
      .populate('collegeId', 'collegeName collegeType address.district')
      .sort({ year: -1 });

    res.json({
      success: true,
      data: placements,
      count: placements.length
    });
  } catch (error) {
    console.error('Error in getPlacementsByCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course placements',
      error: error.message
    });
  }
};

// GET /api/placements/statistics - Get placement statistics
exports.getPlacementStatistics = async (req, res) => {
  try {
    const { year, district, collegeType } = req.query;
    
    let matchStage = {};
    if (year) matchStage.year = parseInt(year);
    
    let pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: '$placementStatistics.totalStudents' },
          totalPlaced: { $sum: '$placementStatistics.placedStudents' },
          averagePlacementPercentage: { $avg: '$placementStatistics.placementPercentage' },
          averageHighestPackage: { $avg: '$salaryStatistics.highest' },
          averagePackage: { $avg: '$salaryStatistics.average' },
          medianPackage: { $avg: '$salaryStatistics.median' },
          totalCompanies: { $sum: '$companyStatistics.totalCompanies' },
          uniqueColleges: { $addToSet: '$collegeId' },
          uniqueCourses: { $addToSet: '$courseId' }
        }
      },
      {
        $project: {
          totalStudents: 1,
          totalPlaced: 1,
          averagePlacementPercentage: { $round: ['$averagePlacementPercentage', 2] },
          averageHighestPackage: { $round: ['$averageHighestPackage', 2] },
          averagePackage: { $round: ['$averagePackage', 2] },
          medianPackage: { $round: ['$medianPackage', 2] },
          totalCompanies: 1,
          totalColleges: { $size: '$uniqueColleges' },
          totalCourses: { $size: '$uniqueCourses' }
        }
      }
    ];

    // If district or collegeType filter is needed, we need to join with colleges
    if (district || collegeType) {
      pipeline.unshift({
        $lookup: {
          from: 'colleges',
          localField: 'collegeId',
          foreignField: '_id',
          as: 'collegeInfo'
        }
      });
      
      pipeline.unshift({
        $unwind: '$collegeInfo'
      });
      
      if (district) {
        matchStage['collegeInfo.address.district'] = district;
      }
      
      if (collegeType) {
        matchStage['collegeInfo.collegeType'] = collegeType;
      }
    }

    const statistics = await Placement.aggregate(pipeline);

    res.json({
      success: true,
      data: statistics[0] || {
        totalStudents: 0,
        totalPlaced: 0,
        averagePlacementPercentage: 0,
        averageHighestPackage: 0,
        averagePackage: 0,
        medianPackage: 0,
        totalCompanies: 0,
        totalColleges: 0,
        totalCourses: 0
      }
    });
  } catch (error) {
    console.error('Error in getPlacementStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placement statistics',
      error: error.message
    });
  }
};

// GET /api/placements/:id - Get placement by ID
exports.getPlacementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placement ID'
      });
    }

    const placement = await Placement.findById(id)
      .populate('collegeId', 'collegeName collegeType address.district')
      .populate('courseId', 'courseName courseCode');

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    res.json({
      success: true,
      data: placement
    });
  } catch (error) {
    console.error('Error in getPlacementById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placement',
      error: error.message
    });
  }
};

// POST /api/placements - Create placement
exports.createPlacement = async (req, res) => {
  try {
    const placementData = req.body;
    
    const placement = new Placement(placementData);
    await placement.save();

    res.status(201).json({
      success: true,
      message: 'Placement data created successfully',
      data: placement
    });
  } catch (error) {
    console.error('Error in createPlacement:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating placement data',
      error: error.message
    });
  }
};

// PUT /api/placements/:id - Update placement
exports.updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placement ID'
      });
    }

    const placement = await Placement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    res.json({
      success: true,
      message: 'Placement data updated successfully',
      data: placement
    });
  } catch (error) {
    console.error('Error in updatePlacement:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating placement data',
      error: error.message
    });
  }
};

// DELETE /api/placements/:id - Delete placement
exports.deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placement ID'
      });
    }

    const placement = await Placement.findByIdAndDelete(id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    res.json({
      success: true,
      message: 'Placement data deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePlacement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting placement data',
      error: error.message
    });
  }
};
