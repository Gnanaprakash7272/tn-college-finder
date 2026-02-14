import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, AcademicCapIcon, BuildingOfficeIcon, ChartBarIcon } from '@heroicons/react/outline';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: SearchIcon,
      title: t('search'),
      description: language === 'ta' 
        ? 'தமிழ்நாட்டின் அனைத்து பொறியியல் கல்லூரிகளையும் எளிதாகத் தேடுங்கள்'
        : 'Search all engineering colleges in Tamil Nadu easily',
      link: '/search'
    },
    {
      icon: AcademicCapIcon,
      title: language === 'ta' ? 'பாடநெறிகள்' : 'Courses',
      description: language === 'ta'
        ? 'கிடைக்கக்கூடிய அனைத்து பொறியியல் பாடநெறிகளையும் ஆராயுங்கள்'
        : 'Explore all available engineering courses',
      link: '/courses'
    },
    {
      icon: BuildingOfficeIcon,
      title: t('colleges'),
      description: language === 'ta'
        ? 'கல்லூரி விவரங்கள், கட்டணம், வேலைவாய்ப்பு பற்றிய முழு தகவல்கள்'
        : 'Complete information about colleges, fees, and placements',
      link: '/colleges'
    },
    {
      icon: ChartBarIcon,
      title: language === 'ta' ? 'ஒப்பீடு' : 'Comparison',
      description: language === 'ta'
        ? 'பல கல்லூரிகளை ஒப்பிட்டு சிறந்ததைத் தேர்ந்தெடுக்கவும்'
        : 'Compare multiple colleges and choose the best',
      link: '/comparison'
    }
  ];

  const stats = [
    {
      number: '500+',
      label: language === 'ta' ? 'பொறியியல் கல்லூரிகள்' : 'Engineering Colleges'
    },
    {
      number: '50+',
      label: language === 'ta' ? 'பாடநெறிகள்' : 'Courses'
    },
    {
      number: '7',
      label: language === 'ta' ? 'சமூக வகைகள்' : 'Communities'
    },
    {
      number: '10+',
      label: language === 'ta' ? 'ஆண்டுகள் தரவு' : 'Years of Data'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'ta' 
                ? 'தமிழ்நாடு பொறியியல் கல்லூரி தேடுபவர்'
                : 'Tamil Nadu Engineering College Finder'
              }
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {language === 'ta'
                ? 'TNEA ஆலோசனைக்கான உங்கள் சரியான பொறியியல் கல்லூரி மற்றும் பாடநெறியைக் கண்டறியவும்'
                : 'Find your perfect engineering college and course for TNEA counselling'
              }
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-6 py-4 pr-12 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <SearchIcon className="h-6 w-6" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'ta' ? 'எங்கள் அம்சங்கள்' : 'Our Features'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ta'
                ? 'சரியான கல்லூரியைத் தேர்ந்தெடுப்பதற்கு உங்களுக்குத் தேவையான அனைத்து கருவிகளும்'
                : 'All the tools you need to make the right college choice'
              }
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  {language === 'ta' ? 'மேலும் அறிக' : 'Learn More'}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'ta'
                ? 'இன்றே உங்கள் கல்லூரித் தேடலைத் தொடங்குங்கள்'
                : 'Start Your College Search Today'
              }
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              {language === 'ta'
                ? 'ஆயிரக்கணக்கான மாணவர்கள் சரியான கல்லூரியைக் கண்டறிந்துள்ளனர்'
                : 'Thousands of students have found their perfect college'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/colleges"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('colleges')}
              </Link>
              <Link
                to="/comparison"
                className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                {t('comparison')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
