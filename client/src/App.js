import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';

// Page Components
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeDetail from './pages/CollegeDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Comparison from './pages/Comparison';
import Search from './pages/Search';
import Cutoffs from './pages/Cutoffs';
import Placements from './pages/Placements';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Context Hooks
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { language } = useLanguage();
  const { sidebarOpen, toggleSidebar } = useTheme();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ta' ? 'font-tamil' : ''}`} lang={language}>
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <div className="container mx-auto px-4 py-6">
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/colleges/:id" element={<CollegeDetail />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cutoffs" element={<Cutoffs />} />
                <Route path="/placements" element={<Placements />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
