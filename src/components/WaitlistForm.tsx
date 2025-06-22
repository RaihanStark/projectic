'use client';

import { useState } from 'react';

type WaitlistFormProps = {
  variant?: 'light' | 'dark';
};

export const WaitlistForm = ({ variant = 'light' }: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Failed to join waitlist. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = variant === 'dark';

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={`flex-1 px-4 py-3 text-base rounded-lg border-2 transition-all duration-200 ${
              isDark
                ? 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-md"
          >
            {isLoading ? 'Joining...' : 'Join Waitlist'}
          </button>
        </div>

        {message && (
          <div className={`text-center text-sm font-medium ${
            isSuccess
              ? isDark ? 'text-green-400' : 'text-green-600'
              : isDark ? 'text-red-400' : 'text-red-600'
          }`}
          >
            {message}
          </div>
        )}
      </form>

      <p className={`text-center text-sm mt-3 ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}
      >
        Be the first to know when we launch! 🚀
      </p>
    </div>
  );
};
