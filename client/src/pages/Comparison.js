import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { collegeAPI, comparisonAPI } from '../services/api';
import toast from 'react-hot-toast';

const Comparison = () => {
  const { t, language } = useLanguage();
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchCollegeOptions();
  }, []);

  const fetchCollegeOptions = async () => {
    try {
      const response = await collegeAPI.getColleges({ limit: 50 });
      setCollegeOptions(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching college options:', error);
    }
  };

  const addCollege = (college) => {
    if (selectedColleges.length >= 3) {
      toast.error(language === 'ta' ? 'அதிகபட்சம் 3 கல்லூரிகளை மட்டுமே ஒப்பிட முடியும்' : 'You can compare maximum 3 colleges');
      return;
    }

    if (selectedColleges.find(c => c._id === college._id)) {
      toast.error(language === 'ta' ? 'இந்த கல்லூரி ஏற்கனவே சேர்க்கப்பட்டுள்ளது' : 'College already added');
      return;
    }

    setSelectedColleges([...selectedColleges, college]);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const removeCollege = (collegeId) => {
    setSelectedColleges(selectedColleges.filter(c => c._id !== collegeId));
  };

  const compareColleges = async () => {
    if (selectedColleges.length < 2) {
      toast.error(language === 'ta' ? 'ஒப்பிட குறைந்தது 2 கல்லூரிகளைத் தேர்ந்தெடுக்கவும்' : 'Select at least 2 colleges to compare');
      return;
    }

    try {
      setLoading(true);
      const collegeIds = selectedColleges.map(c => c._id);
      const response = await comparisonAPI.compareColleges(collegeIds);
      setComparisonData(response.data.data || response.data);
    } catch (error) {
      console.error('Error comparing colleges:', error);
      toast.error('Failed to compare colleges');
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = collegeOptions.filter(college =>
    college.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedColleges.find(c => c._id === college._id)
  );

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
            {t('comparison')}
          </h1>
          <p className="text-gray-600">
            {language === 'ta' 
              ? 'பல கல்லூரிகளை ஒப்பிட்டு சிறந்ததைத் தேர்ந்தெடுக்கவும்'
              : 'Compare multiple colleges and choose the best one'
            }
          </p>
        </motion.div>

        {/* College Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {language === 'ta' ? 'கல்லூரிகளைத் தேர்ந்தெடுக்கவும்' : 'Select Colleges to Compare'}
          </h2>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder={language === 'ta' ? 'கல்லூரி பெயரைத் தேடுங்கள்' : 'Search college name...'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {selectedColleges.length < 3 && (
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && searchQuery && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college) => (
                    <button
                      key={college._id}
                      onClick={() => addCollege(college)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{college.collegeName}</div>
                      <div className="text-sm text-gray-500">
                        {college.address?.district} • {college.collegeType}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    {language === 'ta' ? 'கல்லூரிகள் கிடைக்கவில்லை' : 'No colleges found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Colleges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {selectedColleges.map((college, index) => (
              <motion.div
                key={college._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <button
                  onClick={() => removeCollege(college._id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <h3 className="font-medium text-gray-900 pr-8">{college.collegeName}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCollegeTypeColor(college.collegeType)}`}>
                    {college.collegeType}
                  </span>
                  <span className="text-sm text-gray-500">{college.address?.district}</span>
                </div>
              </motion.div>
            ))}
            
            {selectedColleges.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PlusIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">
                    {language === 'ta' ? 'கல்லூரியைச் சேர்க்கவும்' : 'Add College'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Compare Button */}
          <div className="flex justify-center">
            <button
              onClick={compareColleges}
              disabled={selectedColleges.length < 2 || loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : null}
              <span>{t('compare')}</span>
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {comparisonData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'ta' ? 'ஒப்பீட்டு முடிவுகள்' : 'Comparison Results'}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'ta' ? 'அம்சங்கள்' : 'Features'}
                    </th>
                    {selectedColleges.map((college) => (
                      <th key={college._id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {college.collegeName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Basic Info */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {t('collegeType')}
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(college.collegeType)}`}>
                          {college.collegeType}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {t('district')}
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {college.address?.district}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {language === 'ta' ? 'நிறுவன ஆண்டு' : 'Established'}
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {college.establishmentYear}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      NBA {t('accreditation')}
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {college.accreditation?.nba?.accredited ? (
                          <span className="inline-flex items-center text-green-600">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      NIRF {t('ranking')}
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college._id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {college.rankings?.nirf?.engineeringRank 
                          ? `Rank ${college.rankings.nirf.engineeringRank}`
                          : 'Not Ranked'
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Infrastructure */}
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {language === 'ta' ? 'உட்கட்டமைப்பு' : 'Infrastructure'}
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college._id} className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>Campus: {college.infrastructure?.campusArea || 'N/A'} acres</div>
                          <div>Students: {college.infrastructure?.totalStudents || 'N/A'}</div>
                          <div>Faculty: {college.infrastructure?.totalFaculty || 'N/A'}</div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Comparison;
