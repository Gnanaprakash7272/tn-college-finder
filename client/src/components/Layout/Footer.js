import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  const footerLinks = {
    platform: [
      { name: t('colleges'), href: '/colleges' },
      { name: t('courses'), href: '/courses' },
      { name: t('comparison'), href: '/comparison' },
      { name: t('search'), href: '/search' }
    ],
    resources: [
      { name: t('cutoffs'), href: '/cutoffs' },
      { name: t('placements'), href: '/placements' },
      { name: language === 'ta' ? 'எப்படி பயன்படுத்துவது' : 'How to Use', href: '#' },
      { name: language === 'ta' ? 'அடிக்கட்டு கேள்விகள்' : 'FAQs', href: '#' }
    ],
    company: [
      { name: t('about'), href: '/about' },
      { name: t('contact'), href: '/contact' },
      { name: t('privacyPolicy'), href: '#' },
      { name: t('termsOfService'), href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'f' },
    { name: 'Twitter', href: '#', icon: '𝕏' },
    { name: 'LinkedIn', href: '#', icon: 'in' },
    { name: 'Instagram', href: '#', icon: '📷' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'ta' ? 'கல்லூரி தேடுபவர்' : 'College Finder'}
                </h3>
                <p className="text-sm text-gray-400">Tamil Nadu</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் 12-ஆம் வகுப்பு மாணவர்களுக்கு சரியான பொறியியல் கல்லூரி மற்றும் பாடநெறியைத் தேர்ந்தெடுப்பதற்கு உதவும் வழிகாட்டி.'
                : 'Your guide to choosing the right engineering college and course for 12th standard students in Tamil Nadu.'
              }
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <a href="mailto:support@collegefinder.tn" className="text-gray-300 hover:text-white">
                  support@collegefinder.tn
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">
                  {language === 'ta' ? 'சென்னை, தமிழ்நாடு' : 'Chennai, Tamil Nadu'}
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ta' ? 'தளம்' : 'Platform'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ta' ? 'வளங்கள்' : 'Resources'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ta' ? 'நிறுவனம்' : 'Company'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 College Finder Tamil Nadu. {t('allRightsReserved')}.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">
                {language === 'ta' ? 'எங்களைப் பின்தொடரவும்:' : 'Follow us:'}
              </span>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <span className="text-xs font-bold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language and Accessibility */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                {language === 'ta' ? 'மொழி: தமிழ், ஆங்கிலம்' : 'Language: Tamil, English'}
              </span>
              <span>
                {language === 'ta' ? 'அணுகல் தன்மை: A' : 'Accessibility: A'}
              </span>
            </div>
            <div>
              {language === 'ta' 
                ? 'TNEA ஆலோசனைக்கு அங்கீகரிக்கப்பட்டது' 
                : 'Recognized for TNEA Counselling'
              }
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
