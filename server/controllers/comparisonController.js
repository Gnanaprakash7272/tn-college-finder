const College = require('../models/College');
const Course = require('../models/Course');
const Cutoff = require('../models/Cutoff');
const Placement = require('../models/Placement');
const mongoose = require('mongoose');

// POST /api/comparison/colleges - Compare colleges
exports.compareColleges = async (req, res) => {
  try {
    const { collegeIds } = req.body;
    
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 college IDs are required for comparison'
      });
    }

    if (collegeIds.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 3 colleges can be compared at a time'
      });
    }

    // Validate ObjectIds
    const validIds = collegeIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!validIds) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college IDs'
      });
    }

    // Fetch colleges
    const colleges = await College.find({
      _id: { $in: collegeIds },
      isActive: true
    })
    .select('collegeName collegeCode tneaCode address district collegeType establishmentYear accreditation rankings infrastructure');

    // Fetch courses for each college
    const collegeIdsMap = new Map(colleges.map(c => [c._id.toString(), c]));
    const courses = await Course.find({
      collegeId: { $in: collegeIds },
      isActive: true
    })
    .populate('collegeId', 'collegeName')
    .select('courseName courseCode intake fees accreditation');

    // Group courses by college
    const coursesByCollege = {};
    courses.forEach(course => {
      const collegeId = course.collegeId._id.toString();
      if (!coursesByCollege[collegeId]) {
        coursesByCollege[collegeId] = [];
      }
      coursesByCollege[collegeId].push(course);
    });

    // Fetch latest cutoffs for each college
    const cutoffs = await Cutoff.find({
      collegeId: { $in: collegeIds },
      year: new Date().getFullYear() - 1,
      isPredicted: false
    })
    .populate('collegeId', 'collegeName')
    .populate('courseId', 'courseName courseCode')
    .sort({ year: -1, round: 1 });

    const cutoffsByCollege = {};
    cutoffs.forEach(cutoff => {
      const collegeId = cutoff.collegeId._id.toString();
      if (!cutoffsByCollege[collegeId]) {
        cutoffsByCollege[collegeId] = [];
      }
      cutoffsByCollege[collegeId].push(cutoff);
    });

    // Fetch latest placements for each college
    const placements = await Placement.find({
      collegeId: { $in: collegeIds },
      year: new Date().getFullYear() - 1
    })
    .populate('collegeId', 'collegeName')
    .populate('courseId', 'courseName courseCode')
    .sort({ year: -1 });

    const placementsByCollege = {};
    placements.forEach(placement => {
      const collegeId = placement.collegeId._id.toString();
      if (!placementsByCollege[collegeId]) {
        placementsByCollege[collegeId] = [];
      }
      placementsByCollege[collegeId].push(placement);
    });

    // Build comparison data
    const comparisonData = colleges.map(college => {
      const collegeId = college._id.toString();
      return {
        college: college.toObject(),
        courses: coursesByCollege[collegeId] || [],
        cutoffs: cutoffsByCollege[collegeId] || [],
        placements: placementsByCollege[collegeId] || []
      };
    });

    res.json({
      success: true,
      data: comparisonData
    });
  } catch (error) {
    console.error('Error in compareColleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing colleges',
      error: error.message
    });
  }
};

// POST /api/comparison/courses - Compare courses
exports.compareCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;
    
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 course IDs are required for comparison'
      });
    }

    if (courseIds.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 3 courses can be compared at a time'
      });
    }

    // Validate ObjectIds
    const validIds = courseIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!validIds) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course IDs'
      });
    }

    // Fetch courses with college details
    const courses = await Course.find({
      _id: { $in: courseIds },
      isActive: true
    })
    .populate('collegeId', 'collegeName collegeType address district rankings');

    // Fetch cutoffs for each course
    const cutoffs = await Cutoff.find({
      courseId: { $in: courseIds },
      year: new Date().getFullYear() - 1,
      isPredicted: false
    })
    .populate('collegeId', 'collegeName')
    .populate('courseId', 'courseName courseCode')
    .sort({ year: -1, round: 1 });

    const cutoffsByCourse = {};
    cutoffs.forEach(cutoff => {
      const courseId = cutoff.courseId._id.toString();
      if (!cutoffsByCourse[courseId]) {
        cutoffsByCourse[courseId] = [];
      }
      cutoffsByCourse[courseId].push(cutoff);
    });

    // Fetch placements for each course
    const placements = await Placement.find({
      courseId: { $in: courseIds },
      year: new Date().getFullYear() - 1
    })
    .populate('collegeId', 'collegeName')
    .populate('courseId', 'courseName courseCode')
    .sort({ year: -1 });

    const placementsByCourse = {};
    placements.forEach(placement => {
      const courseId = placement.courseId._id.toString();
      if (!placementsByCourse[courseId]) {
        placementsByCourse[courseId] = [];
      }
      placementsByCourse[courseId].push(placement);
    });

    // Build comparison data
    const comparisonData = courses.map(course => {
      const courseId = course._id.toString();
      return {
        course: course.toObject(),
        cutoffs: cutoffsByCourse[courseId] || [],
        placements: placementsByCourse[courseId] || []
      };
    });

    res.json({
      success: true,
      data: comparisonData
    });
  } catch (error) {
    console.error('Error in compareCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing courses',
      error: error.message
    });
  }
};

// GET /api/comparison/suggestions/:collegeId - Get comparison suggestions
exports.getComparisonSuggestions = async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    // Get the reference college
    const referenceCollege = await College.findById(collegeId);
    if (!referenceCollege) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Find similar colleges based on:
    // 1. Same district
    // 2. Same college type
    // 3. Similar NIRF ranking range
    const query = {
      _id: { $ne: collegeId },
      isActive: true,
      $or: [
        { 'address.district': referenceCollege.address.district },
        { collegeType: referenceCollege.collegeType }
      ]
    };

    // If reference college has NIRF ranking, find colleges with similar ranking
    if (referenceCollege.rankings?.nirf?.engineeringRank) {
      const rank = referenceCollege.rankings.nirf.engineeringRank;
      const rankRange = 10; // Within 10 ranks
      query.$or.push({
        'rankings.nirf.engineeringRank': {
          $gte: Math.max(1, rank - rankRange),
          $lte: rank + rankRange
        }
      });
    }

    const suggestions = await College.find(query)
      .select('collegeName collegeCode tneaCode address district collegeType rankings')
      .limit(5);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error in getComparisonSuggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting comparison suggestions',
      error: error.message
    });
  }
};
