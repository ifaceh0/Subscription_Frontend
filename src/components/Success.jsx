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












import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(search).get('session_id');
  const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';
  const [countdown, setCountdown] = useState(3);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        toast.error('Invalid session ID');
        setTimeout(() => navigate('/subscription'), 2000);
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
          throw new Error(data.message || 'Failed to verify session');
        }
        setVerified(true);
        toast.success('Subscription activated successfully!');
      } catch (err) {
        toast.error(`Session verification failed: ${err.message}`);
        setTimeout(() => navigate('/subscription'), 2000);
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
            navigate('/subscription'); // Redirect to subscription page
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [verified, navigate]);

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
        <div className="bg-white p-6 md:p-8 rounded shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          <p className="text-gray-600">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
      <div className="bg-white p-6 md:p-8 rounded shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
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
            Subscription Activated!
          </h2>
          <p className="text-gray-600 mb-4">
            Congratulations! Your subscription has been successfully activated.
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

export default Success;
