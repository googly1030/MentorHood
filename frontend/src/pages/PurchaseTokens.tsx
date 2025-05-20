import React, { useState, useEffect } from 'react';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { ChevronLeft, ShoppingCart, Zap, AlertTriangle } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getUserData } from '../utils/auth';
import { API_URL } from '../utils/api';
import { toast, Toaster } from 'sonner';

// Token package types
export type TokenPackage = {
  id: string;
  name: string;
  tokens: number;
  price: number;
  popular?: boolean;
  description: string;
};

// Token data type from the API
interface TokenData {
  _id: string;
  userId: string;
  plan_id: string;
  plan_type: string;
  subscription_status: string;
  purchased_date: string;
  expiry_date: string;
  purchased_tokens: number;
  used_tokens: number;
  remaining_tokens: number;
  usage: {
    mentoring_sessions: {
      total: number;
      used: number;
      remaining: number;
    };
  };
  transactions: Array<{
    type: string;
    amount: number;
    description: string;
    timestamp: string;
  }>;
  created_at: string;
  last_updated: string;
}

const TokenPurchase: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user data for role check
  const userData = getUserData();
  
  // Updated token packages (removing savings percentage)
  const tokenPackages: TokenPackage[] = [
    {
      id: 'basic',
      name: 'Starter',
      tokens: 400,
      price: 299,
      description: 'Perfect for exploring mentorship with occasional sessions.',
    },
    {
      id: 'premium',
      name: 'Pro',
      tokens: 800,
      price: 699,
      popular: true, 
      description: 'Best value for dedicated learning and frequent guidance.',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tokens: 1100,
      price: 999,
      description: 'Complete solution for teams and intensive mentorship needs.',
    }
  ];

  // Fetch token data when component mounts
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!userData || !userData.userId) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/tokens/balance?user_id=${userData.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch token data');
        }
        
        const data = await response.json();
        setTokenData(data);
      } catch (err) {
        setError("Failed to load token data. Please try again later.");
        console.error("Error fetching token data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokenData();
  }, [userData?.userId]);

  const handlePackageSelect = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setCurrentStep(2);
  };
  
  const completeTransaction = async () => {
    if (selectedPackage && userData) {
      // Show loading toast
      const loadingToast = toast.loading('Processing your purchase...');
      
      try {
        const response = await fetch(`${API_URL}/tokens/add?user_id=${userData.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            amount: selectedPackage.tokens,
            description: `Purchased ${selectedPackage.name} token package`,
            plan_id: selectedPackage.id,
            plan_type: selectedPackage.name,
            extend_expiry: true,
            usage_type: "mentoring_sessions"
          }),
        });
        
        if (!response.ok) {
          throw new Error('Purchase failed');
        }
        
        // After successful purchase, fetch the updated token data
        const balanceResponse = await fetch(`${API_URL}/tokens/balance?user_id=${userData.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          credentials: 'include',
        });
        
        if (!balanceResponse.ok) {
          throw new Error('Failed to fetch updated token data');
        }
        
        const newTokenData = await balanceResponse.json();
        setTokenData(newTokenData);
        
        toast.success('Tokens purchased successfully!', {
          id: loadingToast,
        });
        setCurrentStep(3);
      } catch (err) {
        toast.error('Purchase failed. Please try again.', {
          id: loadingToast,
        });
        console.error("Error purchasing tokens:", err);
      }
    }
  };
  
  const resetPurchase = () => {
    setSelectedPackage(null);
    setCurrentStep(1);
  };

  // Redirect if not a user role
  if (userData && userData.role !== 'user') {
    return <Navigate to="/mentee-dashboard" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600">Loading token information...</span>
      </div>
    );
  }

  // Show error state
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Error</h2>
          <p className="text-red-600 mb-6">
            {error || "You must be logged in as a mentee to access this page."}
          </p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Main content starts here
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" expand={true} richColors closeButton />
      
      {/* Improved header with integrated back button */}
      <div className="bg-indigo-600 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => navigate('/mentee-dashboard')} className="text-indigo-100 hover:text-white flex items-center">
                <ChevronLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white">Purchase Tokens</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
          <p className="mt-2 text-indigo-100 max-w-2xl mx-auto text-center">
            Buy tokens to book mentoring sessions with top industry experts. The more tokens you buy, the more you save.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress indicator */}
        {currentStep < 3 && (
          <div className="mb-10">
            {/* Step circles and connecting lines */}
            <div className="relative max-w-2xl mx-auto mb-5">
              {/* Progress bar background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full"></div>
              
              {/* Active progress bar */}
              <div 
                className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-indigo-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                }}
              ></div>
              
              {/* Step circles */}
              <div className="relative flex justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center h-10 w-10 rounded-full 
                    ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                    transition-all duration-300 shadow-sm z-10
                    ${currentStep > 1 ? 'ring-2 ring-indigo-100' : ''}
                  `}>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center h-10 w-10 rounded-full
                    ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                    transition-all duration-300 shadow-sm z-10
                    ${currentStep > 2 ? 'ring-2 ring-indigo-100' : ''}
                  `}>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center h-10 w-10 rounded-full
                    ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                    transition-all duration-300 shadow-sm z-10
                  `}>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step labels */}
            <div className="flex justify-between max-w-2xl mx-auto text-sm">
              <div className={`w-1/3 text-center ${currentStep === 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Select Package
              </div>
              <div className={`w-1/3 text-center ${currentStep === 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Payment
              </div>
              <div className={`w-1/3 text-center ${currentStep === 3 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Confirmation
              </div>
            </div>
          </div>
        )}

        {/* Current balance */}
        <div className="mb-8">
          {tokenData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Your Token Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-700 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    {tokenData.balance} 
                    <span className="text-sm ml-1 font-normal">tokens</span>
                  </p>
                  <p className="text-xs text-indigo-600 mt-2">
                    Lifetime access
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Purchased</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {tokenData.purchased}
                    <span className="text-sm ml-1 font-normal">tokens</span>
                  </p>
                  {tokenData.purchased > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Lifetime total
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Used Tokens</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {tokenData.used}
                    <span className="text-sm ml-1 font-normal">tokens</span>
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{width: `${tokenData.purchased > 0 ? (tokenData.used / tokenData.purchased * 100) : 0}%`}}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end">
                <button 
                  onClick={() => navigate('/tokens/history')}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
                >
                  View History
                  <ChevronLeft className="h-4 w-4 rotate-180 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Package Selection */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Token Package</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Select the token package that best fits your mentorship needs. More tokens mean more 1-on-1 time with experts.</p>
            </div>
            
            {/* Updated grid to 3 columns for large screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {tokenPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg ${pkg.popular ? 'ring-2 ring-blue-500' : 'border border-blue-100'}`}
                >
                  
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 tracking-wide">
                      BEST VALUE
                    </div>
                  )}
                  
                  <div className="bg-white h-full flex flex-col">
                    {/* Card header */}
                    <div className={`p-5 ${pkg.popular ? 'bg-blue-50' : 'bg-blue-25'}`}>
                      <h3 className="text-xl font-bold text-blue-900">{pkg.name}</h3>
                      <div className="flex items-baseline mt-2">
                        <span className="text-3xl font-bold text-blue-700">₹{pkg.price}</span>
                      </div>
                    </div>
                    
                    {/* Token count highlight */}
                    <div className="py-5 bg-white border-y border-blue-100">
                      <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                            <span className="text-xl font-bold text-blue-600">{pkg.tokens}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span className="text-lg font-medium text-gray-900">tokens</span>
                              <p className="text-sm text-blue-700 mt-1">
                                Value: <span className="font-semibold">₹{(pkg.price / pkg.tokens).toFixed(2)}</span>/token
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              {pkg.tokens >= 1000 ? 'High Value' : pkg.tokens >= 700 ? 'Good Value' : 'Standard'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card content */}
                    <div className="p-5 flex-grow flex flex-col">
                      <p className="text-blue-800 text-sm mb-4">{pkg.description}</p>
                      
                      {/* Benefits list */}
                      <ul className="space-y-2 flex-grow">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-blue-800">
                            {pkg.id === 'basic' && 'Access to emerging mentors'}
                            {pkg.id === 'standard' && 'Access to all mentor levels'}
                            {pkg.id === 'premium' && 'Priority booking with mentors'}
                            {pkg.id === 'enterprise' && 'VIP access to all mentors'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-blue-800">
                            {pkg.id === 'basic' && '3-5 mentoring sessions'}
                            {pkg.id === 'standard' && '5-10 mentoring sessions'}
                            {pkg.id === 'premium' && '10-15 mentoring sessions'}
                            {pkg.id === 'enterprise' && '15+ mentoring sessions'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-blue-800">Lifetime access to tokens</span>
                        </li>
                      </ul>
                      
                      {/* Action button */}
                      <button
                        onClick={() => handlePackageSelect(pkg)}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-4 transition-all duration-200 ${
                          pkg.popular 
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        Select Package
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Updated Token Value Calculator section */}
            <div className="mt-10 bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-indigo-500" />
                Mentor Experience Level Token Guide
              </h3>
              <p className="text-indigo-700 mb-4">
                Average token costs vary based on mentor experience level:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <h4 className="font-medium text-indigo-900 mb-2">Emerging Mentors</h4>
                  <p className="text-indigo-800 text-2xl font-bold mb-1">300-500 tokens</p>
                  <p className="text-gray-500 text-sm">Mentors with 2-5 years of experience</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <h4 className="font-medium text-indigo-900 mb-2">Experienced Professionals</h4>
                  <p className="text-indigo-800 text-2xl font-bold mb-1">700 - 900 tokens</p>
                  <p className="text-gray-500 text-sm">Mentors with 5-10 years of experience</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <h4 className="font-medium text-indigo-900 mb-2">Industry Leaders</h4>
                  <p className="text-indigo-800 text-2xl font-bold mb-1">1000 - 1300 tokens</p>
                  <p className="text-gray-500 text-sm">Senior mentors with 10+ years of experience</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 2 && selectedPackage && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                You're purchasing the {selectedPackage.name} package ({selectedPackage.tokens} tokens).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <PaymentMethodSelector />
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="flex justify-between mb-2 pb-2 border-b border-gray-100">
                    <span className="text-gray-600">{selectedPackage.name} Package</span>
                    <span className="text-gray-900 font-medium">₹{selectedPackage.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2 pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Tokens</span>
                    <span className="text-gray-900 font-medium">{selectedPackage.tokens}</span>
                  </div>
                  
                  <div className="flex justify-between mt-4 mb-6">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-indigo-700 font-bold text-xl">₹{selectedPackage.price.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={completeTransaction}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Complete Purchase
                  </button>
                  
                  <button
                    onClick={resetPurchase}
                    className="w-full mt-3 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 border border-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && tokenData && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
              <p className="text-gray-600 mb-8">
                Your tokens have been added to your account. You can now use them to book mentoring sessions.
              </p>
              

              <div className="bg-indigo-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-indigo-900 mb-4">Updated Token Balance</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Available Tokens:</span>
                  <span className="text-2xl font-bold text-indigo-700">{tokenData.balance || 0}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                 to="/mentee-dashboard"
                  className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/mentors"
                  className="bg-white text-indigo-600 py-2 px-6 rounded-md hover:bg-indigo-50 border border-indigo-200 font-medium"
                >
                  Browse Mentors
                </Link>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={resetPurchase}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Buy more tokens
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPurchase;