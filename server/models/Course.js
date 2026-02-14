const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courseCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  branchCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  degree: {
    type: String,
    required: true,
    enum: ['B.E.', 'B.Tech'],
    default: 'B.E.'
  },
  duration: {
    type: Number,
    required: true,
    default: 4,
    min: 3,
    max: 5
  },
  intake: {
    total: {
      type: Number,
      required: true,
      min: 1
    },
    government: {
      type: Number,
      min: 0
    },
    management: {
      type: Number,
      min: 0
    },
    nri: {
      type: Number,
      min: 0
    }
  },
  fees: {
    tuition: {
      government: {
        type: Number,
        required: true,
        min: 0
      },
      management: {
        type: Number,
        required: true,
        min: 0
      },
      nri: {
        type: Number,
        required: true,
        min: 0
      }
    },
    otherFees: {
      hostel: {
        type: Number,
        min: 0,
        default: 0
      },
      mess: {
        type: Number,
        min: 0,
        default: 0
      },
      transport: {
        type: Number,
        min: 0,
        default: 0
      },
      library: {
        type: Number,
        min: 0,
        default: 0
      },
      lab: {
        type: Number,
        min: 0,
        default: 0
      },
      examination: {
        type: Number,
        min: 0,
        default: 0
      }
    },
    totalAnnual: {
      government: {
        type: Number,
        min: 0
      },
      management: {
        type: Number,
        min: 0
      },
      nri: {
        type: Number,
        min: 0
      }
    }
  },
  eligibility: {
    minimumMarks: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    requiredSubjects: [{
      type: String,
      trim: true
    }],
    ageLimit: {
      type: Number,
      min: 15
    }
  },
  accreditation: {
    nba: {
      accredited: {
        type: Boolean,
        default: false
      },
      validUntil: {
        type: Date
      },
      tier: {
        type: String,
        enum: ['Tier 1', 'Tier 2']
      }
    }
  },
  specialization: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
courseSchema.index({ collegeId: 1, courseName: 1 });
courseSchema.index({ courseCode: 1, isActive: 1 });
courseSchema.index({ collegeId: 1, isActive: 1 });
courseSchema.index({ 'fees.totalAnnual.government': 1 });
courseSchema.index({ 'fees.totalAnnual.management': 1 });

// Virtual for total other fees
courseSchema.virtual('fees.otherFees.total').get(function() {
  return Object.values(this.fees.otherFees).reduce((sum, fee) => sum + (fee || 0), 0);
});

// Virtual for full course name with degree
courseSchema.virtual('fullCourseName').get(function() {
  return `${this.courseName} (${this.degree})`;
});

// Virtual for intake distribution percentage
courseSchema.virtual('intakeDistribution').get(function() {
  const total = this.intake.total;
  if (total === 0) return null;
  
  return {
    government: Math.round((this.intake.government || 0) / total * 100),
    management: Math.round((this.intake.management || 0) / total * 100),
    nri: Math.round((this.intake.nri || 0) / total * 100)
  };
});

// Pre-save middleware to calculate total annual fees
courseSchema.pre('save', function(next) {
  // Calculate total annual fees for each category
  const otherFeesTotal = this.fees.otherFees.total || 
    Object.values(this.fees.otherFees).reduce((sum, fee) => sum + (fee || 0), 0);
  
  this.fees.totalAnnual.government = this.fees.tuition.government + otherFeesTotal;
  this.fees.totalAnnual.management = this.fees.tuition.management + otherFeesTotal;
  this.fees.totalAnnual.nri = this.fees.tuition.nri + otherFeesTotal;
  
  // Validate intake distribution
  const intakeSum = (this.intake.government || 0) + 
                   (this.intake.management || 0) + 
                   (this.intake.nri || 0);
  
  if (intakeSum > this.intake.total) {
    next(new Error('Sum of government, management, and NRI seats cannot exceed total intake'));
    return;
  }
  
  next();
});

// Static method to find courses by college
courseSchema.statics.findByCollege = function(collegeId) {
  return this.find({ collegeId, isActive: true })
    .populate('collegeId', 'collegeName collegeType address.district')
    .sort({ courseName: 1 });
};

// Static method to find courses by course code across all colleges
courseSchema.statics.findByCourseCode = function(courseCode) {
  return this.find({ courseCode: courseCode.toUpperCase(), isActive: true })
    .populate('collegeId', 'collegeName collegeType address.district rankings')
    .sort({ 'fees.totalAnnual.government': 1 });
};

// Static method to find courses by fee range
courseSchema.statics.findByFeeRange = function(minFee, maxFee, category = 'government') {
  const query = {
    isActive: true,
    [`fees.totalAnnual.${category}`]: { $gte: minFee, $lte: maxFee }
  };
  
  return this.find(query)
    .populate('collegeId', 'collegeName collegeType address.district')
    .sort({ [`fees.totalAnnual.${category}`]: 1 });
};

// Static method to find NBA accredited courses
courseSchema.statics.findNBAAccredited = function() {
  return this.find({ 
    'accreditation.nba.accredited': true,
    isActive: true 
  })
    .populate('collegeId', 'collegeName collegeType address.district')
    .sort({ courseName: 1 });
};

// Instance method to check if affordable for given budget
courseSchema.methods.isAffordable = function(budget, category = 'government') {
  return this.fees.totalAnnual[category] <= budget;
};

// Instance method to get fee structure summary
courseSchema.methods.getFeeSummary = function(category = 'government') {
  const tuition = this.fees.tuition[category];
  const otherFeesTotal = this.fees.otherFees.total || 
    Object.values(this.fees.otherFees).reduce((sum, fee) => sum + (fee || 0), 0);
  const total = this.fees.totalAnnual[category];
  
  return {
    tuition,
    otherFees: otherFeesTotal,
    total,
    category
  };
};

module.exports = mongoose.model('Course', courseSchema);
