import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';

const Courses = () => {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    courseCode: '',
    minFee: '',
    maxFee: '',
    nbaAccredited: false,
    sortBy: 'courseName',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const courseCodes = [
    'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'BME', 'CHEM', 'AERO'
  ];

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filters.courseCode) {
        response = await courseAPI.getCoursesByCode(filters.courseCode);
      } else if (filters.minFee && filters.maxFee) {
        response = await courseAPI.getCoursesByFeeRange(filters.minFee, filters.maxFee, 'government');
      } else {
        response = await courseAPI.getCourses(filters);
      }
      
      setCourses(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      courseCode: '',
      minFee: '',
      maxFee: '',
      nbaAccredited: false,
      sortBy: 'courseName',
      sortOrder: 'asc'
    });
    setSearchQuery('');
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
            {t('courses')}
          </h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'கிடைக்கக்கூடிய அனைத்து பொறியியல் பாடநெறிகளையும் ஆராயுங்கள்'
              : 'Explore all available engineering courses'
            }
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>{t('filter')}</span>
            </button>
            <button
              onClick={resetFilters}
              className="text-gray-600 hover:text-gray-700"
            >
              {t('reset')}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code
                </label>
                <select
                  value={filters.courseCode}
                  onChange={(e) => handleFilterChange('courseCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Courses</option>
                  {courseCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Fee (₹)
                </label>
                <input
                  type="number"
                  value={filters.minFee}
                  onChange={(e) => handleFilterChange('minFee', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Fee (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxFee}
                  onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                  placeholder="1000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.nbaAccredited}
                    onChange={(e) => handleFilterChange('nbaAccredited', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">NBA Accredited Only</span>
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {courses.length} {language === 'ta' ? 'பாடநெறிகள் காணப்பட்டன' : 'courses found'}
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.courseName}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {course.courseCode}
                        </span>
                        <span className="text-sm text-gray-500">
                          {course.degree}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      {course.collegeId?.collegeName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      Intake: {course.intake?.total}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      ₹{course.fees?.totalAnnual?.government?.toLocaleString()} / year
                    </div>
                  </div>

                  {course.accreditation?.nba?.accredited && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        NBA Accredited
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      onClick={() => window.location.href = `/courses/${course._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {t('view')} Details
                    </button>
                    <span className="text-sm text-gray-500">
                      {course.collegeId?.address?.district}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noDataFound')}
            </h3>
            <p className="text-gray-600">
              {language === 'ta' 
                ? 'உங்கள் தேடலுக்கு ஏற்ற பாடநெறிகள் இல்லை'
                : 'No courses found matching your search'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
