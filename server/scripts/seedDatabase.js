const mongoose = require('mongoose');
require('dotenv').config();
const College = require('../models/College');
const Course = require('../models/Course');
const Cutoff = require('../models/Cutoff');
const Placement = require('../models/Placement');
const initialData = require('../../database/initial-data.json');

// Sample colleges data
const sampleColleges = [
  {
    collegeName: "Anna University, Chennai",
    collegeCode: "AU-CHN",
    tneaCode: "0001",
    address: {
      street: "Sardar Patel Road",
      city: "Chennai",
      district: "Chennai",
      pincode: "600025",
      state: "Tamil Nadu",
      coordinates: { latitude: 13.0115, longitude: 80.2341 }
    },
    contact: {
      phone: "044-22357170",
      email: "info@annauniv.edu",
      website: "https://www.annauniv.edu",
      brochureUrl: "https://www.annauniv.edu/brochure.pdf"
    },
    collegeType: "Government",
    establishmentYear: 1978,
    accreditation: {
      nba: {
        accredited: true,
        courses: ["CSE", "ECE", "MECH", "CIVIL"],
        validUntil: new Date("2025-06-30")
      },
      naac: {
        grade: "A++",
        cgpa: 3.64,
        validUntil: new Date("2026-03-15")
      }
    },
    rankings: {
      nirf: {
        overallRank: 8,
        engineeringRank: 8,
        year: 2023
      }
    },
    infrastructure: {
      campusArea: 185,
      totalStudents: 15000,
      totalFaculty: 1200,
      departments: ["Engineering", "Technology", "Science", "Management"],
      facilities: ["Library", "Sports", "Hostel", "Lab", "Hospital"]
    },
    affiliations: ["Anna University", "AICTE"],
    approvedBy: ["AICTE", "UGC"],
    isActive: true
  },
  {
    collegeName: "PSG College of Technology, Coimbatore",
    collegeCode: "PSG-CBE",
    tneaCode: "2501",
    address: {
      street: "Avinashi Road",
      city: "Coimbatore",
      district: "Coimbatore",
      pincode: "641004",
      state: "Tamil Nadu",
      coordinates: { latitude: 11.0268, longitude: 76.9645 }
    },
    contact: {
      phone: "0422-2572177",
      email: "principal@psgtech.edu",
      website: "https://www.psgtech.edu",
      brochureUrl: "https://www.psgtech.edu/admissions/brochure.pdf"
    },
    collegeType: "Aided",
    establishmentYear: 1951,
    accreditation: {
      nba: {
        accredited: true,
        courses: ["CSE", "ECE", "MECH", "CIVIL", "IT"],
        validUntil: new Date("2025-06-30")
      },
      naac: {
        grade: "A+",
        cgpa: 3.52,
        validUntil: new Date("2026-03-15")
      }
    },
    rankings: {
      nirf: {
        overallRank: 52,
        engineeringRank: 48,
        year: 2023
      }
    },
    infrastructure: {
      campusArea: 45,
      totalStudents: 8000,
      totalFaculty: 600,
      departments: ["Engineering", "Technology", "Science"],
      facilities: ["Library", "Sports", "Hostel", "Lab", "Gym"]
    },
    affiliations: ["Anna University", "AICTE"],
    approvedBy: ["AICTE", "UGC"],
    isActive: true
  },
  {
    collegeName: "Madras Institute of Technology, Chennai",
    collegeCode: "MIT-CHN",
    tneaCode: "0015",
    address: {
      street: "MIT Road",
      city: "Chromepet",
      district: "Chennai",
      pincode: "600044",
      state: "Tamil Nadu",
      coordinates: { latitude: 12.9516, longitude: 80.1294 }
    },
    contact: {
      phone: "044-22516226",
      email: "principal@mitindia.edu",
      website: "https://www.mitindia.edu",
      brochureUrl: "https://www.mitindia.edu/brochure.pdf"
    },
    collegeType: "Government",
    establishmentYear: 1949,
    accreditation: {
      nba: {
        accredited: true,
        courses: ["CSE", "ECE", "MECH", "CIVIL", "IT"],
        validUntil: new Date("2025-06-30")
      },
      naac: {
        grade: "A+",
        cgpa: 3.46,
        validUntil: new Date("2026-03-15")
      }
    },
    rankings: {
      nirf: {
        overallRank: 65,
        engineeringRank: 58,
        year: 2023
      }
    },
    infrastructure: {
      campusArea: 62,
      totalStudents: 6000,
      totalFaculty: 450,
      departments: ["Engineering", "Technology", "Science"],
      facilities: ["Library", "Sports", "Hostel", "Lab", "Workshop"]
    },
    affiliations: ["Anna University", "AICTE"],
    approvedBy: ["AICTE", "UGC"],
    isActive: true
  }
];

// Sample courses data
const sampleCourses = [
  {
    collegeId: null, // Will be set after creating colleges
    courseName: "Computer Science and Engineering",
    courseCode: "CSE",
    branchCode: "CS",
    degree: "B.E.",
    duration: 4,
    intake: {
      total: 120,
      government: 60,
      management: 40,
      nri: 20
    },
    fees: {
      tuition: {
        government: 50000,
        management: 150000,
        nri: 400000
      },
      otherFees: {
        hostel: 60000,
        mess: 48000,
        transport: 12000,
        library: 5000,
        lab: 8000,
        examination: 3000
      }
    },
    eligibility: {
      minimumMarks: 50,
      requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
      ageLimit: 17
    },
    accreditation: {
      nba: {
        accredited: true,
        validUntil: new Date("2025-06-30"),
        tier: "Tier 1"
      }
    },
    specialization: ["AI/ML", "Data Science", "Cybersecurity", "Cloud Computing"],
    isActive: true
  },
  {
    collegeId: null,
    courseName: "Electronics and Communication Engineering",
    courseCode: "ECE",
    branchCode: "EC",
    degree: "B.E.",
    duration: 4,
    intake: {
      total: 120,
      government: 60,
      management: 40,
      nri: 20
    },
    fees: {
      tuition: {
        government: 45000,
        management: 140000,
        nri: 380000
      },
      otherFees: {
        hostel: 60000,
        mess: 48000,
        transport: 12000,
        library: 5000,
        lab: 10000,
        examination: 3000
      }
    },
    eligibility: {
      minimumMarks: 50,
      requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
      ageLimit: 17
    },
    accreditation: {
      nba: {
        accredited: true,
        validUntil: new Date("2025-06-30"),
        tier: "Tier 1"
      }
    },
    specialization: ["VLSI", "Embedded Systems", "Communication Systems", "Signal Processing"],
    isActive: true
  },
  {
    collegeId: null,
    courseName: "Mechanical Engineering",
    courseCode: "MECH",
    branchCode: "ME",
    degree: "B.E.",
    duration: 4,
    intake: {
      total: 120,
      government: 60,
      management: 40,
      nri: 20
    },
    fees: {
      tuition: {
        government: 40000,
        management: 130000,
        nri: 350000
      },
      otherFees: {
        hostel: 60000,
        mess: 48000,
        transport: 12000,
        library: 5000,
        lab: 15000,
        examination: 3000
      }
    },
    eligibility: {
      minimumMarks: 50,
      requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
      ageLimit: 17
    },
    accreditation: {
      nba: {
        accredited: true,
        validUntil: new Date("2025-06-30"),
        tier: "Tier 1"
      }
    },
    specialization: ["Thermal Engineering", "Design Engineering", "Manufacturing", "Automotive"],
    isActive: true
  },
  {
    collegeId: null,
    courseName: "Information Technology",
    courseCode: "IT",
    branchCode: "IT",
    degree: "B.Tech",
    duration: 4,
    intake: {
      total: 60,
      government: 30,
      management: 20,
      nri: 10
    },
    fees: {
      tuition: {
        government: 48000,
        management: 145000,
        nri: 390000
      },
      otherFees: {
        hostel: 60000,
        mess: 48000,
        transport: 12000,
        library: 5000,
        lab: 8000,
        examination: 3000
      }
    },
    eligibility: {
      minimumMarks: 50,
      requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
      ageLimit: 17
    },
    accreditation: {
      nba: {
        accredited: true,
        validUntil: new Date("2025-06-30"),
        tier: "Tier 1"
      }
    },
    specialization: ["Web Development", "Mobile Development", "Database Systems", "Network Security"],
    isActive: true
  }
];

// Sample cutoffs data
const sampleCutoffs = [
  {
    collegeId: null,
    courseId: null,
    year: 2023,
    round: "Round 1",
    communityCutoffs: {
      oc: { opening: 198, closing: 185, average: 191 },
      bc: { opening: 195, closing: 180, average: 187 },
      bcm: { opening: 193, closing: 178, average: 185 },
      mbc: { opening: 190, closing: 175, average: 182 },
      sc: { opening: 185, closing: 165, average: 175 },
      sca: { opening: 183, closing: 163, average: 173 },
      st: { opening: 180, closing: 160, average: 170 }
    },
    totalApplications: 2500,
    totalSeats: 120,
    filledSeats: 118,
    vacancySeats: 2,
    isPredicted: false,
    source: "official"
  },
  {
    collegeId: null,
    courseId: null,
    year: 2022,
    round: "Round 1",
    communityCutoffs: {
      oc: { opening: 196, closing: 183, average: 189 },
      bc: { opening: 193, closing: 178, average: 185 },
      bcm: { opening: 191, closing: 176, average: 183 },
      mbc: { opening: 188, closing: 173, average: 180 },
      sc: { opening: 183, closing: 163, average: 173 },
      sca: { opening: 181, closing: 161, average: 171 },
      st: { opening: 178, closing: 158, average: 168 }
    },
    totalApplications: 2400,
    totalSeats: 120,
    filledSeats: 116,
    vacancySeats: 4,
    isPredicted: false,
    source: "official"
  }
];

// Sample placements data
const samplePlacements = [
  {
    collegeId: null,
    courseId: null,
    year: 2023,
    academicYear: "2023-24",
    placementStatistics: {
      totalStudents: 118,
      eligibleStudents: 115,
      placedStudents: 105,
      placementPercentage: 91.3,
      higherStudies: 8,
      notPlaced: 10
    },
    salaryStatistics: {
      highest: 45,
      average: 8.5,
      median: 7.2,
      lowest: 3.5
    },
    companyStatistics: {
      totalCompanies: 85,
      coreCompanies: 25,
      itCompanies: 45,
      mncs: 15,
      startups: 10
    },
    topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant", "Amazon", "Microsoft", "Google"],
    internshipStatistics: {
      totalInternships: 95,
      paidInternships: 60,
      stipendRange: {
        min: 5000,
        max: 50000
      }
    }
  },
  {
    collegeId: null,
    courseId: null,
    year: 2022,
    academicYear: "2022-23",
    placementStatistics: {
      totalStudents: 116,
      eligibleStudents: 112,
      placedStudents: 98,
      placementPercentage: 87.5,
      higherStudies: 10,
      notPlaced: 14
    },
    salaryStatistics: {
      highest: 42,
      average: 7.8,
      median: 6.8,
      lowest: 3.2
    },
    companyStatistics: {
      totalCompanies: 78,
      coreCompanies: 22,
      itCompanies: 42,
      mncs: 14,
      startups: 8
    },
    topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant", "IBM", "Oracle", "SAP"],
    internshipStatistics: {
      totalInternships: 88,
      paidInternships: 52,
      stipendRange: {
        min: 4000,
        max: 45000
      }
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_finder_tn');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await College.deleteMany({});
    await Course.deleteMany({});
    await Cutoff.deleteMany({});
    await Placement.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create colleges
    const createdColleges = await College.insertMany(sampleColleges);
    console.log(`✅ Created ${createdColleges.length} colleges`);

    // Create courses for each college
    const allCourses = [];
    for (const college of createdColleges) {
      for (const courseTemplate of sampleCourses) {
        const course = {
          ...courseTemplate,
          collegeId: college._id
        };
        allCourses.push(course);
      }
    }
    
    const createdCourses = await Course.insertMany(allCourses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create cutoffs for each college-course combination
    const allCutoffs = [];
    const allPlacements = [];
    
    for (let i = 0; i < createdColleges.length; i++) {
      const college = createdColleges[i];
      const collegeCourses = createdCourses.filter(course => 
        course.collegeId.toString() === college._id.toString()
      );
      
      for (let j = 0; j < collegeCourses.length; j++) {
        const course = collegeCourses[j];
        
        // Add cutoffs
        for (const cutoffTemplate of sampleCutoffs) {
          const cutoff = {
            ...cutoffTemplate,
            collegeId: college._id,
            courseId: course._id
          };
          allCutoffs.push(cutoff);
        }
        
        // Add placements
        for (const placementTemplate of samplePlacements) {
          const placement = {
            ...placementTemplate,
            collegeId: college._id,
            courseId: course._id
          };
          allPlacements.push(placement);
        }
      }
    }
    
    await Cutoff.insertMany(allCutoffs);
    console.log(`✅ Created ${allCutoffs.length} cutoff records`);
    
    await Placement.insertMany(allPlacements);
    console.log(`✅ Created ${allPlacements.length} placement records`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Colleges: ${createdColleges.length}`);
    console.log(`   Courses: ${createdCourses.length}`);
    console.log(`   Cutoffs: ${allCutoffs.length}`);
    console.log(`   Placements: ${allPlacements.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
