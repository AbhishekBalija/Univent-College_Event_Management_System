import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform md:relative md:translate-x-0">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        
        <main className="flex-1 overflow-y-auto pt-2">
          <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;