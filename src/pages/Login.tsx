import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { setUserData } from '../utils/auth';
import { toast, Toaster } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadingToastId = toast.loading('Signing in...', {
      duration: Infinity,
    });
    
    try {
      const response = await fetch('http://localhost:9000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToastId);
        toast.error('Invalid credentials', {
          description: 'Please check your email and password and try again',
          duration: 4000,
        });
        return;
      }

      setUserData({
        username: data.username,
        email: data.email,
        role: data.role,
        token: data.id, // Using the user ID as token
      });

      toast.dismiss(loadingToastId);
      toast.success('Welcome back!', {
        description: 'Successfully signed in to your account',
        duration: 3000,
      });
      navigate('/');
    } catch {
      toast.dismiss(loadingToastId);
      toast.error('Network error', {
        description: 'Please check your connection and try again',
        duration: 4000,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Toaster
        position="top-center"
        expand={true}
        richColors
        closeButton
        theme="system"
      />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your mentorship journey
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="font-medium text-[#4937e8] hover:text-[#4338ca] transition-colors duration-200"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;