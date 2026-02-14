import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const NotFound = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ExclamationTriangleIcon className="h-24 w-24 text-primary-600 mx-auto mb-6" />
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {language === 'ta' ? 'பக்கம் கிடைக்கவில்லை' : 'Page Not Found'}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {language === 'ta'
              ? 'நீங்கள் தேடும் பக்கம் காணவில்லை. தயவுசெய்து URL சரிபார்க்கவும்.'
              : 'The page you are looking for could not be found. Please check the URL.'
            }
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              {t('home')}
            </Link>
            
            <div className="text-sm text-gray-500">
              {language === 'ta' ? 'அல்லது' : 'Or'}{' '}
              <Link to="/colleges" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('colleges')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
