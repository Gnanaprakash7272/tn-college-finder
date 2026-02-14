const mongoose = require('mongoose');

const placementStatisticsSchema = new mongoose.Schema({
  totalStudents: {
    type: Number,
    min: 0
  },
  eligibleStudents: {
    type: Number,
    min: 0
  },
  placedStudents: {
    type: Number,
    min: 0
  },
  placementPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  higherStudies: {
    type: Number,
    min: 0
  },
  notPlaced: {
    type: Number,
    min: 0
  }
}, { _id: false });

const salaryStatisticsSchema = new mongoose.Schema({
  highest: {
    type: Number,
    min: 0
  },
  average: {
    type: Number,
    min: 0
  },
  median: {
    type: Number,
    min: 0
  },
  lowest: {
    type: Number,
    min: 0
  }
}, { _id: false });

const companyStatisticsSchema = new mongoose.Schema({
  totalCompanies: {
    type: Number,
    min: 0
  },
  coreCompanies: {
    type: Number,
    min: 0
  },
  itCompanies: {
    type: Number,
    min: 0
  },
  mncs: {
    type: Number,
    min: 0
  },
  startups: {
    type: Number,
    min: 0
  }
}, { _id: false });

const internshipStatisticsSchema = new mongoose.Schema({
  totalInternships: {
    type: Number,
    min: 0
  },
  paidInternships: {
    type: Number,
    min: 0
  },
  stipendRange: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    }
  }
}, { _id: false });

const placementSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    index: true
  },
  academicYear: {
    type: String,
    required: true
  },
  placementStatistics: placementStatisticsSchema,
  salaryStatistics: salaryStatisticsSchema,
  companyStatistics: companyStatisticsSchema,
  topRecruiters: [{
    type: String,
    trim: true
  }],
  branchWisePlacements: [{
    company: {
      type: String,
      trim: true,
      required: true
    },
    studentsPlaced: {
      type: Number,
      min: 0,
      required: true
    },
    packageRange: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      },
      average: {
        type: Number,
        min: 0
      }
    }
  }],
  internshipStatistics: internshipStatisticsSchema
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
placementSchema.index({ collegeId: 1, courseId: 1, year: -1 });
placementSchema.index({ year: -1, 'placementStatistics.placementPercentage': -1 });
placementSchema.index({ year: -1, 'salaryStatistics.average': -1 });

// Virtual for placement success rate
placementSchema.virtual('successRate').get(function() {
  if (this.placementStatistics && this.placementStatistics.eligibleStudents > 0) {
    return Math.round((this.placementStatistics.placedStudents / this.placementStatistics.eligibleStudents) * 100);
  }
  return 0;
});

// Pre-save middleware to calculate derived fields
placementSchema.pre('save', function(next) {
  // Calculate placement percentage if not provided
  if (this.placementStatistics && this.placementStatistics.eligibleStudents > 0) {
    if (!this.placementStatistics.placementPercentage) {
      this.placementStatistics.placementPercentage = Math.round(
        (this.placementStatistics.placedStudents / this.placementStatistics.eligibleStudents) * 100
      );
    }
    
    // Calculate not placed if not provided
    if (!this.placementStatistics.notPlaced) {
      this.placementStatistics.notPlaced = 
        this.placementStatistics.eligibleStudents - this.placementStatistics.placedStudents - (this.placementStatistics.higherStudies || 0);
    }
  }
  
  next();
});

// Static method to get placement statistics by year
placementSchema.statics.getPlacementStatsByYear = function(year) {
  return this.aggregate([
    {
      $match: { year: year }
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: '$placementStatistics.totalStudents' },
        totalPlaced: { $sum: '$placementStatistics.placedStudents' },
        averagePlacementPercentage: { $avg: '$placementStatistics.placementPercentage' },
        averageHighestPackage: { $avg: '$salaryStatistics.highest' },
        averagePackage: { $avg: '$salaryStatistics.average' },
        totalCompanies: { $sum: '$companyStatistics.totalCompanies' }
      }
    }
  ]);
};

// Static method to get top performing colleges
placementSchema.statics.getTopPerformingColleges = function(year, limit = 10) {
  return this.find({ year: year })
    .populate('collegeId', 'collegeName collegeType address.district')
    .sort({ 'placementStatistics.placementPercentage': -1, 'salaryStatistics.average': -1 })
    .limit(limit);
};

module.exports = mongoose.model('Placement', placementSchema);
