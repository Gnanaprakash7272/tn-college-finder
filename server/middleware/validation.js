const Joi = require('joi');

// College validation schema
const collegeSchema = Joi.object({
  collegeName: Joi.string().required().trim(),
  collegeCode: Joi.string().required().trim().uppercase(),
  tneaCode: Joi.string().required().trim(),
  address: Joi.object({
    street: Joi.string().required().trim(),
    city: Joi.string().required().trim(),
    district: Joi.string().required().trim(),
    pincode: Joi.string().pattern(/^\d{6}$/).required(),
    state: Joi.string().default('Tamil Nadu'),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180)
    }).optional()
  }).required(),
  contact: Joi.object({
    phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).required(),
    email: Joi.string().email().required(),
    website: Joi.string().uri().required(),
    brochureUrl: Joi.string().uri().optional()
  }).required(),
  collegeType: Joi.string().valid('Government', 'Private', 'Aided').required(),
  establishmentYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  accreditation: Joi.object({
    nba: Joi.object({
      accredited: Joi.boolean().default(false),
      courses: Joi.array().items(Joi.string().trim()),
      validUntil: Joi.date()
    }).optional(),
    naac: Joi.object({
      grade: Joi.string().valid('A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'),
      cgpa: Joi.number().min(0).max(4),
      validUntil: Joi.date()
    }).optional(),
    iso: Joi.object({
      certified: Joi.boolean().default(false),
      standard: Joi.string().trim()
    }).optional()
  }).optional(),
  rankings: Joi.object({
    nirf: Joi.object({
      overallRank: Joi.number().integer().min(1),
      engineeringRank: Joi.number().integer().min(1),
      band: Joi.string().trim(),
      year: Joi.number().integer().min(2016)
    }).optional(),
    otherRankings: Joi.array().items(
      Joi.object({
        rankingBody: Joi.string().trim().required(),
        rank: Joi.number().integer().min(1).required(),
        year: Joi.number().integer().min(2016).required()
      })
    ).optional()
  }).optional(),
  infrastructure: Joi.object({
    campusArea: Joi.number().min(0),
    totalStudents: Joi.number().integer().min(0),
    totalFaculty: Joi.number().integer().min(0),
    departments: Joi.array().items(Joi.string().trim()),
    facilities: Joi.array().items(Joi.string().trim())
  }).optional(),
  affiliations: Joi.array().items(Joi.string().trim()).optional(),
  approvedBy: Joi.array().items(Joi.string().trim()).optional()
});

// Course validation schema
const courseSchema = Joi.object({
  collegeId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  courseName: Joi.string().required().trim(),
  courseCode: Joi.string().required().trim().uppercase(),
  branchCode: Joi.string().required().trim().uppercase(),
  degree: Joi.string().valid('B.E.', 'B.Tech').default('B.E.'),
  duration: Joi.number().integer().min(3).max(5).default(4),
  intake: Joi.object({
    total: Joi.number().integer().min(1).required(),
    government: Joi.number().integer().min(0).optional(),
    management: Joi.number().integer().min(0).optional(),
    nri: Joi.number().integer().min(0).optional()
  }).required(),
  fees: Joi.object({
    tuition: Joi.object({
      government: Joi.number().min(0).required(),
      management: Joi.number().min(0).required(),
      nri: Joi.number().min(0).required()
    }).required(),
    otherFees: Joi.object({
      hostel: Joi.number().min(0).default(0),
      mess: Joi.number().min(0).default(0),
      transport: Joi.number().min(0).default(0),
      library: Joi.number().min(0).default(0),
      lab: Joi.number().min(0).default(0),
      examination: Joi.number().min(0).default(0)
    }).optional()
  }).required(),
  eligibility: Joi.object({
    minimumMarks: Joi.number().min(0).max(100).default(50),
    requiredSubjects: Joi.array().items(Joi.string().trim()),
    ageLimit: Joi.number().integer().min(15).optional()
  }).optional(),
  accreditation: Joi.object({
    nba: Joi.object({
      accredited: Joi.boolean().default(false),
      validUntil: Joi.date(),
      tier: Joi.string().valid('Tier 1', 'Tier 2')
    }).optional()
  }).optional(),
  specialization: Joi.array().items(Joi.string().trim()).optional()
});

// Cutoff validation schema
const cutoffSchema = Joi.object({
  collegeId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  courseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  year: Joi.number().integer().min(2020).required(),
  round: Joi.string().valid('Round 1', 'Round 2', 'Round 3', 'Supplementary').required(),
  communityCutoffs: Joi.object({
    oc: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional(),
    bc: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional(),
    bcm: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional(),
    mbc: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional(),
    sc: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional(),
    sca: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional(),
    st: Joi.object({
      opening: Joi.number().min(0).max(200).required(),
      closing: Joi.number().min(0).max(200).required(),
      average: Joi.number().min(0).max(200).optional()
    }).optional()
  }).required(),
  totalApplications: Joi.number().integer().min(0).default(0),
  totalSeats: Joi.number().integer().min(1).required(),
  filledSeats: Joi.number().integer().min(0).default(0),
  vacancySeats: Joi.number().integer().min(0).default(0),
  isPredicted: Joi.boolean().default(false),
  confidence: Joi.number().min(0).max(100).optional(),
  source: Joi.string().valid('official', 'scraped', 'manual', 'ml_prediction').default('official')
});

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: errorMessage
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  validateCollege: validate(collegeSchema),
  validateCourse: validate(courseSchema),
  validateCutoff: validate(cutoffSchema),
  collegeSchema,
  courseSchema,
  cutoffSchema
};
