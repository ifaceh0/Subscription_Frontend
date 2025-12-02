// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// const ChangeSuccess = () => {
//   const { search } = useLocation();
//   const navigate = useNavigate();
//   const sessionId = new URLSearchParams(search).get('session_id');
//   const [countdown, setCountdown] = useState(5);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           navigate('/subscription-dashboard', {
//             state: { successMessage: 'Plan changed successfully. You will receive a confirmation email soon.' },
//           });
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-10 h-10 text-green-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 ></path>
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             Subscription changed!
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Your plan change has been scheduled and will take effect at the end of the current billing period.
//           </p>
//           <div className="flex justify-center items-center space-x-3 mb-4">
//             <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
//             <p className="text-gray-600">
//               Redirecting in <span className="font-bold">{countdown}</span> seconds...
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangeSuccess;












import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const ChangeSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(search).get('session_id');
  const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';
  const [countdown, setCountdown] = useState(3);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('Invalid session ID.');
        toast.error('Invalid session ID.');
        setTimeout(() => navigate('/subscription-dashboard'), 2000);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/subscription/verify-session?session_id=${sessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to verify session.');
        }
        if (data.status === 'success') {
          setVerified(true);
          toast.success('Plan changed successfully!');
        } else {
          throw new Error(data.message || 'Session verification failed.');
        }
      } catch (err) {
        setError(`Session verification failed: ${err.message}`);
        toast.error(`Error: ${err.message}`);
        setTimeout(() => navigate('/subscription-dashboard'), 2000);
      }
    };

    verifySession();
  }, [sessionId, navigate]);

  useEffect(() => {
    if (verified) {
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
    }
  }, [verified, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50" role="alert" aria-live="assertive">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 md:p-8 rounded shadow-lg w-full max-w-md text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-600">
            Redirecting in <span className="font-bold">{countdown}</span> seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50" role="alert" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 md:p-8 rounded shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Subscription Changed!
          </h2>
          <p className="text-gray-600 mb-4">
            Your plan change has been scheduled and will take effect at the end of the current billing period.
          </p>
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
            <p className="text-gray-600">
              Redirecting in <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangeSuccess;