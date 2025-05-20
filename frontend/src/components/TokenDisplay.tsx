import { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';
import { getUserData } from '../utils/auth';
import { Coins } from 'lucide-react';
import { toast } from 'sonner';

interface TokenDisplayProps {
  className?: string;
  showBalance?: boolean;
  onClick?: () => void;  // Add this line
  showWarning?: boolean;
  warningThreshold?: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  className = '', 
  showBalance = true,
  onClick,  
}) => {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const userData = getUserData();

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!userData || !userData.userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/tokens/balance?user_id=${userData.userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token balance');
        }

        const data = await response.json();
        setTokenBalance(data.balance);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        // Don't show error toast if it's just that tokens haven't been initialized yet
        if (!(error instanceof Error && error.message.includes('404'))) {
          toast.error('Could not load token balance');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, [userData]);

  // Create a clickable div if onClick is provided
  const containerProps = onClick ? {
    onClick: onClick,
    role: "button",
    tabIndex: 0,
    className: `cursor-pointer ${className} hover:bg-amber-100 transition-colors`
  } : {
    className
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Coins size={16} className="text-amber-500" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!showBalance) {
    return (
      <div {...containerProps} className={`flex items-center gap-1 ${className}`}>
        <Coins size={16} className="text-amber-500" />
      </div>
    );
  }

  return (
    <div {...containerProps} className={`flex items-center gap-1 ${className}`}>
      <Coins size={16} className="text-amber-500" />
      <span className="text-sm font-medium">{tokenBalance !== null ? tokenBalance : 0} Tokens</span>
    </div>
  );
};

export default TokenDisplay;