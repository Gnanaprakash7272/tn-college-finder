# Database Schema Design - College Finder Tamil Nadu

## Overview
This database schema is designed to handle comprehensive information about engineering colleges in Tamil Nadu, including courses, cutoffs, placements, and community-wise data for TNEA counselling.

## Database: MongoDB

## Collections

### 1. Colleges Collection

```javascript
{
  _id: ObjectId,
  collegeName: String, // "Anna University"
  collegeCode: String, // "AU-001"
  tneaCode: String, // "0001" - Official TNEA counselling code
  address: {
    street: String,
    city: String,
    district: String,
    pincode: String,
    state: String, // "Tamil Nadu"
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    brochureUrl: String // PDF link
  },
  collegeType: String, // "Government", "Private", "Aided"
  establishmentYear: Number,
  accreditation: {
    nba: {
      accredited: Boolean,
      courses: [String], // Course names with NBA accreditation
      validUntil: Date
    },
    naac: {
      grade: String, // "A++", "A+", "A", "B++"
      cgpa: Number,
      validUntil: Date
    },
    iso: {
      certified: Boolean,
      standard: String
    }
  },
  rankings: {
    nirf: {
      overallRank: Number,
      engineeringRank: Number,
      band: String, // "100-150", "151-200"
      year: Number
    },
    otherRankings: [{
      rankingBody: String,
      rank: Number,
      year: Number
    }]
  },
  infrastructure: {
    campusArea: Number, // in acres
    totalStudents: Number,
    totalFaculty: Number,
    departments: [String],
    facilities: [String] // ["Library", "Sports", "Hostel", "Lab"]
  },
  affiliations: [String], // ["Anna University", "AICTE"]
  approvedBy: [String], // ["AICTE", "UGC"]
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Courses Collection

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId, // Reference to Colleges
  courseName: String, // "Computer Science and Engineering"
  courseCode: String, // "CSE"
  branchCode: String, // "CS"
  degree: String, // "B.E.", "B.Tech"
  duration: Number, // 4 years
  intake: {
    total: Number,
    management: Number,
    government: Number,
    nri: Number
  },
  fees: {
    tuition: {
      government: Number,
      management: Number,
      nri: Number
    },
    otherFees: {
      hostel: Number,
      mess: Number,
      transport: Number,
      library: Number,
      lab: Number,
      examination: Number
    },
    totalAnnual: {
      government: Number,
      management: Number,
      nri: Number
    }
  },
  eligibility: {
    minimumMarks: Number,
    requiredSubjects: [String],
    ageLimit: Number
  },
  accreditation: {
    nba: {
      accredited: Boolean,
      validUntil: Date,
      tier: String // "Tier 1", "Tier 2"
    }
  },
  specialization: [String], // ["AI/ML", "Data Science", "Cybersecurity"]
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Cutoffs Collection

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId, // Reference to Colleges
  courseId: ObjectId, // Reference to Courses
  year: Number, // 2023, 2024
  round: String, // "Round 1", "Round 2", "Round 3", "Supplementary"
  communityCutoffs: {
    oc: {
      opening: Number,
      closing: Number,
      average: Number
    },
    bc: {
      opening: Number,
      closing: Number,
      average: Number
    },
    bcm: {
      opening: Number,
      closing: Number,
      average: Number
    },
    mbc: {
      opening: Number,
      closing: Number,
      average: Number
    },
    sc: {
      opening: Number,
      closing: Number,
      average: Number
    },
    sca: {
      opening: Number,
      closing: Number,
      average: Number
    },
    st: {
      opening: Number,
      closing: Number,
      average: Number
    }
  },
  totalApplications: Number,
  totalSeats: Number,
  filledSeats: Number,
  vacancySeats: Number,
  isPredicted: Boolean, // true for ML predictions
  confidence: Number, // 0-100 for predictions
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Placements Collection

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId, // Reference to Colleges
  courseId: ObjectId, // Reference to Courses
  year: Number, // 2023, 2024
  academicYear: String, // "2023-24"
  placementStatistics: {
    totalStudents: Number,
    eligibleStudents: Number,
    placedStudents: Number,
    placementPercentage: Number,
    higherStudies: Number,
    notPlaced: Number
  },
  salaryStatistics: {
    highest: Number, // in LPA
    average: Number, // in LPA
    median: Number, // in LPA
    lowest: Number // in LPA
  },
  companyStatistics: {
    totalCompanies: Number,
    coreCompanies: Number,
    itCompanies: Number,
    mncs: Number,
    startups: Number
  },
  topRecruiters: [String], // ["TCS", "Infosys", "Wipro", "HCL"]
  branchWisePlacements: [{
    company: String,
    studentsPlaced: Number,
    packageRange: {
      min: Number,
      max: Number,
      average: Number
    }
  }],
  internshipStatistics: {
    totalInternships: Number,
    paidInternships: Number,
    stipendRange: {
      min: Number,
      max: Number
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Notifications Collection

```javascript
{
  _id: ObjectId,
  title: String,
  message: String,
  type: String, // "counselling", "cutoff", "college", "general"
  priority: String, // "high", "medium", "low"
  targetAudience: [String], // ["all", "oc", "bc", "sc", etc.]
  validFrom: Date,
  validUntil: Date,
  actionUrl: String, // Optional link for more info
  isActive: Boolean,
  sentVia: {
    email: Boolean,
    push: Boolean,
    sms: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Users Collection (Optional - for saved preferences)

```javascript
{
  _id: ObjectId,
  email: String,
  phone: String,
  name: String,
  community: String, // "oc", "bc", etc.
  preferences: {
    savedColleges: [ObjectId], // College IDs
    savedCourses: [ObjectId], // Course IDs
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean
    },
    language: String // "english", "tamil"
  },
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Districts Collection

```javascript
{
  _id: ObjectId,
  districtName: String,
  districtCode: String,
  state: String, // "Tamil Nadu"
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  colleges: [ObjectId], // Array of college IDs
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Predictions Collection (ML Results)

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  courseId: ObjectId,
  year: Number, // Prediction year
  predictionType: String, // "cutoff", "placement", "demand"
  community: String, // "oc", "bc", etc.
  predictedValue: Number,
  confidence: Number, // 0-100
  methodology: String, // "linear_regression", "time_series", etc.
  factors: [{
    name: String,
    weight: Number,
    value: Number
  }],
  historicalData: [{
    year: Number,
    actualValue: Number,
    predictedValue: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

### Colleges Collection
```javascript
// Compound indexes for search and filtering
db.colleges.createIndex({ "collegeName": "text", "collegeCode": 1 })
db.colleges.createIndex({ "address.district": 1, "collegeType": 1 })
db.colleges.createIndex({ "isActive": 1, "collegeType": 1 })
db.colleges.createIndex({ "tneaCode": 1 }, { unique: true })
```

### Courses Collection
```javascript
db.courses.createIndex({ "collegeId": 1, "courseName": 1 })
db.courses.createIndex({ "courseCode": 1, "isActive": 1 })
db.courses.createIndex({ "collegeId": 1, "isActive": 1 })
```

### Cutoffs Collection
```javascript
db.cutoffs.createIndex({ "collegeId": 1, "courseId": 1, "year": -1 })
db.cutoffs.createIndex({ "year": -1, "round": 1 })
db.cutoffs.createIndex({ "isPredicted": 1, "year": -1 })
```

### Placements Collection
```javascript
db.placements.createIndex({ "collegeId": 1, "courseId": 1, "year": -1 })
db.placements.createIndex({ "year": -1, "placementStatistics.placementPercentage": -1 })
```

## Relationships

1. **Colleges → Courses**: One-to-Many (One college has many courses)
2. **Colleges → Cutoffs**: One-to-Many (One college has many cutoff records)
3. **Courses → Cutoffs**: One-to-Many (One course has many cutoff records)
4. **Colleges → Placements**: One-to-Many (One college has many placement records)
5. **Courses → Placements**: One-to-Many (One course has many placement records)
6. **Districts → Colleges**: One-to-Many (One district has many colleges)

## Data Validation Rules

### College Validation
- College Name: Required, unique
- TNEA Code: Required, unique
- District: Required (must be from Tamil Nadu)
- College Type: Required (Government/Private/Aided)

### Course Validation
- College ID: Required, must exist
- Course Name: Required
- Intake: Required, > 0
- Fees: Required, >= 0

### Cutoff Validation
- College ID, Course ID: Required
- Year: Required, >= 2020
- Community cutoffs: Required, 0-200 range
- Opening <= Closing marks

## Scalability Considerations

1. **Sharding**: Can shard by district or college type for large datasets
2. **Caching**: Frequently accessed data (top colleges, popular courses)
3. **Archival**: Move historical cutoff/placement data to separate collections
4. **Read Replicas**: For handling high read traffic during counselling season

## Performance Optimization

1. **Indexes**: Strategic indexes for common query patterns
2. **Projection**: Return only required fields
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **Aggregation**: Use MongoDB aggregation for complex queries and comparisons

## Data Sources

1. **TNEA Official Website**: Counselling codes and cutoffs
2. **College Websites**: Course details and fees
3. **NIRF Rankings**: Annual ranking data
4. **NBA Website**: Accreditation status
5. **Placement Reports**: College annual reports
6. **News Articles**: College updates and announcements
