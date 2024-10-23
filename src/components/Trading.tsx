import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import type { CryptoPrice } from '../types';

const mockPriceData = [
  { timestamp: '00:00', price: 45000 },
  { timestamp: '04:00', price: 46000 },
  { timestamp: '08:00', price: 44000 },
  { timestamp: '12:00', price: 47000 },
  { timestamp: '16:00', price: 45500 },
  { timestamp: '20:00', price: 46500 },
  { timestamp: '24:00', price: 46800 }
];

const Trading: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 45000,
      price_change_percentage_24h: 2.5
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3200,
      price_change_percentage_24h: -1.2
    }
  ]);

  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement trade logic here
    setAmount('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trading</h2>
        <button className="text-blue-500 hover:text-blue-600">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {prices.map((crypto) => (
          <div
            key={crypto.id}
            className={`p-4 rounded-lg cursor-pointer ${
              selectedCrypto === crypto.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
            }`}
            onClick={() => setSelectedCrypto(crypto.id)}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{crypto.name}</span>
              <span className="text-lg font-bold">${crypto.current_price.toLocaleString()}</span>
            </div>
            <div className="flex items-center mt-2">
              {crypto.price_change_percentage_24h >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                }
              >
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockPriceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <form onSubmit={handleTrade} className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded ${
              orderType === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setOrderType('buy')}
          >
            Buy
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded ${
              orderType === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setOrderType('sell')}
          >
            Sell
          </button>
        </div>

        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.toUpperCase()}
        </button>
      </form>
    </div>
  );
};

export default Trading;