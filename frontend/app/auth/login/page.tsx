'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Shield, Wifi, Zap, Network } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-dark-100 via-dark to-dark">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-primary/20 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-primary/50 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mb-6 shadow-lg">
              <Image
                src="/BCS_LOGO.webp"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Network Monitor</span>
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl animate-slide-up">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Sign in to access the monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-300 border border-gray-700 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your username"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-300 border border-gray-700 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white placeholder-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-fade-in">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 text-center border-t border-gray-800">
                <p className="text-xs text-gray-500">
                    <strong>Demo Credentials:</strong> Username:<span className="text-primary"> admin</span> Password: <span className="text-primary">admin123</span>
                </p>
            </div>
            </form>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-2">
                <Wifi size={18} className="text-primary" />
              </div>
              <p className="text-xs text-gray-500">Real-time</p>
              <p className="text-xs text-gray-600">Monitoring</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-2">
                <Zap size={18} className="text-primary" />
              </div>
              <p className="text-xs text-gray-500">Instant</p>
              <p className="text-xs text-gray-600">Alerts</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-2">
                <Network size={18} className="text-primary" />
              </div>
              <p className="text-xs text-gray-500">Device</p>
              <p className="text-xs text-gray-600">Analytics</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              &copy; 2026 Network Device Monitor. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
