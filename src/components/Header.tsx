import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

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
      <div className="flex gap-4">
        <button  onClick={() => navigate('/register')} className="nav-button bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition-all duration-300">
          Sign up
        </button>
        <button className="nav-button bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white hover:from-[#4338ca] hover:to-[#4937e8] transition-all duration-300">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Header;