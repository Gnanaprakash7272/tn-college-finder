const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  collegeCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  tneaCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      default: 'Tamil Nadu'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: false
      },
      longitude: {
        type: Number,
        required: false
      }
    }
  },
  contact: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      required: true,
      trim: true
    },
    brochureUrl: {
      type: String,
      trim: true
    }
  },
  collegeType: {
    type: String,
    required: true,
    enum: ['Government', 'Private', 'Aided'],
    index: true
  },
  establishmentYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  accreditation: {
    nba: {
      accredited: {
        type: Boolean,
        default: false
      },
      courses: [{
        type: String,
        trim: true
      }],
      validUntil: {
        type: Date
      }
    },
    naac: {
      grade: {
        type: String,
        enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C']
      },
      cgpa: {
        type: Number,
        min: 0,
        max: 4
      },
      validUntil: {
        type: Date
      }
    },
    iso: {
      certified: {
        type: Boolean,
        default: false
      },
      standard: {
        type: String,
        trim: true
      }
    }
  },
  rankings: {
    nirf: {
      overallRank: {
        type: Number,
        min: 1
      },
      engineeringRank: {
        type: Number,
        min: 1
      },
      band: {
        type: String,
        trim: true
      },
      year: {
        type: Number,
        min: 2016
      }
    },
    otherRankings: [{
      rankingBody: {
        type: String,
        trim: true
      },
      rank: {
        type: Number,
        min: 1
      },
      year: {
        type: Number,
        min: 2016
      }
    }]
  },
  infrastructure: {
    campusArea: {
      type: Number,
      min: 0
    },
    totalStudents: {
      type: Number,
      min: 0
    },
    totalFaculty: {
      type: Number,
      min: 0
    },
    departments: [{
      type: String,
      trim: true
    }],
    facilities: [{
      type: String,
      trim: true
    }]
  },
  affiliations: [{
    type: String,
    trim: true
  }],
  approvedBy: [{
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
collegeSchema.index({ collegeName: 'text', collegeCode: 1 });
collegeSchema.index({ 'address.district': 1, collegeType: 1 });
collegeSchema.index({ isActive: 1, collegeType: 1 });
collegeSchema.index({ 'rankings.nirf.engineeringRank': 1 });

// Virtual for college age
collegeSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.establishmentYear;
});

// Virtual for student-faculty ratio
collegeSchema.virtual('studentFacultyRatio').get(function() {
  if (this.infrastructure.totalFaculty > 0) {
    return Math.round(this.infrastructure.totalStudents / this.infrastructure.totalFaculty);
  }
  return null;
});

// Static method to find top colleges by NIRF ranking
collegeSchema.statics.findTopColleges = function(limit = 10) {
  return this.find({ 
    isActive: true,
    'rankings.nirf.engineeringRank': { $exists: true }
  })
  .sort({ 'rankings.nirf.engineeringRank': 1 })
  .limit(limit);
};

// Static method to find colleges by district and type
collegeSchema.statics.findByDistrictAndType = function(district, type) {
  const query = { isActive: true };
  if (district) query['address.district'] = district;
  if (type) query.collegeType = type;
  
  return this.find(query).sort({ collegeName: 1 });
};

// Instance method to check if NBA accredited
collegeSchema.methods.isNBAAccredited = function(courseName = null) {
  if (!this.accreditation.nba.accredited) return false;
  if (!courseName) return true;
  return this.accreditation.nba.courses.includes(courseName);
};

// Instance method to get NIRF rank display
collegeSchema.methods.getNIRFDisplay = function() {
  if (this.rankings.nirf.engineeringRank) {
    return `Rank ${this.rankings.nirf.engineeringRank} (${this.rankings.nirf.year})`;
  }
  if (this.rankings.nirf.band) {
    return `${this.rankings.nirf.band} Band (${this.rankings.nirf.year})`;
  }
  return 'Not Ranked';
};

// Pre-save middleware to validate data
collegeSchema.pre('save', function(next) {
  // Validate pincode format (6 digits)
  if (this.address.pincode && !/^\d{6}$/.test(this.address.pincode)) {
    next(new Error('Invalid pincode format'));
    return;
  }
  
  // Validate email format
  if (this.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contact.email)) {
    next(new Error('Invalid email format'));
    return;
  }
  
  // Validate phone format (basic validation)
  if (this.contact.phone && !/^[\d\s\-\+\(\)]+$/.test(this.contact.phone)) {
    next(new Error('Invalid phone number format'));
    return;
  }
  
  next();
});

module.exports = mongoose.model('College', collegeSchema);
