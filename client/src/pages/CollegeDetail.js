import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { collegeAPI } from '../services/api';
import toast from 'react-hot-toast';

const CollegeDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [college, setCollege] = useState(null);
  const [courses, setCourses] = useState([]);
  const [cutoffs, setCutoffs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCollegeData();
  }, [id]);

  const fetchCollegeData = async () => {
    try {
      setLoading(true);
      const [collegeRes, coursesRes, cutoffsRes, placementsRes] = await Promise.all([
        collegeAPI.getCollegeById(id),
        collegeAPI.getCollegeCourses(id),
        collegeAPI.getCollegeCutoffs(id),
        collegeAPI.getCollegePlacements(id)
      ]);

      setCollege(collegeRes.data.data || collegeRes.data);
      setCourses(coursesRes.data.data || coursesRes.data);
      setCutoffs(cutoffsRes.data.data || cutoffsRes.data);
      setPlacements(placementsRes.data.data || placementsRes.data);
    } catch (error) {
      console.error('Error fetching college data:', error);
      toast.error('Failed to load college information');
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

  const getNIRFDisplay = (rankings) => {
    if (rankings?.nirf?.engineeringRank) {
      return `Rank ${rankings.nirf.engineeringRank} (${rankings.nirf.year})`;
    }
    if (rankings?.nirf?.band) {
      return `${rankings.nirf.band} Band (${rankings.nirf.year})`;
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

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">College Not Found</h2>
          <Link to="/colleges" className="text-primary-600 hover:text-primary-700">
            Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: language === 'ta' ? 'கண்ணோட்டம்' : 'Overview' },
    { id: 'courses', label: t('courses') },
    { id: 'cutoffs', label: t('cutoffs') },
    { id: 'placements', label: t('placements') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{college.collegeName}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCollegeTypeColor(college.collegeType)}`}>
                  {college.collegeType}
                </span>
                <span className="text-gray-600">TNEA Code: {college.tneaCode}</span>
                <span className="text-gray-600">{getNIRFDisplay(college.rankings)}</span>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {language === 'ta' ? 'அடிப்படை தகவல்கள்' : 'Basic Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-gray-900">
                        {college.address?.street}, {college.address?.city}, {college.address?.district} - {college.address?.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900">{college.contact?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a 
                        href={college.contact?.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {college.contact?.website}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Established</p>
                      <p className="text-gray-900">{college.establishmentYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Affiliations</p>
                      <p className="text-gray-900">{college.affiliations?.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Infrastructure</p>
                      <p className="text-gray-900">
                        Campus: {college.infrastructure?.campusArea || 'N/A'} acres | 
                        Students: {college.infrastructure?.totalStudents || 'N/A'} | 
                        Faculty: {college.infrastructure?.totalFaculty || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accreditation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('accreditation')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">NBA</h3>
                  {college.accreditation?.nba?.accredited ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Accredited
                      </div>
                      <p className="text-sm text-gray-600">
                        Valid until: {new Date(college.accreditation.nba.validUntil).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Courses: {college.accreditation.nba.courses?.join(', ') || 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Not Accredited</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">NAAC</h3>
                  {college.accreditation?.naac?.grade ? (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-primary-600">
                        {college.accreditation.naac.grade}
                      </p>
                      <p className="text-sm text-gray-600">
                        CGPA: {college.accreditation.naac.cgpa}
                      </p>
                      <p className="text-sm text-gray-600">
                        Valid until: {new Date(college.accreditation.naac.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Not Accredited</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">NIRF Ranking</h3>
                  <p className="text-lg font-semibold text-primary-600">
                    {getNIRFDisplay(college.rankings)}
                  </p>
                  {college.rankings?.nirf?.overallRank && (
                    <p className="text-sm text-gray-600">
                      Overall: #{college.rankings.nirf.overallRank}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('courses')} ({courses.length})
                </h2>
              </div>
              {courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Intake
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fees (Govt)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NBA
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {course.courseName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {course.courseCode} • {course.degree}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.intake?.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{course.fees?.totalAnnual?.government?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.accreditation?.nba?.accredited ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No courses available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Cutoffs Tab */}
        {activeTab === 'cutoffs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('cutoffs')} ({cutoffs.length})
                </h2>
              </div>
              {cutoffs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Round
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          OC
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BC
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cutoffs.map((cutoff) => (
                        <tr key={cutoff._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cutoff.courseId?.courseName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cutoff.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cutoff.round}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cutoff.communityCutoffs?.oc?.closing || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cutoff.communityCutoffs?.bc?.closing || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cutoff.communityCutoffs?.sc?.closing || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No cutoff data available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Placements Tab */}
        {activeTab === 'placements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('placements')} ({placements.length})
                </h2>
              </div>
              {placements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Placement %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Highest (LPA)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average (LPA)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {placements.map((placement) => (
                        <tr key={placement._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.courseId?.courseName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.placementStatistics?.placementPercentage || 'N/A'}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.salaryStatistics?.highest || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.salaryStatistics?.average || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No placement data available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetail;
