import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { collegeAPI } from '../services/api';
import toast from 'react-hot-toast';

const Colleges = () => {
  const { t, language } = useLanguage();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    district: '',
    type: '',
    nbaAccredited: false,
    nirfRanked: false,
    sortBy: 'collegeName',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Erode', 'Tiruppur', 'Vellore', 'Thoothukudi', 'Dindigul',
    'Thanjavur', 'Ramanathapuram', 'Namakkal', 'Virudhunagar', 'Cuddalore'
  ];

  const collegeTypes = ['Government', 'Private', 'Aided'];

  useEffect(() => {
    fetchColleges();
  }, [filters]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await collegeAPI.getColleges(filters);
      const formattedResponse = {
        data: response.data.data || response.data,
        pagination: response.data.pagination
      };
      setColleges(formattedResponse.data);
      setPagination(formattedResponse.pagination);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const response = await collegeAPI.searchColleges(searchQuery, 50);
        setColleges(response.data.data || response.data);
        setPagination(null);
      } catch (error) {
        console.error('Error searching colleges:', error);
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      district: '',
      type: '',
      nbaAccredited: false,
      nirfRanked: false,
      sortBy: 'collegeName',
      sortOrder: 'asc'
    });
    setSearchQuery('');
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

  const getNIRFDisplay = (rankings) => {
    if (rankings?.nirf?.engineeringRank) {
      return `Rank ${rankings.nirf.engineeringRank}`;
    }
    if (rankings?.nirf?.band) {
      return rankings.nirf.band;
    }
    return 'Not Ranked';
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
            {t('colleges')}
          </h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'தமிழ்நாட்டின் சிறந்த பொறியியல் கல்லூரிகளை ஆராயுங்கள்'
              : 'Explore the best engineering colleges in Tamil Nadu'
            }
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Filter Toggle */}
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

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('district')}
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
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
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
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
                  {t('sortBy')}
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="collegeName">Name</option>
                  <option value="address.district">District</option>
                  <option value="rankings.nirf.engineeringRank">NIRF Rank</option>
                  <option value="establishmentYear">Establishment Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sortOrder')}
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.nbaAccredited}
                    onChange={(e) => handleFilterChange('nbaAccredited', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">NBA Accredited</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.nirfRanked}
                    onChange={(e) => handleFilterChange('nirfRanked', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">NIRF Ranked</span>
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {colleges.length} {language === 'ta' ? 'கல்லூரிகள் காணப்பட்டன' : 'colleges found'}
          </p>
        </div>

        {/* Colleges Grid */}
        {colleges.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {colleges.map((college, index) => (
              <motion.div
                key={college._id}
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
                        {college.collegeName}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(college.collegeType)}`}>
                          {college.collegeType}
                        </span>
                        <span className="text-sm text-gray-500">
                          {college.tneaCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {college.address?.district}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      Est. {college.establishmentYear}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      {getNIRFDisplay(college.rankings)}
                    </div>
                  </div>

                  {college.accreditation?.nba?.accredited && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        NBA Accredited
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <a
                      href={college.contact?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {t('view')} {t('website')}
                    </a>
                    <button
                      onClick={() => window.location.href = `/colleges/${college._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {t('view')} Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noDataFound')}
            </h3>
            <p className="text-gray-600">
              {language === 'ta' 
                ? 'உங்கள் தேடலுக்கு ஏற்ற கல்லூரிகள் இல்லை'
                : 'No colleges found matching your search'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => handleFilterChange('page', pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.current} of {pagination.pages}
            </span>
            <button
              onClick={() => handleFilterChange('page', pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;
