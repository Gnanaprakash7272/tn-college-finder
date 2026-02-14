import React from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: AcademicCapIcon,
      title: language === 'ta' ? 'முழுமையான தகவல்' : 'Comprehensive Data',
      description: language === 'ta' 
        ? '500+ பொறியியல் கல்லூரிகள், 50+ பாடநெறிகள், மற்றும் முழு விவரங்கள்'
        : '500+ engineering colleges, 50+ courses, and complete details'
    },
    {
      icon: BuildingOfficeIcon,
      title: language === 'ta' ? 'TNEA குவியல்' : 'TNEA Focused',
      description: language === 'ta'
        ? 'தமிழ்நாடு பொறியியல் ஆலோசனைக்கு குறிப்பாக வடிவமைக்கப்பட்டது'
        : 'Specifically designed for Tamil Nadu Engineering Counselling'
    },
    {
      icon: UsersIcon,
      title: language === 'ta' ? 'சமூக வகைகள்' : 'Community Wise',
      description: language === 'ta'
        ? 'OC, BC, BCM, MBC, SC, SCA, ST அனைத்து சமூகங்களுக்கும் தனிப்பட்ட தகவல்கள்'
        : 'Separate data for all communities: OC, BC, BCM, MBC, SC, SCA, ST'
    },
    {
      icon: ChartBarIcon,
      title: language === 'ta' ? 'வேலைவாய்ப்பு புள்ளிவிவரங்கள்' : 'Placement Stats',
      description: language === 'ta'
        ? 'ஊதியம், வேலைவாய்ப்பு சதவீதம், மற்றும் முக்கிய நிறுவனங்கள் பற்றிய தகவல்கள்'
        : 'Salary, placement percentage, and top recruiters information'
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

  const howItWorks = [
    {
      step: 1,
      title: language === 'ta' ? 'தேடுங்கள்' : 'Search',
      description: language === 'ta'
        ? 'கல்லூரிகள், பாடநெறிகள், அல்லது உங்கள் விருப்பங்களைத் தேடுங்கள்'
        : 'Search for colleges, courses, or your preferences'
    },
    {
      step: 2,
      title: language === 'ta' ? 'ஒப்பிடுங்கள்' : 'Compare',
      description: language === 'ta'
        ? 'பல கல்லூரிகளை ஒப்பிட்டு சிறந்ததைத் தேர்ந்தெடுக்கவும்'
        : 'Compare multiple colleges and choose the best one'
    },
    {
      step: 3,
      title: language === 'ta' ? 'முடிவு எடுக்கவும்' : 'Decide',
      description: language === 'ta'
        ? 'கட்டாஃப்கள், கட்டணம், வேலைவாய்ப்பு தகவல்களின் அடிப்படையில் முடிவு எடுக்கவும்'
        : 'Make decision based on cutoffs, fees, and placement information'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'ta' 
                ? 'எங்களைப் பற்றி'
                : 'About College Finder'
              }
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {language === 'ta'
                ? 'தமிழ்நாடு பொறியியல் கல்லூரி தேர்வுக்கான உங்கள் வழிகாட்டி'
                : 'Your guide to Tamil Nadu engineering college selection'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {language === 'ta' ? 'எங்கள் நோக்கம்' : 'Our Mission'}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் 12-ஆம் வகுப்பு மாணவர்களுக்கு சரியான பொறியியல் கல்லூரி மற்றும் பாடநெறியைத் தேர்ந்தெடுப்பதற்கு எளிதாக, வெளிப்படையாக, மற்றும் துல்லியமான தகவல்களை வழங்குவது எங்கள் நோக்கம்.'
                : 'Our mission is to provide easy, transparent, and accurate information to help 12th standard students of Tamil Nadu choose the right engineering college and course.'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ta' ? 'ஏன் எங்களைத் தேர்ந்தெடுக்க வேண்டும்?' : 'Why Choose Us?'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'ta' ? 'புதுப்பிக்கப்பட்ட தகவல்கள்' : 'Updated Information'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'ta'
                        ? 'அரசு அதிகாரப்பூர்வ தகவல்கள் மற்றும் கல்லூரி அறிக்கைகளிலிருந்து புதுப்பிக்கப்பட்ட தரவு'
                        : 'Updated data from official government sources and college disclosures'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'ta' ? 'இலவச சேவை' : 'Free Service'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'ta'
                        ? 'மாணவர்களுக்கு முழுமையாக இலவசமாக அனைத்து தகவல்களையும் வழங்குகிறோம்'
                        : 'Completely free access to all information for students'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {language === 'ta' ? 'பயன்பாட்டு நட்பமான' : 'User Friendly'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'ta'
                        ? 'கிராமப்புற மாணவர்களுக்கும் புரியும் எளிய இடைமுகப்பு'
                        : 'Simple interface understandable even for rural students'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ta' ? 'எங்கள் அம்சங்கள்' : 'Our Features'}
                </h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {language === 'ta' ? 'இது எப்படி வேலை செய்கிறது?' : 'How It Works'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'ta'
                ? 'மூன்று எளிய படிகளில் உங்கள் சரியான கல்லூரியைக் கண்டறியுங்கள்'
                : 'Find your perfect college in three simple steps'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'ta' ? 'எங்களைத் தொடர்பு கொள்ளுங்கள்' : 'Get in Touch'}
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              {language === 'ta'
                ? 'கேள்விகள் அல்லது கருத்துக்கள் இருந்தால் எங்களைத் தொடர்பு கொள்ளுங்கள்'
                : 'Have questions or suggestions? We would love to hear from you'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@collegefinder.tn"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Us'}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-semibold"
              >
                {t('contact')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
