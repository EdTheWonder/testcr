import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import WalletManager from './components/WalletManager';
import Trading from './components/Trading';
import { Coins } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);

  if (!session) {
    return (
      <>
        <Auth onAuth={setSession} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
      <Toaster position="top-right" />
      
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Coins className="w-8 h-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">CryptoLab</span>
            </div>
            <button
              onClick={() => setSession(null)}
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <WalletManager userId={session.user.id} />
          <Trading />
        </div>
      </main>
    </div>
  );
}

export default App;