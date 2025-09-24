import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ChangeSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(search).get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/subscription-dashboard', {
            state: { successMessage: 'Plan changed successfully. You will receive a confirmation email soon.' },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Subscription changed!
          </h2>
          <p className="text-gray-600 mb-4">
            Your plan change has been scheduled and will take effect at the end of the current billing period.
          </p>
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600">
              Redirecting in <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeSuccess;