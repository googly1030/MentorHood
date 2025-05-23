import React from 'react';
import { TokenPackage } from '../pages/TokenPurchase';

interface TokenPackageCardProps {
  package: TokenPackage;
  onSelect: () => void;
}

const TokenPackageCard: React.FC<TokenPackageCardProps> = ({ package: pkg, onSelect }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${pkg.popular ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
      {pkg.popular && (
        <div className="bg-indigo-600 text-white text-center py-1.5 text-sm font-medium rounded-t-lg">
          Most Popular
        </div>
      )}
      
      <div className={`p-6 ${!pkg.popular ? 'pt-8' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{pkg.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
        
        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold text-gray-900">₹{pkg.price}</span>
          {pkg.savings && (
            <span className="ml-2 text-sm font-medium text-green-600">Save {pkg.savings}%</span>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Tokens</span>
            <span className="text-lg font-bold text-indigo-700">{pkg.tokens}</span>
          </div>
        </div>
        
        <button
          onClick={onSelect}
          className="w-full py-2 px-4 rounded-lg font-medium transition-colors 
            bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Select Package
        </button>
      </div>
    </div>
  );
};

export default TokenPackageCard;