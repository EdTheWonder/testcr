import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '../lib/supabase';
import { Wallet as WalletIcon, Copy, ExternalLink, RefreshCw, CreditCard, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import PaystackPop from '@paystack/inline-js';

interface WalletManagerProps {
  userId: string;
}

const WalletManager: React.FC<WalletManagerProps> = ({ userId }) => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [transferData, setTransferData] = useState({
    address: '',
    amount: '',
  });

  useEffect(() => {
    loadOrCreateWallet();
  }, [userId]);

  const loadOrCreateWallet = async () => {
    try {
      const { data: existingWallet } = await supabase
        .from('wallets')
        .select('encrypted_key')
        .eq('user_id', userId)
        .single();

      if (existingWallet) {
        const wallet = new ethers.Wallet(existingWallet.encrypted_key);
        setWallet(wallet);
      } else {
        const newWallet = ethers.Wallet.createRandom();
        await supabase.from('wallets').insert({
          user_id: userId,
          encrypted_key: newWallet.privateKey,
          address: newWallet.address,
        });
        setWallet(newWallet);
      }
    } catch (error) {
      toast.error('Error loading wallet');
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const { data: userData } = supabase.auth.getUser();
    const userEmail = userData?.user?.email || '';

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: 'pk_test_7db63dfb9063cc1415e69b1f03f96e590e5b18d4',
      email: userEmail,
      amount: amount * 100, // Convert to kobo
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'bank_transfer'],
      onSuccess: async (transaction: any) => {
        try {
          // Record the transaction in Supabase
          await supabase.from('transactions').insert({
            user_id: userId,
            amount: amount,
            type: 'deposit',
            reference: transaction.reference,
            status: 'completed'
          });

          // Update wallet balance
          const newBalance = (parseFloat(balance) + amount).toString();
          setBalance(newBalance);
          
          toast.success('Payment successful!');
          setShowDeposit(false);
          setDepositAmount('');
        } catch (error) {
          toast.error('Error processing payment');
        }
      },
      onCancel: () => {
        toast.error('Transaction cancelled');
      }
    });
  };

  const handleTransfer = async () => {
    if (!ethers.isAddress(transferData.address)) {
      toast.error('Invalid wallet address');
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > parseFloat(balance)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // Record the transfer in Supabase
      await supabase.from('transactions').insert({
        user_id: userId,
        amount: amount,
        type: 'transfer',
        recipient_address: transferData.address,
        status: 'pending'
      });

      // Update local balance
      const newBalance = (parseFloat(balance) - amount).toString();
      setBalance(newBalance);

      toast.success('Transfer initiated!');
      setShowTransfer(false);
      setTransferData({ address: '', amount: '' });
    } catch (error) {
      toast.error('Transfer failed');
    }
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Wallet</h2>
        <button
          onClick={() => loadOrCreateWallet()}
          className="text-blue-300 hover:text-blue-200"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {wallet && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WalletIcon className="w-6 h-6 text-blue-400" />
                <span className="text-white font-mono">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-blue-300" />
                </button>
                <a
                  href={`https://etherscan.io/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-blue-300" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Balance</span>
              <span className="text-white font-bold">{balance} ETH</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowDeposit(true)}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => setShowTransfer(true)}
              className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Transfer</span>
            </button>
          </div>

          {showDeposit && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Deposit Funds (NGN)</h3>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Amount in NGN"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleDeposit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                  >
                    Proceed with Payment
                  </button>
                  <button
                    onClick={() => setShowDeposit(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showTransfer && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Transfer Crypto</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={transferData.address}
                  onChange={(e) => setTransferData({ ...transferData, address: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200"
                />
                <input
                  type="number"
                  placeholder="Amount in ETH"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleTransfer}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setShowTransfer(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletManager;