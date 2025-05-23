import React, { useState } from 'react';
import { CreditCard, MessageSquare } from 'lucide-react';

const PaymentMethodSelector: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h3>
      
      <div className="flex gap-4 mb-6">
        <button
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            paymentMethod === 'card' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard className="h-5 w-5" />
          <span>Credit / Debit Card</span>
        </button>
        
        <button
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            paymentMethod === 'upi' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setPaymentMethod('upi')}
        >
          <MessageSquare className="h-5 w-5" />
          <span>UPI</span>
        </button>
      </div>
      
      {paymentMethod === 'card' ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={cardDetails.cardNumber}
              onChange={handleCardInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              placeholder="John Smith"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={cardDetails.cardName}
              onChange={handleCardInputChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={cardDetails.expiry}
                onChange={handleCardInputChange}
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={cardDetails.cvv}
                onChange={handleCardInputChange}
              />
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Your card information is encrypted and secure.
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            placeholder="name@upi"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <div className="mt-2 text-sm text-gray-500">
            Enter your UPI ID to make payment directly from your bank account.
          </div>
          
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="text-sm text-indigo-800">
              A payment request will be sent to your UPI app after you click "Complete Purchase".
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;