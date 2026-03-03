import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function EnterCompanyEmail() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if email already exists in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('CompanyEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setTimeout(() => {
      localStorage.setItem('CompanyEmail', email.trim().toLowerCase());
      
      setIsLoading(false);
      
      navigate('/subscription-dashboard'); 
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md hover:shadow-xl p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <Mail className="h-8 w-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Company Email
          </h1>
          <p className="text-gray-600">
            Enter your company email to access the subscription dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="name@yourcompany.com"
                className={`w-full px-4 py-3 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all`}
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-full shadow-sm text-white font-medium
              ${isLoading || !email.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'
              } transition-all`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer hint */}
        <p className="mt-6 text-center text-sm text-gray-500">
          We'll use this email to show your company's subscription details
        </p>
      </div>
    </div>
  );
}