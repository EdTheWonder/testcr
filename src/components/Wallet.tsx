import React, { useState } from 'react';
import { Wallet as WalletIcon, RefreshCw, Send } from 'lucide-react';
import type { WalletBalance } from '../types';

const Wallet: React.FC = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([
    { currency: 'BTC', balance: 0.5 },
    { currency: 'ETH', balance: 5.0 }
  ]);
  const [sendForm, setSendForm] = useState({
    currency: 'BTC',
    amount: 0,
    address: ''
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newBalances = balances.map(b => {
      if (b.currency === sendForm.currency) {
        return { ...b, balance: b.balance - sendForm.amount };
      }
      return b;
    });
    setBalances(newBalances);
    setSendForm({ currency: 'BTC', amount: 0, address: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <button className="text-blue-500 hover:text-blue-600">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {balances.map((balance) => (
          <div key={balance.currency} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WalletIcon className="w-6 h-6 mr-2 text-blue-500" />
                <span className="font-semibold">{balance.currency}</span>
              </div>
              <span className="text-lg font-bold">{balance.balance}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <h3 className="text-lg font-semibold">Send Crypto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="p-2 border rounded"
            value={sendForm.currency}
            onChange={(e) => setSendForm({ ...sendForm, currency: e.target.value })}
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            className="p-2 border rounded"
            value={sendForm.amount}
            onChange={(e) => setSendForm({ ...sendForm, amount: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Recipient Address"
            className="p-2 border rounded md:col-span-2"
            value={sendForm.address}
            onChange={(e) => setSendForm({ ...sendForm, address: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Send
        </button>
      </form>
    </div>
  );
};

export default Wallet;