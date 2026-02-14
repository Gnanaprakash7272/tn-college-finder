import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ toggleSidebar }) => {
  const { t, language, changeLanguage, isTamil, isEnglish } = useLanguage();
  const { sidebarOpen } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navigation = [
    { name: t('home'), href: '/', current: location.pathname === '/' },
    { name: t('colleges'), href: '/colleges', current: location.pathname === '/colleges' },
    { name: t('courses'), href: '/courses', current: location.pathname === '/courses' },
    { name: t('comparison'), href: '/comparison', current: location.pathname === '/comparison' },
    { name: t('search'), href: '/search', current: location.pathname === '/search' },
    { name: t('cutoffs'), href: '/cutoffs', current: location.pathname === '/cutoffs' },
    { name: t('placements'), href: '/placements', current: location.pathname === '/placements' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    toggleSidebar();
                  } else {
                    setMobileMenuOpen(!mobileMenuOpen);
                  }
                }}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              
              <Link to="/" className="flex items-center space-x-3 ml-2 lg:ml-0">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ta' ? 'கல்லூரி தேடுபவர்' : 'College Finder'}
                  </h1>
                  <p className="text-xs text-gray-600">Tamil Nadu</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Language Toggle */}
              <div className="hidden sm:block">
                <button
                  onClick={() => changeLanguage(isTamil ? 'en' : 'ta')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>{isTamil ? 'EN' : 'தமிழ்'}</span>
                </button>
              </div>

              {/* Mobile Language Toggle */}
              <div className="sm:hidden">
                <button
                  onClick={() => changeLanguage(isTamil ? 'en' : 'ta')}
                  className="text-xs font-medium text-primary-600"
                >
                  {isTamil ? 'EN' : 'தமிழ்'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    item.current
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-lg"
            >
              <div className="container mx-auto px-4 py-6">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center space-x-4">
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="flex-1 px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-primary-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </form>
                
                {/* Quick Search Suggestions */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3">
                    {language === 'ta' ? 'விரைவான தேடல்கள்:' : 'Quick Searches:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['CSE', 'Anna University', 'Chennai', 'Government Colleges'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch(new Event('submit'));
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
