import Link from 'next/link';
import { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setEmail('');
      setPassword('');
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 sm:px-8 py-6 sm:py-8 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Welcome Back!</h1>
          <p className="text-sm sm:text-base text-blue-100">Login to continue your journey</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-2 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm sm:text-base">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign Up
              </Link>
            </p>
            <Link href="/" className="inline-block mt-3 text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
