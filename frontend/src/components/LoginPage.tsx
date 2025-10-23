'use client';

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface LoginFormData {
  walletAddress: string;
  username?: string;
  email?: string;
}

export const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({ walletAddress: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const handleWalletConnect = () => {
    connect({ connector: injected() });
  };

  const registerUser = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          username: formData.username,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register user');
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      return data;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      // Update wallet address in form data
      setFormData(prev => ({ ...prev, walletAddress: address }));

      // Register user
      await registerUser(address);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('authToken');
    setSuccess(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Connect Wallet to Start</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center">
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            Successfully logged in!
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div>
          {!isConnected ? (
            <button
              onClick={handleWalletConnect}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-medium flex items-center justify-center"
            >
              Connect Wallet
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-300 mb-2">Connected Wallet:</p>
                <p className="text-white font-mono break-all">{address}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Username (Optional)</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg transition-colors font-medium ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                } text-white`}
              >
                {loading ? 'Processing...' : 'Register & Login'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default LoginPage;
