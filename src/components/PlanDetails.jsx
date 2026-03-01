// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { CheckCircle, ArrowLeft, Loader2, DollarSign, Zap } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
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
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded shadow-2xl p-10 max-w-md w-full text-center border-t-4 border-purple-500"
//         >
//           <p className="text-2xl text-purple-600 font-semibold mb-6 flex items-center justify-center gap-2">
//             <span>⚠️</span> Session Expired or Invalid Plan
//           </p>
//           <p className="text-gray-600 mb-6">
//             The plan details could not be loaded. Please return to the pricing page.
//           </p>
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg"
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

//   const numericPrice = parseFloat(price?.replace(/[^0-9.]/g, '') || 0);
//   const pricePerInterval = billingCycle === 'year' ? `(${(numericPrice / 12).toFixed(2)} / mo)` : '';

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSubscribed(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/subscription/create-checkout-session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
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
//         const backendError =
//         data?.error ||
//         data?.message ||
//         'Something went wrong while creating checkout session';

//       throw new Error(backendError);
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-6 py-12 transition-colors duration-500">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white dark:bg-slate-800 rounded shadow-2xl max-w-5xl w-full mx-auto overflow-hidden border border-slate-700"
//       >
//         <nav className="bg-purple-600 dark:bg-purple-700 p-4 w-full flex justify-between items-center">
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 text-white hover:text-purple-100 transition-all duration-200 font-medium"
//             aria-label="Go back to subscription plans"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h2 className="text-xl font-bold text-white uppercase tracking-wider">Checkout</h2>
//           <div></div>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-2">
//           <div className="p-8 lg:p-10 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
//             <div className="space-y-8">
//               <motion.div
//                 initial={{ scale: 0.95 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: 'spring', stiffness: 100 }}
//                 className="text-center p-6 bg-white dark:bg-slate-800 rounded shadow-lg border border-purple-200 dark:border-purple-600"
//               >
//                 <div className="flex items-center justify-center mb-3">
//                   <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
//                   {planTitle} Plan
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
//                   Billed {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}
//                 </p>
//               </motion.div>

//               <div className="text-center">
//                 <p className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1">
//                   <DollarSign className="w-8 h-8 text-green-500" />
//                   {price}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-slate-400">
//                   {pricePerInterval && `Equivalent to ${pricePerInterval}`}
//                   {discountPercent > 0 && (
//                     <span className="ml-2 font-bold text-green-600">
//                       ({discountPercent}% Savings)
//                     </span>
//                   )}
//                 </p>
//                 <p className="text-sm mt-3 text-purple-600 dark:text-purple-400 font-medium capitalize">
//                   Applications: {selectedTypes.join(', ')}
//                 </p>
//               </div>

//               <div>
//                 <h4 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-3 border-b pb-2 border-slate-200 dark:border-slate-700">
//                   Key Features
//                 </h4>
//                 <ul className="space-y-3 text-gray-700 dark:text-slate-300">
//                   {features.map((feature, i) => (
//                     <motion.li
//                       key={i}
//                       className="flex items-start gap-3"
//                       initial={{ x: -10, opacity: 0 }}
//                       animate={{ x: 0, opacity: 1 }}
//                       transition={{ duration: 0.2, delay: i * 0.05 }}
//                     >
//                       <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
//                       <span className="text-base">{feature}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-8">
//               You are subscribing to Plan ID: <strong>{planId}</strong>. Secure checkout processed via our payment partner.
//             </p>
//           </div>

//           <div className="p-8 lg:p-10">
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//               Complete Your Subscription
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <label className="block">
//                 <span className="text-gray-800 dark:text-slate-200 font-medium block mb-2">Billing Email</span>
//                 <input
//                   type="email"
//                   required
//                   pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setSubscribed(false);
//                     setError(null);
//                   }}
//                   className="mt-1 w-full p-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-inner"
//                   placeholder="your-secure-email@company.com"
//                   aria-required="true"
//                   aria-invalid={error ? 'true' : 'false'}
//                 />
//                 {error && (
//                   <p className="text-red-500 text-sm mt-2" role="alert">
//                     {error}
//                   </p>
//                 )}
//               </label>

//               <button
//                 type="submit"
//                 disabled={isLoading || subscribed}
//                 className={`w-full text-white px-6 py-3 rounded font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-[1.01] ${
//                   isLoading || subscribed
//                     ? 'bg-purple-400 dark:bg-purple-800 opacity-80 cursor-not-allowed'
//                     : 'bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600'
//                 }`}
//                 aria-label="Confirm subscription and proceed to payment"
//               >
//                 <AnimatePresence mode="wait">
//                   {isLoading ? (
//                     <motion.span
//                       key="loading"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="flex items-center justify-center gap-2"
//                     >
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Processing Checkout...
//                     </motion.span>
//                   ) : (
//                     <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                       Pay {price} Now
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </button>

//               <AnimatePresence>
//                 {(subscribed || isLoading) && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 p-4 rounded text-center mt-6"
//                   >
//                     <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
//                       <CheckCircle className="w-5 h-5" />
//                       Redirecting to secure payment...
//                     </p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </form>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PlanDetails;









// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { CheckCircle, ArrowLeft, Loader2, DollarSign, Zap, Banknote } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import { useLocation as useCountryLocation } from '../contexts/LocationContext';

// const PlanDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//    const { countryCode } = useCountryLocation();

//   const [email, setEmail] = useState('');
//   const [subscribed, setSubscribed] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   if (!state || !state.planId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded shadow-2xl p-10 max-w-md w-full text-center border-t-4 border-purple-500"
//         >
//           <p className="text-2xl text-purple-600 font-semibold mb-6 flex items-center justify-center gap-2">
//             <span>⚠️</span> Session Expired or Invalid Plan
//           </p>
//           <p className="text-gray-600 mb-6">
//             The plan details could not be loaded. Please return to the pricing page.
//           </p>
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg"
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

//   const numericPrice = parseFloat(price?.replace(/[^0-9.]/g, '') || 0);
//   const pricePerInterval = billingCycle === 'year' ? `(${(numericPrice / 12).toFixed(2)} / mo)` : '';

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
//           'X-User-Location': countryCode
//          },
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
//         const backendError =
//           data?.error ||
//           data?.message ||
//           'Something went wrong while creating checkout session';
//         throw new Error(backendError);
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto overflow-hidden border border-gray-200"
//       >
//         <nav className="bg-purple-600 p-4 w-full flex justify-between items-center">
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 text-white hover:text-purple-100 transition-all duration-200 font-medium"
//             aria-label="Go back to subscription plans"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h2 className="text-xl font-bold text-white uppercase tracking-wider">Checkout</h2>
//           <div></div>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-2">
//           {/* Left Side - Plan Summary */}
//           <div className="p-8 lg:p-10 bg-gray-50 flex flex-col justify-between">
//             <div className="space-y-8">
//               <motion.div
//                 initial={{ scale: 0.95 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: 'spring', stiffness: 100 }}
//                 className="text-center p-6 bg-white rounded-xl shadow-lg border border-purple-200"
//               >
//                 <div className="flex items-center justify-center mb-3">
//                   <Zap className="w-8 h-8 text-purple-600" />
//                 </div>
//                 <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
//                   {planTitle} Plan
//                 </h3>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Billed {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}ly
//                 </p>
//               </motion.div>

//               <div className="text-center">
//                 <p className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2 mb-1">
//                   <Banknote className="w-8 h-8 text-green-500" />
//                   {price}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {pricePerInterval && `Equivalent to ${pricePerInterval}`}
//                   {discountPercent > 0 && (
//                     <span className="ml-2 font-bold text-green-600">
//                       ({discountPercent}% Savings)
//                     </span>
//                   )}
//                 </p>
//                 <p className="text-sm mt-3 text-purple-600 font-medium capitalize">
//                   Applications: {selectedTypes.join(', ')}
//                 </p>
//               </div>

//               <div>
//                 <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 border-gray-200">
//                   Key Features
//                 </h4>
//                 <ul className="space-y-3 text-gray-700">
//                   {features.map((feature, i) => (
//                     <motion.li
//                       key={i}
//                       className="flex items-start gap-3"
//                       initial={{ x: -10, opacity: 0 }}
//                       animate={{ x: 0, opacity: 1 }}
//                       transition={{ duration: 0.2, delay: i * 0.05 }}
//                     >
//                       <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
//                       <span className="text-base">{feature}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <p className="text-xs text-center text-gray-500 mt-8">
//               You are subscribing to Plan ID: <strong>{planId}</strong>. Secure checkout processed via our payment partner.
//             </p>
//           </div>

//           {/* Right Side - Email Form */}
//           <div className="p-8 lg:p-10">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">
//               Complete Your Subscription
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <label className="block">
//                 <span className="text-gray-800 font-medium block mb-2">Billing Email</span>
//                 <input
//                   type="email"
//                   required
//                   pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setSubscribed(false);
//                     setError(null);
//                   }}
//                   className="mt-1 w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-inner"
//                   placeholder="your-secure-email@company.com"
//                   aria-required="true"
//                   aria-invalid={error ? 'true' : 'false'}
//                 />
//                 {error && (
//                   <p className="text-red-500 text-sm mt-2" role="alert">
//                     {error}
//                   </p>
//                 )}
//               </label>

//               <button
//                 type="submit"
//                 disabled={isLoading || subscribed}
//                 className={`w-full text-white px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-[1.01] ${
//                   isLoading || subscribed
//                     ? 'bg-purple-400 opacity-80 cursor-not-allowed'
//                     : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//                 aria-label="Confirm subscription and proceed to payment"
//               >
//                 <AnimatePresence mode="wait">
//                   {isLoading ? (
//                     <motion.span
//                       key="loading"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="flex items-center justify-center gap-2"
//                     >
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Processing Checkout...
//                     </motion.span>
//                   ) : (
//                     <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                       Pay {price} Now
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </button>

//               <AnimatePresence>
//                 {(subscribed || isLoading) && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="bg-emerald-50 border border-emerald-300 p-4 rounded text-center mt-6"
//                   >
//                     <p className="text-emerald-600 font-semibold flex items-center justify-center gap-2">
//                       <CheckCircle className="w-5 h-5" />
//                       Redirecting to secure payment...
//                     </p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </form>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PlanDetails;





//updated code for language translation
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, Loader2, DollarSign, Zap, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useLocation as useCountryLocation } from '../contexts/LocationContext';
import { useTranslation } from 'react-i18next';
import Header from './Header';   // ← Added import (adjust path if needed)

const PlanDetails = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const { countryCode } = useCountryLocation();

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
          className="bg-white rounded shadow-2xl p-10 max-w-md w-full text-center border-t-4 border-purple-500"
        >
          <p className="text-2xl text-purple-600 font-semibold mb-6 flex items-center justify-center gap-2">
            <span>⚠️</span> {t('planDetails.sessionExpired')}
          </p>
          <p className="text-gray-600 mb-6">
            {t('planDetails.invalidPlanMessage')}
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg"
            aria-label="Go back to plans"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('planDetails.goBackToPlans')}
          </button>
        </motion.div>
      </div>
    );
  }

  const { planId, planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

  const numericPrice = parseFloat(price?.replace(/[^0-9.]/g, '') || 0);
  const pricePerInterval = billingCycle === 'year' ? `(${(numericPrice / 12).toFixed(2)} / ${t('planDetails.mo')})` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubscribed(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/subscription/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Location': countryCode
         },
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
        const backendError =
          data?.error ||
          data?.message ||
          t('planDetails.somethingWentWrong');
        throw new Error(backendError);
      }

      setSubscribed(true);
      toast.success(t('planDetails.checkoutCreated'));
      setTimeout(() => {
        window.location.href = data.checkoutUrl;
      }, 1500);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || t('planDetails.failedToInitiate'));
      toast.error(err.message || t('planDetails.failedToInitiate'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto overflow-hidden border border-gray-200"
        >
          <nav className="bg-purple-600 p-4 w-full flex justify-between items-center">
            <button
              onClick={() => navigate('/subscription')}
              className="inline-flex items-center gap-2 text-white hover:text-purple-100 transition-all duration-200 font-medium"
              aria-label="Go back to subscription plans"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">{t('planDetails.checkout')}</h2>
            <div></div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Plan Summary */}
            <div className="p-8 lg:p-10 bg-gray-50 flex flex-col justify-between">
              <div className="space-y-8">
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="text-center p-6 bg-white rounded-xl shadow-lg border border-purple-200"
                >
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
                    {planTitle} {t('planDetails.plan')}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {t('planDetails.billed')} {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}{t('planDetails.ly')}
                  </p>
                </motion.div>

                <div className="text-center">
                  <p className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2 mb-1">
                    <Banknote className="w-8 h-8 text-green-500" />
                    {price}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pricePerInterval && `${t('planDetails.equivalentTo')} ${pricePerInterval}`}
                    {discountPercent > 0 && (
                      <span className="ml-2 font-bold text-green-600">
                        ({discountPercent}% {t('planDetails.savings')})
                      </span>
                    )}
                  </p>
                  <p className="text-sm mt-3 text-purple-600 font-medium capitalize">
                    {t('planDetails.applications')}: {selectedTypes.join(', ')}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 border-gray-200">
                    {t('planDetails.keyFeatures')}
                  </h4>
                  <ul className="space-y-3 text-gray-700">
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

              <p className="text-xs text-center text-gray-500 mt-8">
                {t('planDetails.youAreSubscribing')} <strong>{planId}</strong>. {t('planDetails.secureCheckout')}
              </p>
            </div>

            {/* Right Side - Email Form */}
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('planDetails.completeYourSubscription')}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block">
                  <span className="text-gray-800 font-medium block mb-2">{t('planDetails.billingEmail')}</span>
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
                    className="mt-1 w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-inner"
                    placeholder={t('planDetails.emailPlaceholder')}
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
                  className={`w-full text-white px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-[1.01] ${
                    isLoading || subscribed
                      ? 'bg-purple-400 opacity-80 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
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
                        {t('planDetails.processingCheckout')}
                      </motion.span>
                    ) : (
                      <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {t('planDetails.payNow', { price })}
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
                      className="bg-emerald-50 border border-emerald-300 p-4 rounded text-center mt-6"
                    >
                      <p className="text-emerald-600 font-semibold flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {t('planDetails.redirectingToPayment')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlanDetails;