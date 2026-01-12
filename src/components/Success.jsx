// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// const Success = () => {
//   const { search } = useLocation();
//   const navigate = useNavigate();
//   const sessionId = new URLSearchParams(search).get('session_id');
//   const [countdown, setCountdown] = useState(3);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           navigate('/subscription');
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
//             Subscription Activated!
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Congratulations! Your subscription has been successfully activated.
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

// export default Success;









// working code

// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';

// const Success = () => {
//   const { search } = useLocation();
//   const navigate = useNavigate();
//   const sessionId = new URLSearchParams(search).get('session_id');
//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   const [countdown, setCountdown] = useState(3);
//   const [verified, setVerified] = useState(false);
//   const [isPending, setIsPending] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const pollIntervalRef = useRef(null);

//   const verifySession = async (showToast = true) => {
//     if (!sessionId) {
//       setErrorMessage('Invalid session ID');
//       if (showToast) toast.error('Invalid session ID');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/subscription/verify-session?session_id=${sessionId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       const data = await response.json();

//       if (response.ok && data.status === 'success') {
//         setVerified(true);
//         setIsPending(false);
//         if (showToast) toast.success('Subscription activated successfully!');
//       } else if (data.status === 'pending') {
//         setIsPending(true);
//         setVerified(false);
//       } else {
//         // Handle errors including duplicate subscription (409)
//         let msg = data.message || 'Failed to verify session';
//         if (response.status === 409) {
//           msg = data.message || 'You are already subscribed to this plan.';
//         }
//         setErrorMessage(msg);
//         setVerified(false);
//         setIsPending(false);
//         if (showToast) toast.error(msg);
//       }
//     } catch (err) {
//       setErrorMessage('Network error. Please try again.');
//       setVerified(false);
//       setIsPending(false);
//       if (showToast) toast.error('Verification failed. Please try again.');
//     }
//   };

//   useEffect(() => {
//     verifySession(true);

//     // Poll every 4 seconds if still pending
//     pollIntervalRef.current = setInterval(() => {
//       if (isPending || !verified) {
//         verifySession(false); // Don't spam toasts
//       }
//     }, 4000);

//     return () => {
//       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//     };
//   }, [sessionId, isPending, verified]);

//   useEffect(() => {
//     if (verified) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             navigate('/subscription'); // Keep your original redirect
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [verified, navigate]);

//   // Error state
//   if (errorMessage) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
//         <div className="bg-white p-6 md:p-8 rounded shadow-lg w-full max-w-md text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             Verification Failed
//           </h2>
//           <p className="text-gray-600 mb-4">{errorMessage}</p>
//           <button
//             onClick={() => navigate('/subscription')}
//             className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//           >
//             Back to Plans
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Pending or initial verifying state
//   if (!verified) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
//         <div className="bg-white p-6 md:p-8 rounded shadow-lg w-full max-w-md text-center">
//           <div className="flex justify-center mb-4">
//             <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//           <p className="text-gray-600">
//             {isPending ? 'Processing your subscription...' : 'Verifying your subscription...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Success state - EXACT SAME DESIGN AS YOUR ORIGINAL
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
//       <div className="bg-white p-6 md:p-8 rounded shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
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
//             Subscription Activated!
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Congratulations! Your subscription has been successfully activated.
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

// export default Success;










// update code
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(search).get('session_id');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [status, setStatus] = useState('processing'); // processing | success | error | timeout
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const pollIntervalRef = useRef(null);
  const maxAttemptsRef = useRef(15); // ~1 minute (4s × 15)

  const verifySession = async (silent = false) => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Invalid session ID');
      if (!silent) toast.error('Invalid session ID');
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/subscription/verify-session?session_id=${sessionId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setStatus('success');
        if (!silent) toast.success('Subscription activated successfully!');
        return true;
      } else if (data.status === 'pending') {
        setStatus('processing');
        return false;
      } else {
        setStatus('error');
        const msg = data.message || 'Failed to verify session';
        setErrorMessage(msg);
        if (!silent) toast.error(msg);
        return false;
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
      if (!silent) toast.error('Verification failed');
      return false;
    }
  };

  useEffect(() => {
    let attempts = 0;

    const poll = async () => {
      attempts++;
      const success = await verifySession(attempts > 1); // silent after first

      if (success) {
        clearInterval(pollIntervalRef.current);
        return;
      }

      if (attempts >= maxAttemptsRef.current) {
        clearInterval(pollIntervalRef.current);
        setStatus('timeout');
        toast.warn('Subscription is taking longer than expected. Please check your dashboard.');
      }
    };

    poll(); // First call immediately
    pollIntervalRef.current = setInterval(poll, 4000);

    return () => clearInterval(pollIntervalRef.current);
  }, [sessionId]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/subscription');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  // UI Rendering
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <div className="bg-white p-8 rounded shadow-xl max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/subscription')}
            className="px-8 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="bg-white p-8 rounded shadow-xl max-w-md text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Taking longer than expected</h2>
          <p className="text-gray-600 mb-6">
            Your subscription is being processed. Please check your dashboard or try again later.
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="px-8 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="bg-white p-8 rounded shadow-2xl max-w-md text-center transform transition-all hover:scale-105">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Success!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your subscription has been activated.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-gray-700 font-medium">
              Redirecting in <span className="font-bold text-indigo-600">{countdown}</span> seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: Processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white p-10 rounded shadow-2xl max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Processing your subscription...</h2>
        <p className="text-gray-600">This may take a few moments. Please wait.</p>
      </div>
    </div>
  );
};

export default Success;