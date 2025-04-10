import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, removeUserData } from '../utils/auth';
import { User } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userData = getUserData();

  const handleLogout = () => {
    removeUserData();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white/90 sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <h1 
          onClick={() => navigate('/')} 
          className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent hover:from-[#4338ca] hover:to-[#4937e8] transition-all duration-300 cursor-pointer"
        >
          Mentor<span className="text-black">Hood</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {userData ? (
          <>
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="text-gray-800 font-medium">
                {userData.username}
              </span>
            </div>
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
    </nav>
  );
};

export default Header;