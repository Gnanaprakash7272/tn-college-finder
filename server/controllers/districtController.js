const College = require('../models/College');
const mongoose = require('mongoose');

// GET /api/districts - Get all districts
exports.getDistricts = async (req, res) => {
  try {
    // Get unique districts from colleges
    const districts = await College.distinct('address.district', {
      isActive: true
    });

    // Sort alphabetically
    districts.sort();

    res.json({
      success: true,
      data: districts,
      count: districts.length
    });
  } catch (error) {
    console.error('Error in getDistricts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching districts',
      error: error.message
    });
  }
};

// GET /api/districts/:id - Get district by ID
exports.getDistrictById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For now, return district info based on name
    // In a real application, you might have a separate District model
    const colleges = await College.find({
      'address.district': id,
      isActive: true
    })
    .select('collegeName collegeType address')
    .limit(1);

    if (colleges.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'District not found'
      });
    }

    const district = {
      name: id,
      state: 'Tamil Nadu',
      totalColleges: await College.countDocuments({
        'address.district': id,
        isActive: true
      })
    };

    res.json({
      success: true,
      data: district
    });
  } catch (error) {
    console.error('Error in getDistrictById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching district',
      error: error.message
    });
  }
};

// GET /api/districts/:id/colleges - Get colleges in district
exports.getCollegesInDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, page = 1, collegeType } = req.query;
    
    const query = {
      'address.district': id,
      isActive: true
    };
    
    if (collegeType) {
      query.collegeType = collegeType;
    }

    const colleges = await College.find(query)
      .select('collegeName collegeCode tneaCode address district collegeType rankings')
      .limit(limit * 1)
      .skip((page - 1) * limit);

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
    console.error('Error in getCollegesInDistrict:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges in district',
      error: error.message
    });
  }
};
