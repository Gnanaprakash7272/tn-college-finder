import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { searchAPI } from '../services/api';
import toast from 'react-hot-toast';

const Search = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    district: '',
    collegeType: '',
    minMarks: '',
    maxMarks: '',
    community: 'oc'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Erode', 'Tiruppur', 'Vellore', 'Thoothukudi', 'Dindigul'
  ];

  const communities = ['oc', 'bc', 'bcm', 'mbc', 'sc', 'sca', 'st'];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error(language === 'ta' ? 'தேடல் வார்த்தையை உள்ளிடவும்' : 'Please enter search query');
      return;
    }

    try {
      setLoading(true);
      const searchParams = {
        q: searchQuery,
        type: filters.type,
        ...filters
      };
      
      const response = await searchAPI.globalSearch(searchQuery, filters);
      setResults(response.data.data || response.data);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed');
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
            {t('search')}
          </h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'கல்லூரிகள், பாடநெறிகள், மற்றும் அதிகப்படியான தகவல்களைத் தேடுங்கள்'
              : 'Search colleges, courses, and more'
            }
          </p>
        </motion.div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ta' ? 'கல்லூரி, பாடநெறி, அல்லது விசாரணை...' : 'College, course, or anything...'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {showAdvanced 
                  ? (language === 'ta' ? 'எளிய தேடல்' : 'Simple Search')
                  : (language === 'ta' ? 'மேம்பட்ட தேடல்' : 'Advanced Search')
                }
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? (language === 'ta' ? 'தேடுகிறது...' : 'Searching...') : t('search')}
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ta' ? 'தேடல் வகை' : 'Search Type'}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All</option>
                    <option value="colleges">Colleges</option>
                    <option value="courses">Courses</option>
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
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Aided">Aided</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('community')}
                  </label>
                  <select
                    value={filters.community}
                    onChange={(e) => setFilters({...filters, community: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {communities.map(community => (
                      <option key={community} value={community.toUpperCase()}>
                        {community.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-gray-600">
              {results.length} {language === 'ta' ? 'முடிவுகள் கிடைத்தன' : 'results found'}
            </p>
          </motion.div>
        )}

        {/* Results Grid */}
        {results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {results.map((result, index) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  {result.collegeName ? (
                    // College Result
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {result.collegeName}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(result.collegeType)}`}>
                              {result.collegeType}
                            </span>
                            <span className="text-sm text-gray-500">
                              {result.tneaCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {result.address?.district}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                          Est. {result.establishmentYear}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <button
                          onClick={() => window.location.href = `/colleges/${result._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          {t('view')} Details
                        </button>
                        <span className="text-xs text-gray-500">College</span>
                      </div>
                    </>
                  ) : (
                    // Course Result
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {result.courseName}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {result.courseCode}
                            </span>
                            <span className="text-sm text-gray-500">
                              {result.degree}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          {result.collegeId?.collegeName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          ₹{result.fees?.totalAnnual?.government?.toLocaleString()} / year
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <button
                          onClick={() => window.location.href = `/courses/${result._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          {t('view')} Details
                        </button>
                        <span className="text-xs text-gray-500">Course</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : searchQuery && !loading ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'ta' ? 'முடிவுகள் இல்லை' : 'No results found'}
            </h3>
            <p className="text-gray-600">
              {language === 'ta' 
                ? 'உங்கள் தேடலுக்கு ஏற்ற முடிவுகள் இல்லை'
                : 'No results found for your search'
              }
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
