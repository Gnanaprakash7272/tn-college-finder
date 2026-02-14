import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { placementAPI } from '../services/api';
import toast from 'react-hot-toast';

const Placements = () => {
  const { t, language } = useLanguage();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear() - 1,
    district: '',
    collegeType: '',
    minPackage: '',
    minPlacementPercentage: ''
  });

  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i - 1);
  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Erode', 'Tiruppur', 'Vellore', 'Thoothukudi', 'Dindigul'
  ];
  const collegeTypes = ['Government', 'Private', 'Aided'];

  useEffect(() => {
    fetchPlacements();
  }, [filters]);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const response = await placementAPI.getPlacements(filters);
      let filteredData = response.data.data || response.data;
      
      // Apply additional filters
      if (filters.district) {
        filteredData = filteredData.filter(placement => 
          placement.collegeId?.address?.district === filters.district
        );
      }
      
      if (filters.collegeType) {
        filteredData = filteredData.filter(placement => 
          placement.collegeId?.collegeType === filters.collegeType
        );
      }

      if (filters.minPackage) {
        filteredData = filteredData.filter(placement => 
          placement.salaryStatistics?.highest >= parseFloat(filters.minPackage)
        );
      }

      if (filters.minPlacementPercentage) {
        filteredData = filteredData.filter(placement => 
          placement.placementStatistics?.placementPercentage >= parseFloat(filters.minPlacementPercentage)
        );
      }

      setPlacements(filteredData);
    } catch (error) {
      console.error('Error fetching placements:', error);
      toast.error('Failed to load placement data');
    } finally {
      setLoading(false);
    }
  };

  const getCollegeTypeColor = (type) => {
    switch (type) {
      case 'Government':
        return 'bg-green-100 text-green-800';
      case 'Private':
        return 'bg-blue-100 text-blue-800';
      case 'Aided':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageColor = (packageAmount) => {
    if (packageAmount >= 10) return 'text-green-600 font-semibold';
    if (packageAmount >= 5) return 'text-blue-600 font-medium';
    return 'text-gray-600';
  };

  const getPlacementColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 font-semibold';
    if (percentage >= 70) return 'text-blue-600 font-medium';
    if (percentage >= 50) return 'text-yellow-600 font-medium';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('placements')}
          </h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'தமிழ்நாடு பொறியியல் கல்லூரிகளின் வேலைவாய்ப்பு புள்ளிவிவரங்கள்'
              : 'Placement statistics of Tamil Nadu engineering colleges'
            }
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('filter')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('year')}
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('district')}
              </label>
              <select
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('collegeType')}
              </label>
              <select
                value={filters.collegeType}
                onChange={(e) => setFilters({...filters, collegeType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {collegeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ta' ? 'குறைந்தபட்ச ஊதியம் (LPA)' : 'Min Package (LPA)'}
              </label>
              <input
                type="number"
                value={filters.minPackage}
                onChange={(e) => setFilters({...filters, minPackage: e.target.value})}
                placeholder="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ta' ? 'குறைந்தபட்ச வேலைவாய்ப்பு %' : 'Min Placement %'}
              </label>
              <input
                type="number"
                value={filters.minPlacementPercentage}
                onChange={(e) => setFilters({...filters, minPlacementPercentage: e.target.value})}
                placeholder="70"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {placements.length} {language === 'ta' ? 'வேலைவாய்ப்பு பதிவுகள் கிடைத்தன' : 'placement records found'}
          </p>
        </div>

        {/* Placement Cards */}
        {placements.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {placements.map((placement, index) => (
              <motion.div
                key={placement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* College Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {placement.collegeId?.collegeName || 'N/A'}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(placement.collegeId?.collegeType)}`}>
                        {placement.collegeId?.collegeType}
                      </span>
                      <span className="text-sm text-gray-500">
                        {placement.collegeId?.address?.district}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {placement.courseId?.courseName} • {placement.courseId?.courseCode}
                    </div>
                  </div>

                  {/* Placement Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === 'ta' ? 'வேலைவாய்ப்பு %' : 'Placement %'}
                      </span>
                      <span className={`text-sm ${getPlacementColor(placement.placementStatistics?.placementPercentage)}`}>
                        {placement.placementStatistics?.placementPercentage || 'N/A'}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === 'ta' ? 'அதிகபட்ச ஊதியம்' : 'Highest Package'}
                      </span>
                      <span className={`text-sm ${getPackageColor(placement.salaryStatistics?.highest)}`}>
                        {placement.salaryStatistics?.highest || 'N/A'} LPA
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {t('averagePackage')}
                      </span>
                      <span className={`text-sm ${getPackageColor(placement.salaryStatistics?.average)}`}>
                        {placement.salaryStatistics?.average || 'N/A'} LPA
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === 'ta' ? 'வைப்பு மாணவர்கள்' : 'Students Placed'}
                      </span>
                      <span className="text-sm text-gray-900">
                        {placement.placementStatistics?.placedStudents || 'N/A'} / {placement.placementStatistics?.totalStudents || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Top Recruiters */}
                  {placement.topRecruiters && placement.topRecruiters.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {language === 'ta' ? 'முக்கிய நிறுவனங்கள்' : 'Top Recruiters'}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {placement.topRecruiters.slice(0, 3).map((recruiter, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                            {recruiter}
                          </span>
                        ))}
                        {placement.topRecruiters.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{placement.topRecruiters.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Year Badge */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      {placement.year}
                    </span>
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noDataFound')}
            </h3>
            <p className="text-gray-600">
              {language === 'ta' 
                ? 'உங்கள் வடிகட்டிகளுக்கு ஏற்ற வேலைவாய்ப்பு தரவு இல்லை'
                : 'No placement data found for your filters'
              }
            </p>
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-start">
            <ChartBarIcon className="h-6 w-6 text-green-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-900 mb-2">
                {language === 'ta' ? 'வேலைவாய்ப்பு பற்றிய தகவல்' : 'About Placements'}
              </h3>
              <div className="text-green-800 space-y-2">
                <p>
                  {language === 'ta' 
                    ? '• வேலைவாய்ப்பு சதவீதம்: வேலை பெற்ற மாணவர்களின் சதவீதம்'
                    : '• Placement Percentage: Percentage of students who got placed'
                  }
                </p>
                <p>
                  {language === 'ta' 
                    ? '• ஊதியம்: லட்சம் ரூபாய் ஆண்டு ஊதியம் (LPA)'
                    : '• Package: Lakh Rupees Per Annum (LPA)'
                  }
                </p>
                <p>
                  {language === 'ta' 
                    ? '• தரவு கல்லூரி அதிகாரிகளால் வழங்கப்பட்டது'
                    : '• Data provided by college authorities'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Placements;
