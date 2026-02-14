import React, { createContext, useContext, useState, useEffect } from 'react';

// Language translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    colleges: 'Colleges',
    courses: 'Courses',
    comparison: 'Comparison',
    search: 'Search',
    cutoffs: 'Cutoffs',
    placements: 'Placements',
    about: 'About',
    contact: 'Contact',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    searchPlaceholder: 'Search colleges, courses...',
    filter: 'Filter',
    sort: 'Sort',
    compare: 'Compare',
    apply: 'Apply',
    reset: 'Reset',
    
    // College related
    collegeName: 'College Name',
    collegeType: 'College Type',
    district: 'District',
    establishmentYear: 'Establishment Year',
    tneaCode: 'TNEA Code',
    address: 'Address',
    contact: 'Contact',
    website: 'Website',
    accreditation: 'Accreditation',
    ranking: 'Ranking',
    courses: 'Courses',
    fees: 'Fees',
    placements: 'Placements',
    cutoff: 'Cutoff',
    
    // Communities
    oc: 'OC',
    bc: 'BC',
    bcm: 'BCM',
    mbc: 'MBC',
    sc: 'SC',
    sca: 'SCA',
    st: 'ST',
    
    // Messages
    noDataFound: 'No data found',
    selectCollegesToCompare: 'Select colleges to compare',
    maxCollegesForComparison: 'You can compare maximum 3 colleges at a time',
    
    // Forms
    marks: 'Marks',
    community: 'Community',
    category: 'Category',
    year: 'Year',
    round: 'Round',
    
    // Stats
    averagePackage: 'Average Package',
    highestPackage: 'Highest Package',
    placementPercentage: 'Placement %',
    totalStudents: 'Total Students',
    faculty: 'Faculty',
    
    // Footer
    allRightsReserved: 'All rights reserved',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service'
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    colleges: 'கல்லூரிகள்',
    courses: 'பாடநெறிகள்',
    comparison: 'ஒப்பீடு',
    search: 'தேடல்',
    cutoffs: 'கட்டாஃப்',
    placements: 'வேலைவாய்ப்பு',
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்புக்கு',
    
    // Common
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    save: 'சேமி',
    cancel: 'ரத்து',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    view: 'பார்',
    searchPlaceholder: 'கல்லூரிகள், பாடநெறிகளைத் தேடு...',
    filter: 'வடிகட்டு',
    sort: 'வரிசைப்படுத்து',
    compare: 'ஒப்பிடு',
    apply: 'பயன்படுத்து',
    reset: 'மீட்டமை',
    
    // College related
    collegeName: 'கல்லூரி பெயர்',
    collegeType: 'கல்லூரி வகை',
    district: 'மாவட்டம்',
    establishmentYear: 'நிறுவன ஆண்டு',
    tneaCode: 'TNEA குறியீடு',
    address: 'முகவரி',
    contact: 'தொடர்பு',
    website: 'இணையதளம்',
    accreditation: 'அங்கீகாரம்',
    ranking: 'தரவரிசை',
    courses: 'பாடநெறிகள்',
    fees: 'கட்டணம்',
    placements: 'வேலைவாய்ப்பு',
    cutoff: 'கட்டாஃப்',
    
    // Communities
    oc: 'OC',
    bc: 'BC',
    bcm: 'BCM',
    mbc: 'MBC',
    sc: 'SC',
    sca: 'SCA',
    st: 'ST',
    
    // Messages
    noDataFound: 'தகவல் கிடைக்கவில்லை',
    selectCollegesToCompare: 'ஒப்பிட கல்லூரிகளைத் தேர்ந்தெடுக்கவும்',
    maxCollegesForComparison: 'ஒரே நேரத்தில் அதிகபட்சம் 3 கல்லூரிகளை மட்டுமே ஒப்பிட முடியும்',
    
    // Forms
    marks: 'மதிப்பெண்கள்',
    community: 'சமூகம்',
    category: 'வகை',
    year: 'ஆண்டு',
    round: 'சுற்று',
    
    // Stats
    averagePackage: 'சராசரி ஊதியம்',
    highestPackage: 'அதிகபட்ச ஊதியம்',
    placementPercentage: 'வேலைவாய்ப்பு %',
    totalStudents: 'மொத்த மாணவர்கள்',
    faculty: 'ஆசிரியர்கள்',
    
    // Footer
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    changeLanguage,
    t,
    isTamil: language === 'ta',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
