import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, removeUserData } from '../utils/auth';
import { User, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    removeUserData();
    navigate('/');
  };

  const handleDashboardClick = () => {
    const userData = getUserData();
    if (userData?.role === 'mentor') {
      navigate('/mentor-dashboard');
    } else if (userData?.role === 'user') {
      navigate('/mentee-dashboard');
    }
    setIsMenuOpen(false);
  };

  const handleMyProfileClick = () => {
    if (userData?.userId) {
      navigate(`/profile/${userData.userId}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-white/90 sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <h1 
          onClick={() => navigate('/')} 
          className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent hover:from-[#4338ca] hover:to-[#4937e8] transition-all duration-300 cursor-pointer"
        >
          Mentor<span className="text-black">Hood</span>
        </h1>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {userData ? (
          <>
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="text-gray-800 font-medium">
                {userData.username}
              </span>
            </div>
            {userData.role === 'mentor' && (
              <button 
                onClick={handleMyProfileClick}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#4937e8] transition-all duration-300 rounded-lg hover:bg-gray-50"
              >
                <span className="font-medium">My Profile</span>
              </button>
            )}
            <button 
              onClick={handleDashboardClick}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#4937e8] transition-all duration-300 rounded-lg hover:bg-gray-50"
            >
              <span className="font-medium">Dashboard</span>
            </button>
            <button 
              onClick={handleLogout}
              className="nav-button bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/register')} 
              className="nav-button bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            >
              Sign up
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="nav-button bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white hover:from-[#4338ca] hover:to-[#4937e8] transition-all duration-300"
            >
              Login
            </button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Mobile Navigation Menu - Side Modal */}
          <div 
            className="fixed top-0 right-0 h-screen w-full bg-white shadow-2xl z-[9999] md:hidden transform transition-transform duration-300 ease-out"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                Mentor<span className="text-black">Hood</span> 
              </h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 flex flex-col h-[calc(100%-5rem)]">
              {userData ? (
                <>
                  {/* User Profile Section */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <span className="text-gray-800 font-medium block">
                          {userData.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {userData.role === 'mentor' ? 'Mentor' : 'Mentee'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {userData.role === 'mentor' && (
                      <button 
                        onClick={handleMyProfileClick}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:text-[#4937e8] transition-all duration-300 rounded-xl hover:bg-gray-50 flex items-center gap-3"
                      >
                        <User size={18} />
                        <span className="font-medium">My Profile</span>
                      </button>
                    )}
                    <button 
                      onClick={handleDashboardClick}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:text-[#4937e8] transition-all duration-300 rounded-xl hover:bg-gray-50 flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <span className="font-medium">Dashboard</span>
                    </button>
                  </div>

                  {/* Logout Button - Pushed to bottom */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }} 
                      className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      Create Account
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }} 
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white rounded-xl hover:from-[#4338ca] hover:to-[#4937e8] transition-all duration-300 font-medium shadow-sm"
                    >
                      Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Header;