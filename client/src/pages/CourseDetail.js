import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course information');
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.courseName}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {course.courseCode}
                  </span>
                  <span className="text-gray-600">{course.degree}</span>
                  <span className="text-gray-600">{course.duration} {language === 'ta' ? 'ஆண்டுகள்' : 'years'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {language === 'ta' ? 'அடிப்படை தகவல்கள்' : 'Basic Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{t('collegeName')}</p>
                      <p className="text-gray-900">{course.collegeId?.collegeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'ta' ? 'பாடநெறி குறியீடு' : 'Course Code'}</p>
                      <p className="text-gray-900">{course.courseCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'ta' ? 'காலம்' : 'Duration'}</p>
                      <p className="text-gray-900">{course.duration} {language === 'ta' ? 'ஆண்டுகள்' : 'years'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'ta' ? 'மொத்த சேர்க்கை' : 'Total Intake'}</p>
                      <p className="text-gray-900">{course.intake?.total}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{t('collegeType')}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(course.collegeId?.collegeType)}`}>
                        {course.collegeId?.collegeType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'ta' ? 'கிளை' : 'Branch'}</p>
                      <p className="text-gray-900">{course.branchCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fee Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {language === 'ta' ? 'கட்டண அமைப்பு' : 'Fee Structure'}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ta' ? 'வகை' : 'Category'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ta' ? 'பள்ளியின் கட்டணம்' : 'Tuition Fee'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ta' ? 'மொத்த ஆண்டு கட்டணம்' : 'Total Annual Fee'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {language === 'ta' ? 'அரசு' : 'Government'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{course.fees?.tuition?.government?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{course.fees?.totalAnnual?.government?.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {language === 'ta' ? 'மேலாண்மை' : 'Management'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{course.fees?.tuition?.management?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{course.fees?.totalAnnual?.management?.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        NRI
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{course.fees?.tuition?.nri?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{course.fees?.totalAnnual?.nri?.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {language === 'ta' ? 'தகுதி' : 'Eligibility'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {language === 'ta' ? 'குறைந்தபட்ச மதிப்பெண்கள்' : 'Minimum Marks'}
                  </h3>
                  <p className="text-gray-600">
                    {course.eligibility?.minimumMarks}% {language === 'ta' ? 'கணிதம், இயற்பியல், வேதியியல்' : 'in Mathematics, Physics, Chemistry'}
                  </p>
                </div>
                
                {course.eligibility?.requiredSubjects && course.eligibility.requiredSubjects.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {language === 'ta' ? 'தேவையான பாடங்கள்' : 'Required Subjects'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {course.eligibility.requiredSubjects.map((subject, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {course.eligibility?.ageLimit && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {language === 'ta' ? 'வயது வரம்பு' : 'Age Limit'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'ta' ? 'குறைந்தபட்சம்' : 'Minimum'} {course.eligibility.ageLimit} {language === 'ta' ? 'வயது' : 'years'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Specializations */}
            {course.specialization && course.specialization.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === 'ta' ? 'நிபுணத்துவங்கள்' : 'Specializations'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.specialization.map((spec, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-900">{spec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* College Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ta' ? 'கல்லூரி தகவல்' : 'College Info'}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{t('collegeName')}</p>
                  <p className="font-medium text-gray-900">{course.collegeId?.collegeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('district')}</p>
                  <p className="font-medium text-gray-900">{course.collegeId?.address?.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('collegeType')}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCollegeTypeColor(course.collegeId?.collegeType)}`}>
                    {course.collegeId?.collegeType}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to={`/colleges/${course.collegeId?._id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {language === 'ta' ? 'கல்லூரியைப் பார்க்கவும்' : 'View College'}
                </Link>
              </div>
            </motion.div>

            {/* Accreditation */}
            {course.accreditation?.nba?.accredited && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('accreditation')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">NBA Accredited</span>
                  </div>
                  {course.accreditation.nba.validUntil && (
                    <p className="text-sm text-gray-600">
                      {language === 'ta' ? 'செல்லுபடி வரை' : 'Valid until'}: {new Date(course.accreditation.nba.validUntil).toLocaleDateString()}
                    </p>
                  )}
                  {course.accreditation.nba.tier && (
                    <p className="text-sm text-gray-600">
                      {language === 'ta' ? 'நிலை' : 'Tier'}: {course.accreditation.nba.tier}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Intake Distribution */}
            {course.intake && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ta' ? 'சேர்க்கை பகிர்வு' : 'Intake Distribution'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{language === 'ta' ? 'அரசு' : 'Government'}</span>
                    <span className="font-medium">{course.intake.government || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{language === 'ta' ? 'மேலாண்மை' : 'Management'}</span>
                    <span className="font-medium">{course.intake.management || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">NRI</span>
                    <span className="font-medium">{course.intake.nri || 0}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">{language === 'ta' ? 'மொத்தம்' : 'Total'}</span>
                      <span className="font-bold text-gray-900">{course.intake.total}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
