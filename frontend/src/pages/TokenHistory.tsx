import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';
import { getUserData } from '../utils/auth';
import { Coins, ArrowDownCircle, ArrowUpCircle, ChevronLeft, Filter, ArrowUpDown } from 'lucide-react';
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

// Group transactions by date
type GroupedTransactions = {
  [date: string]: Transaction[];
};

const TokenHistory = () => {
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactionsToShow, setTransactionsToShow] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const itemsPerPage =8;
  
  const userData = getUserData();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    
    const fetchTokenHistory = async () => {
      if (!userData || !userData.userId) {
        navigate('/login');
        return;
      }

      try {
        hasFetched.current = true;
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
  }, [userData?.userId, navigate]);

  // Effect to handle filtering and pagination
  useEffect(() => {
    if (!tokenData?.transactions) return;
    
    // Apply filters
    let filtered = [...tokenData.transactions];
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setTransactionsToShow(filtered);
  }, [tokenData, filter, sortOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupTransactionsByDate = (transactions: Transaction[]): GroupedTransactions => {
    return transactions.reduce((groups, transaction) => {
      const date = formatDate(transaction.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as GroupedTransactions);
  };

  // Get paginated data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactionsToShow.slice(startIndex, endIndex);
  };

  // Total pages for pagination
  const totalPages = transactionsToShow.length > 0 
    ? Math.ceil(transactionsToShow.length / itemsPerPage) 
    : 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading token history...</p>
        </div>
      </div>
    );
  }

  const groupedTransactions = groupTransactionsByDate(getCurrentPageData());

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
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Coins size={24} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Your Token Balance</h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
              <span className="text-4xl font-bold text-gray-900">
                {tokenData?.balance || 0} tokens
              </span>
            </div>

          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
              
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'credit' | 'debit')}
                    className="appearance-none bg-white border border-gray-200 rounded-lg py-2 px-3 pl-9 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All transactions</option>
                    <option value="credit">Credits only</option>
                    <option value="debit">Debits only</option>
                  </select>
                  <Filter size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <button 
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ArrowUpDown size={16} className="text-gray-400" />
                  {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
                </button>
              </div>
            </div>
            
            {transactionsToShow.length > 0 ? (
              <div>
                {/* Transactions grouped by date */}
                {Object.entries(groupedTransactions).map(([date, transactions]) => (
                  <div key={date} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-grow bg-gray-100"></div>
                      <h3 className="text-sm font-medium text-gray-500">{date}</h3>
                      <div className="h-px flex-grow bg-gray-100"></div>
                    </div>
                    
                    <div className="space-y-2">
                      {transactions.map((transaction, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
                              {transaction.type === 'credit' ? (
                                <ArrowDownCircle size={18} className="text-green-600" />
                              ) : (
                                <ArrowUpCircle size={18} className="text-red-600" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">{transaction.description}</p>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span>{formatTime(transaction.timestamp)}</span>
                                </div>
                                {transaction.usage_type && (
                                  <div className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                    {transaction.usage_type}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold text-sm ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
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