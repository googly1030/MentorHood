import React from 'react';
import { Zap } from 'lucide-react';

interface TokenBalanceProps {
  tokens: number;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ tokens }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
          <Zap className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
          <div className="text-3xl font-bold text-gray-900">{tokens} tokens</div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">
          Use tokens to book mentoring sessions
        </p>
      </div>
    </div>
  );
};

export default TokenBalance;