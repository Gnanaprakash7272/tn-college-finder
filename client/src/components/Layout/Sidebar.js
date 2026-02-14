import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const Sidebar = ({ isOpen }) => {
  const { t, language } = useLanguage();
  const location = useLocation();

  const navigation = [
    {
      name: t('home'),
      href: '/',
      icon: HomeIcon,
      current: location.pathname === '/'
    },
    {
      name: t('colleges'),
      href: '/colleges',
      icon: BuildingOfficeIcon,
      current: location.pathname === '/colleges'
    },
    {
      name: t('courses'),
      href: '/courses',
      icon: AcademicCapIcon,
      current: location.pathname === '/courses'
    },
    {
      name: t('comparison'),
      href: '/comparison',
      icon: ArrowsRightLeftIcon,
      current: location.pathname === '/comparison'
    },
    {
      name: t('search'),
      href: '/search',
      icon: MagnifyingGlassIcon,
      current: location.pathname === '/search'
    },
    {
      name: t('cutoffs'),
      href: '/cutoffs',
      icon: ChartBarIcon,
      current: location.pathname === '/cutoffs'
    },
    {
      name: t('placements'),
      href: '/placements',
      icon: CurrencyDollarIcon,
      current: location.pathname === '/placements'
    },
    {
      name: t('about'),
      href: '/about',
      icon: InformationCircleIcon,
      current: location.pathname === '/about'
    },
    {
      name: t('contact'),
      href: '/contact',
      icon: PhoneIcon,
      current: location.pathname === '/contact'
    }
  ];

  const quickStats = [
    {
      label: language === 'ta' ? 'கல்லூரிகள்' : 'Colleges',
      value: '500+',
      color: 'text-blue-600'
    },
    {
      label: language === 'ta' ? 'பாடநெறிகள்' : 'Courses',
      value: '50+',
      color: 'text-green-600'
    },
    {
      label: language === 'ta' ? 'சமூகங்கள்' : 'Communities',
      value: '7',
      color: 'text-purple-600'
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => {}} // This will be handled by parent
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-16 left-0 z-40 w-64 h-full bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'lg:block' : 'hidden'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {language === 'ta' ? 'மெனு உள்ளம்' : 'Main Menu'}
              </h3>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="px-3 py-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {language === 'ta' ? 'விரைவான புள்ளிவிவரங்கள்' : 'Quick Stats'}
              </h3>
              <div className="space-y-3">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="px-3 py-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {language === 'ta' ? 'உதவி' : 'Help'}
              </h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {language === 'ta' ? 'எப்படி பயன்படுத்துவது' : 'How to Use'}
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {language === 'ta' ? '�டிக்கட்டு கேள்விகள்' : 'FAQs'}
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {language === 'ta' ? 'ஆதரவு' : 'Support'}
                </a>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>© 2024 College Finder</p>
              <p>{t('allRightsReserved')}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
