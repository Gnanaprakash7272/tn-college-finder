const mongoose = require('mongoose');

const communityCutoffSchema = new mongoose.Schema({
  opening: {
    type: Number,
    required: true,
    min: 0,
    max: 200
  },
  closing: {
    type: Number,
    required: true,
    min: 0,
    max: 200
  },
  average: {
    type: Number,
    min: 0,
    max: 200
  }
}, { _id: false });

const cutoffSchema = new mongoose.Schema({
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
  round: {
    type: String,
    required: true,
    enum: ['Round 1', 'Round 2', 'Round 3', 'Supplementary'],
    index: true
  },
  communityCutoffs: {
    oc: communityCutoffSchema,
    bc: communityCutoffSchema,
    bcm: communityCutoffSchema,
    mbc: communityCutoffSchema,
    sc: communityCutoffSchema,
    sca: communityCutoffSchema,
    st: communityCutoffSchema
  },
  totalApplications: {
    type: Number,
    min: 0,
    default: 0
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  filledSeats: {
    type: Number,
    min: 0,
    default: 0
  },
  vacancySeats: {
    type: Number,
    min: 0,
    default: 0
  },
  isPredicted: {
    type: Boolean,
    default: false,
    index: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  source: {
    type: String,
    enum: ['official', 'scraped', 'manual', 'ml_prediction'],
    default: 'official'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
cutoffSchema.index({ collegeId: 1, courseId: 1, year: -1, round: 1 });
cutoffSchema.index({ year: -1, round: 1 });
cutoffSchema.index({ isPredicted: 1, year: -1 });
cutoffSchema.index({ 'communityCutoffs.oc.closing': -1 });
cutoffSchema.index({ 'communityCutoffs.bc.closing': -1 });
cutoffSchema.index({ 'communityCutoffs.sc.closing': -1 });

// Virtual for seat filling percentage
cutoffSchema.virtual('fillingPercentage').get(function() {
  if (this.totalSeats === 0) return 0;
  return Math.round((this.filledSeats / this.totalSeats) * 100);
});

// Virtual for vacancy percentage
cutoffSchema.virtual('vacancyPercentage').get(function() {
  if (this.totalSeats === 0) return 0;
  return Math.round((this.vacancySeats / this.totalSeats) * 100);
});

// Virtual for competition ratio
cutoffSchema.virtual('competitionRatio').get(function() {
  if (this.filledSeats === 0) return 0;
  return Math.round(this.totalApplications / this.filledSeats);
});

// Pre-save middleware to validate cutoff data
cutoffSchema.pre('save', function(next) {
  // Validate that opening <= closing for all communities
  const communities = ['oc', 'bc', 'bcm', 'mbc', 'sc', 'sca', 'st'];
  
  for (const community of communities) {
    if (this.communityCutoffs[community]) {
      const { opening, closing } = this.communityCutoffs[community];
      if (opening > closing) {
        next(new Error(`Opening cutoff cannot be greater than closing cutoff for ${community.toUpperCase()}`));
        return;
      }
    }
  }
  
  // Validate seat counts
  if (this.filledSeats > this.totalSeats) {
    next(new Error('Filled seats cannot exceed total seats'));
    return;
  }
  
  if (this.vacancySeats > this.totalSeats) {
    next(new Error('Vacancy seats cannot exceed total seats'));
    return;
  }
  
  // Calculate vacancy if not provided
  if (this.vacancySeats === 0 && this.totalSeats > 0 && this.filledSeats >= 0) {
    this.vacancySeats = this.totalSeats - this.filledSeats;
  }
  
  // Calculate average if not provided
  communities.forEach(community => {
    if (this.communityCutoffs[community] && !this.communityCutoffs[community].average) {
      const { opening, closing } = this.communityCutoffs[community];
      this.communityCutoffs[community].average = Math.round((opening + closing) / 2);
    }
  });
  
  next();
});

// Static method to find latest cutoffs for college and course
cutoffSchema.statics.findLatest = function(collegeId, courseId, community = 'oc') {
  return this.findOne({
    collegeId,
    courseId,
    isPredicted: false
  })
  .sort({ year: -1, round: 1 })
  .select(`year round communityCutoffs.${community} totalApplications totalSeats filledSeats`);
};

// Static method to find cutoffs by year and community
cutoffSchema.statics.findByYearAndCommunity = function(year, community, limit = 50) {
  return this.find({
    year,
    [`communityCutoffs.${community}`]: { $exists: true },
    isPredicted: false
  })
  .populate('collegeId', 'collegeName collegeType address.district')
  .populate('courseId', 'courseName courseCode')
  .sort({ [`communityCutoffs.${community}.closing`]: -1 })
  .limit(limit);
};

// Static method to find historical cutoffs for prediction
cutoffSchema.statics.findHistorical = function(collegeId, courseId, years = 5) {
  const startYear = new Date().getFullYear() - years;
  
  return this.find({
    collegeId,
    courseId,
    year: { $gte: startYear },
    isPredicted: false
  })
  .sort({ year: 1, round: 1 });
};

// Static method to get cutoff trends
cutoffSchema.statics.getCutoffTrends = function(collegeId, courseId, community = 'oc') {
  return this.aggregate([
    {
      $match: {
        collegeId: new mongoose.Types.ObjectId(collegeId),
        courseId: new mongoose.Types.ObjectId(courseId),
        isPredicted: false
      }
    },
    {
      $group: {
        _id: '$year',
        opening: { $avg: `$communityCutoffs.${community}.opening` },
        closing: { $avg: `$communityCutoffs.${community}.closing` },
        average: { $avg: `$communityCutoffs.${community}.average` },
        rounds: { $push: '$round' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

// Static method to find colleges within cutoff range
cutoffSchema.statics.findCollegesWithinCutoff = function(mark, community = 'oc', year = null) {
  const query = {
    [`communityCutoffs.${community}.opening`]: { $lte: mark },
    [`communityCutoffs.${community}.closing`]: { $gte: mark },
    isPredicted: false
  };
  
  if (year) {
    query.year = year;
  } else {
    // Get latest year data
    const latestYear = new Date().getFullYear() - 1;
    query.year = latestYear;
  }
  
  return this.find(query)
    .populate('collegeId', 'collegeName collegeType address.district rankings')
    .populate('courseId', 'courseName courseCode')
    .sort({ [`communityCutoffs.${community}.closing`]: -1 });
};

// Instance method to check if student eligible
cutoffSchema.methods.isEligible = function(mark, community = 'oc') {
  const cutoff = this.communityCutoffs[community];
  if (!cutoff) return false;
  return mark >= cutoff.opening && mark <= cutoff.closing;
};

// Instance method to get admission probability
cutoffSchema.methods.getAdmissionProbability = function(mark, community = 'oc') {
  const cutoff = this.communityCutoffs[community];
  if (!cutoff) return 0;
  
  if (mark >= cutoff.closing) return 100;
  if (mark <= cutoff.opening) return 0;
  
  // Linear interpolation between opening and closing
  const range = cutoff.closing - cutoff.opening;
  const position = mark - cutoff.opening;
  return Math.round((position / range) * 100);
};

module.exports = mongoose.model('Cutoff', cutoffSchema);
