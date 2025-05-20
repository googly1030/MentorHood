import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';
import { getUserData } from '../utils/auth';
import { Coins, ArrowDownCircle, ArrowUpCircle, Calendar, ChevronLeft } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  usage_type?: string;
}

interface TokenData {
  balance: number;
  purchased: number;
  used: number;
  expiry_date: string;
  transactions: Transaction[];
  usage: Record<string, {
    total: number;
    used: number;
    remaining: number;
  }>;
  plan_type: string;
  subscription_status: string;
}

const TokenHistory = () => {
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const userData = getUserData();
  // Use a ref to track if we've already fetched the data
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched.current) return;
    
    const fetchTokenHistory = async () => {
      if (!userData || !userData.userId) {
        navigate('/login');
        return;
      }

      try {
        hasFetched.current = true; // Mark as fetched before the request
        const response = await fetch(`${API_URL}/tokens/balance?user_id=${userData.userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token history');
        }

        const data = await response.json();
        setTokenData(data);
      } catch (error) {
        console.error('Error fetching token history:', error);
        toast.error('Could not load token history');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenHistory();
  }, [userData?.userId, navigate]); // Add specific dependency instead of entire userData object

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTimeRemaining = (expiryDateString: string) => {
    const now = new Date();
    const expiryDate = new Date(expiryDateString);
    const diffTime = expiryDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Expired';
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} left`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-amber-500 animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading token history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/mentee-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Coins size={24} className="text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Your Token Balance</h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
              <span className="text-4xl font-bold text-gray-900">
                {tokenData?.balance || 0}
              </span>
              <div className="flex flex-col">
                <span className="text-gray-600">of {tokenData?.purchased || 0} purchased tokens</span>
                {tokenData?.expiry_date && (
                  <span className="text-sm text-gray-500">
                    {calculateTimeRemaining(tokenData.expiry_date)} | Expires {formatDate(tokenData.expiry_date)}
                  </span>
                )}
              </div>
            </div>

            {/* Usage summary */}
            {tokenData?.usage && (
              <div className="mt-6 pt-4 border-t border-amber-200/50">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Token Usage</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(tokenData.usage).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-xl p-4 border border-amber-100">
                      <h3 className="text-sm font-medium text-gray-700 capitalize mb-1">{key.replace('_', ' ')}</h3>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-bold">{value.remaining}</span>
                        <span className="text-sm text-gray-500">/ {value.total} tokens</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{width: `${(value.used / value.total * 100) || 0}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h2>
            
            {tokenData?.transactions && tokenData.transactions.length > 0 ? (
              <div className="space-y-4">
                {tokenData.transactions.map((transaction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === 'credit' ? (
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ArrowDownCircle size={20} className="text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-red-100 rounded-lg">
                          <ArrowUpCircle size={20} className="text-red-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>{formatDate(transaction.timestamp)}</span>
                          </div>
                          {transaction.usage_type && (
                            <div className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                              {transaction.usage_type}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No transaction history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenHistory;