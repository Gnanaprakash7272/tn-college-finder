import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { cutoffAPI } from '../services/api';
import toast from 'react-hot-toast';

const Cutoffs = () => {
  const { t, language } = useLanguage();
  const [cutoffs, setCutoffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear() - 1,
    community: 'OC',
    round: 'Round 1',
    district: '',
    collegeType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const communities = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Supplementary'];
  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i - 1);
  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Erode', 'Tiruppur', 'Vellore', 'Thoothukudi', 'Dindigul'
  ];
  const collegeTypes = ['Government', 'Private', 'Aided'];

  useEffect(() => {
    fetchCutoffs();
  }, [filters]);

  const fetchCutoffs = async () => {
    try {
      setLoading(true);
      const response = await cutoffAPI.getCutoffsByYearAndCommunity(
        filters.year,
        filters.community.toLowerCase(),
        100
      );
      
      let filteredData = response.data.data || response.data;
      
      // Apply additional filters
      if (filters.district) {
        filteredData = filteredData.filter(cutoff => 
          cutoff.collegeId?.address?.district === filters.district
        );
      }
      
      if (filters.collegeType) {
        filteredData = filteredData.filter(cutoff => 
          cutoff.collegeId?.collegeType === filters.collegeType
        );
      }

      setCutoffs(filteredData);
    } catch (error) {
      console.error('Error fetching cutoffs:', error);
      toast.error('Failed to load cutoff data');
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

  const getAdmissionChance = (mark, cutoff) => {
    if (!cutoff || !cutoff.closing) return 'unknown';
    if (mark >= cutoff.closing) return 'high';
    if (mark >= cutoff.opening) return 'medium';
    return 'low';
  };

  const getChanceColor = (chance) => {
    switch (chance) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
            {t('cutoffs')}
          </h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'TNEA ஆலோசனை கட்டாஃப் மதிப்பெண்கள்'
              : 'TNEA counselling cutoff marks'
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
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t"
            >
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
                  {t('community')}
                </label>
                <select
                  value={filters.community}
                  onChange={(e) => setFilters({...filters, community: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {communities.map(community => (
                    <option key={community} value={community}>{community}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('round')}
                </label>
                <select
                  value={filters.round}
                  onChange={(e) => setFilters({...filters, round: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {rounds.map(round => (
                    <option key={round} value={round}>{round}</option>
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
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {cutoffs.length} {language === 'ta' ? 'கட்டாஃப் பதிவுகள் கிடைத்தன' : 'cutoff records found'}
          </p>
        </div>

        {/* Cutoffs Table */}
        {cutoffs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('collegeName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ta' ? 'பாடநெறி' : 'Course'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ta' ? 'திறப்பு' : 'Opening'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ta' ? 'மூடுதல்' : 'Closing'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ta' ? 'சராசரி' : 'Average'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ta' ? 'வகை' : 'Type'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cutoffs.map((cutoff, index) => {
                    const communityCutoff = cutoff.communityCutoffs?.[filters.community.toLowerCase()];
                    return (
                      <tr key={cutoff._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {cutoff.collegeId?.collegeName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cutoff.collegeId?.address?.district}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cutoff.courseId?.courseName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cutoff.courseId?.courseCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {communityCutoff?.opening || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {communityCutoff?.closing || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {communityCutoff?.average || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(cutoff.collegeId?.collegeType)}`}>
                            {cutoff.collegeId?.collegeType || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noDataFound')}
            </h3>
            <p className="text-gray-600">
              {language === 'ta' 
                ? 'உங்கள் வடிகட்டிகளுக்கு ஏற்ற கட்டாஃப் தரவு இல்லை'
                : 'No cutoff data found for your filters'
              }
            </p>
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <div className="flex items-start">
            <ChartBarIcon className="h-6 w-6 text-blue-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {language === 'ta' ? 'கட்டாஃப் பற்றிய தகவல்' : 'About Cutoffs'}
              </h3>
              <div className="text-blue-800 space-y-2">
                <p>
                  {language === 'ta' 
                    ? '• திறப்பு மதிப்பெண்: அந்த சமூகத்தில் ஒருவர் பெற்ற குறைந்தபட்ச மதிப்பெண்'
                    : '• Opening Mark: Lowest mark secured by a candidate in that community'
                  }
                </p>
                <p>
                  {language === 'ta' 
                    ? '• மூடுதல் மதிப்பெண்: அந்த சமூகத்தில் ஒருவர் பெற்ற அதிகபட்ச மதிப்பெண்'
                    : '• Closing Mark: Highest mark secured by a candidate in that community'
                  }
                </p>
                <p>
                  {language === 'ta' 
                    ? '• சராசரி மதிப்பெண்: திறப்பு மற்றும் மூடுதல் மதிப்பெண்களின் சராசரி'
                    : '• Average Mark: Average of opening and closing marks'
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

export default Cutoffs;
