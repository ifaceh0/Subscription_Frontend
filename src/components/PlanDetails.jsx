// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { CheckCircle, ArrowLeft } from 'lucide-react';
// import { motion } from 'framer-motion';

// const PlanDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [subscribed, setSubscribed] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   if (!state || !state.planId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
//         >
//           <p className="text-2xl text-blue-600 font-semibold mb-6 flex items-center justify-center gap-2">
//             <span>⚠️</span> No subscription details found
//           </p>
//           <button
//             onClick={() => navigate('/')}
//             className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Go Back to Plans
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   const { planId, planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSubscribed(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch('https://subscription-backend-e8gq.onrender.com/api/subscription/create-checkout-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           planId,
//           autoRenew: true,
//           cancelAtPeriodEnd: false,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create checkout session');
//       }

//       setSubscribed(true);
//       setTimeout(() => {
//         window.location.href = data.checkoutUrl;
//       }, 1500);
//     } catch (err) {
//       console.error('Checkout error:', err);
//       setError(err.message || 'Failed to initiate checkout. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-6 py-12">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-auto"
//       >
//         <nav className="bg-blue-600 p-4 w-full flex justify-between items-center rounded-t-lg">
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 text-white transition-all duration-200 font-medium"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h2 className="text-2xl font-bold text-white">{planTitle} Plan</h2>
//           <div></div> {/* Placeholder for symmetry */}
//         </nav>
//         <div className="p-8"> {/* Moved padding inside a new div */}
//           <div className="text-center text-gray-600 mb-6">
//             <div className="flex flex-col md:flex-row justify-center gap-2 text-sm font-medium text-gray-500">
//               <span>
//                 Billing Type :{' '}
//                 <strong className="text-blue-600">
//                   {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}
//                 </strong>
//               </span>
//               <span>
//                 Application :{' '}
//                 <strong className="text-blue-600">{selectedTypes.join(', ')}</strong>
//               </span>
//               {discountPercent > 0 && (
//                 <span>
//                   Discount :{' '}
//                   <strong className="text-green-600">{discountPercent}%</strong>
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="text-center text-4xl font-bold text-gray-900 mb-8">
//             {price}
//           </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-left">
//               What’s Included
//             </h3>
//             <ul className="space-y-2 text-gray-700">
//               {features.map((feature, i) => (
//                 <li key={i} className="flex items-start gap-2 text-left">
//                   <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
//                   <span className="text-base">{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <label className="block">
//               <span className="text-gray-800 font-medium">Enter Your Email</span>
//               <input
//                 type="email"
//                 required
//                 pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setSubscribed(false);
//                   setError(null);
//                 }}
//                 className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="you@example.com"
//               />
//             </label>

//             {error && (
//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-red-600 font-medium text-center"
//               >
//                 {error}
//               </motion.p>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1 ${
//                 isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
//               }`}
//             >
//               {isLoading ? 'Processing...' : 'Confirm Subscription'}
//             </button>
//           </form>

//           {(subscribed || isLoading) && (
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="text-green-600 mt-6 font-medium text-center flex items-center justify-center gap-2"
//             >
//               <CheckCircle className="w-5 h-5" />
//               Redirecting to payment page...
//             </motion.p>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PlanDetails;












//new
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { CheckCircle, ArrowLeft } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';

// const PlanDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   const [email, setEmail] = useState('');
//   const [subscribed, setSubscribed] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   if (!state || !state.planId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
//         >
//           <p className="text-2xl text-blue-600 font-semibold mb-6 flex items-center justify-center gap-2">
//             <span>⚠️</span> No subscription details found
//           </p>
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
//             aria-label="Go back to plans"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Go Back to Plans
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   const { planId, planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSubscribed(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/subscription/create-checkout-session`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           planId,
//           appNames: selectedTypes,
//           interval: billingCycle,
//           autoRenew: true,
//           cancelAtPeriodEnd: false,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || `HTTP error! Status: ${response.status}`);
//       }

//       setSubscribed(true);
//       toast.success('Checkout session created! Redirecting...');
//       setTimeout(() => {
//         window.location.href = data.checkoutUrl;
//       }, 1500);
//     } catch (err) {
//       console.error('Checkout error:', err);
//       setError(err.message || 'Failed to initiate checkout. Please try again.');
//       toast.error(err.message || 'Failed to initiate checkout.');
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-6 py-12">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-auto"
//       >
//         <nav className="bg-blue-600 p-4 w-full flex justify-between items-center rounded-t-lg">
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 text-white transition-all duration-200 font-medium"
//             aria-label="Go back to subscription plans"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h2 className="text-2xl font-bold text-white">{planTitle} Plan</h2>
//           <div></div>
//         </nav>
//         <div className="p-8">
//           <div className="text-center text-gray-600 mb-6">
//             <div className="flex flex-col md:flex-row justify-center gap-2 text-sm font-medium text-gray-500">
//               <span>
//                 Billing Type:{' '}
//                 <strong className="text-blue-600">
//                   {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}
//                 </strong>
//               </span>
//               <span>
//                 Application:{' '}
//                 <strong className="text-blue-600">{selectedTypes.join(', ')}</strong>
//               </span>
//               {discountPercent > 0 && (
//                 <span>
//                   Discount:{' '}
//                   <strong className="text-green-600">{discountPercent}%</strong>
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="text-center text-4xl font-bold text-gray-900 mb-8">
//             {price}
//           </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-left">
//               What’s Included
//             </h3>
//             <ul className="space-y-2 text-gray-700">
//               {features.map((feature, i) => (
//                 <li key={i} className="flex items-start gap-2 text-left">
//                   <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
//                   <span className="text-base">{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <label className="block">
//               <span className="text-gray-800 font-medium">Enter Your Email</span>
//               <input
//                 type="email"
//                 required
//                 pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setSubscribed(false);
//                   setError(null);
//                 }}
//                 className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="you@example.com"
//                 aria-required="true"
//                 aria-invalid={error ? 'true' : 'false'}
//               />
//               {error && (
//                 <p className="text-red-600 text-sm mt-1" role="alert">
//                   {error}
//                 </p>
//               )}
//             </label>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1 ${
//                 isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
//               }`}
//               aria-label="Confirm subscription"
//             >
//               {isLoading ? 'Processing...' : 'Confirm Subscription'}
//             </button>
//           </form>

//           {(subscribed || isLoading) && (
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="text-green-600 mt-6 font-medium text-center flex items-center justify-center gap-2"
//               role="status"
//             >
//               <CheckCircle className="w-5 h-5" />
//               Redirecting to payment page...
//             </motion.p>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PlanDetails;









import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, Loader2, DollarSign, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const PlanDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!state || !state.planId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full text-center border-t-4 border-purple-500"
        >
          <p className="text-2xl text-purple-600 font-semibold mb-6 flex items-center justify-center gap-2">
            <span>⚠️</span> Session Expired or Invalid Plan
          </p>
          <p className="text-gray-600 mb-6">
            The plan details could not be loaded. Please return to the pricing page.
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg"
            aria-label="Go back to plans"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back to Plans
          </button>
        </motion.div>
      </div>
    );
  }

  const { planId, planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

  const numericPrice = parseFloat(price?.replace(/[^0-9.]/g, '') || 0);
  const pricePerInterval = billingCycle === 'year' ? `(${(numericPrice / 12).toFixed(2)} / mo)` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubscribed(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/subscription/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          planId,
          appNames: selectedTypes,
          interval: billingCycle,
          autoRenew: true,
          cancelAtPeriodEnd: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      setSubscribed(true);
      toast.success('Checkout session created! Redirecting...');
      setTimeout(() => {
        window.location.href = data.checkoutUrl;
      }, 1500);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate checkout. Please try again.');
      toast.error(err.message || 'Failed to initiate checkout.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-6 py-12 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden border border-slate-700"
      >
        <nav className="bg-purple-600 dark:bg-purple-700 p-4 w-full flex justify-between items-center">
          <button
            onClick={() => navigate('/subscription')}
            className="inline-flex items-center gap-2 text-white hover:text-purple-100 transition-all duration-200 font-medium"
            aria-label="Go back to subscription plans"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Checkout</h2>
          <div></div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 lg:p-10 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
            <div className="space-y-8">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-purple-200 dark:border-purple-600"
              >
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {planTitle} Plan
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                  Billed {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}
                </p>
              </motion.div>

              <div className="text-center">
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  {price}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {pricePerInterval && `Equivalent to ${pricePerInterval}`}
                  {discountPercent > 0 && (
                    <span className="ml-2 font-bold text-green-600">
                      ({discountPercent}% Savings)
                    </span>
                  )}
                </p>
                <p className="text-sm mt-3 text-purple-600 dark:text-purple-400 font-medium capitalize">
                  Applications: {selectedTypes.join(', ')}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700">
                  Key Features
                </h4>
                <ul className="space-y-3 text-gray-700 dark:text-slate-300">
                  {features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                      <span className="text-base">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-8">
              You are subscribing to Plan ID: <strong>{planId}</strong>. Secure checkout processed via our payment partner.
            </p>
          </div>

          <div className="p-8 lg:p-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Your Subscription
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="text-gray-800 dark:text-slate-200 font-medium block mb-2">Billing Email</span>
                <input
                  type="email"
                  required
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubscribed(false);
                    setError(null);
                  }}
                  className="mt-1 w-full p-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="your-secure-email@company.com"
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2" role="alert">
                    {error}
                  </p>
                )}
              </label>

              <button
                type="submit"
                disabled={isLoading || subscribed}
                className={`w-full text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-[1.01] ${
                  isLoading || subscribed
                    ? 'bg-purple-400 dark:bg-purple-800 opacity-80 cursor-not-allowed'
                    : 'bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600'
                }`}
                aria-label="Confirm subscription and proceed to payment"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Checkout...
                    </motion.span>
                  ) : (
                    <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      Pay {price} Now
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {(subscribed || isLoading) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 p-4 rounded-xl text-center mt-6"
                  >
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Redirecting to secure payment...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanDetails;