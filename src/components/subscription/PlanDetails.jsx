// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { CheckCircle, ArrowLeft, Loader2, DollarSign, Zap, Banknote } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import { useLocation as useCountryLocation } from '../contexts/LocationContext';
// import { useTranslation } from 'react-i18next';
// import Header from './Header';

// const PlanDetails = () => {
//   const { t } = useTranslation();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const { countryCode } = useCountryLocation();

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
//             <span>⚠️</span> {t('planDetails.sessionExpired')}
//           </p>
//           <p className="text-gray-600 mb-6">
//             {t('planDetails.invalidPlanMessage')}
//           </p>
//           <button
//             onClick={() => navigate('/subscription')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg"
//             aria-label="Go back to plans"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             {t('planDetails.goBackToPlans')}
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   const { planId, planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

//   const numericPrice = parseFloat(price?.replace(/[^0-9.]/g, '') || 0);
//   const pricePerInterval = billingCycle === 'year' ? `(${(numericPrice / 12).toFixed(2)} / ${t('planDetails.mo')})` : '';

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
//           t('planDetails.somethingWentWrong');
//         throw new Error(backendError);
//       }

//       setSubscribed(true);
//       toast.success(t('planDetails.checkoutCreated'));
//       setTimeout(() => {
//         window.location.href = data.checkoutUrl;
//       }, 1500);
//     } catch (err) {
//       console.error('Checkout error:', err);
//       setError(err.message || t('planDetails.failedToInitiate'));
//       toast.error(err.message || t('planDetails.failedToInitiate'));
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="flex items-center justify-center px-6 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto overflow-hidden border border-gray-200"
//         >
//           <nav className="bg-purple-600 p-4 w-full flex justify-between items-center">
//             <button
//               onClick={() => navigate('/subscription')}
//               className="inline-flex items-center gap-2 text-white hover:text-purple-100 transition-all duration-200 font-medium"
//               aria-label="Go back to subscription plans"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h2 className="text-xl font-bold text-white uppercase tracking-wider">{t('planDetails.checkout')}</h2>
//             <div></div>
//           </nav>

//           <div className="grid grid-cols-1 lg:grid-cols-2">
//             {/* Left Side - Plan Summary */}
//             <div className="p-8 lg:p-10 bg-gray-50 flex flex-col justify-between">
//               <div className="space-y-8">
//                 <motion.div
//                   initial={{ scale: 0.95 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: 'spring', stiffness: 100 }}
//                   className="text-center p-6 bg-white rounded-xl shadow-lg border border-purple-200"
//                 >
//                   <div className="flex items-center justify-center mb-3">
//                     <Zap className="w-8 h-8 text-purple-600" />
//                   </div>
//                   <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
//                     {planTitle} {t('planDetails.plan')}
//                   </h3>
//                   <p className="text-sm text-gray-500 font-medium">
//                     {t('planDetails.billed')} {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}{t('planDetails.ly')}
//                   </p>
//                 </motion.div>

//                 <div className="text-center">
//                   <p className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2 mb-1">
//                     <Banknote className="w-8 h-8 text-green-500" />
//                     {price}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {pricePerInterval && `${t('planDetails.equivalentTo')} ${pricePerInterval}`}
//                     {discountPercent > 0 && (
//                       <span className="ml-2 font-bold text-green-600">
//                         ({discountPercent}% {t('planDetails.savings')})
//                       </span>
//                     )}
//                   </p>
//                   <p className="text-sm mt-3 text-purple-600 font-medium capitalize">
//                     {t('planDetails.applications')}: {selectedTypes.join(', ')}
//                   </p>
//                 </div>

//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 border-gray-200">
//                     {t('planDetails.keyFeatures')}
//                   </h4>
//                   <ul className="space-y-3 text-gray-700">
//                     {features.map((feature, i) => (
//                       <motion.li
//                         key={i}
//                         className="flex items-start gap-3"
//                         initial={{ x: -10, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         transition={{ duration: 0.2, delay: i * 0.05 }}
//                       >
//                         <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
//                         <span className="text-base">{feature}</span>
//                       </motion.li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               <p className="text-xs text-center text-gray-500 mt-8">
//                 {t('planDetails.youAreSubscribing')} <strong>{planId}</strong>. {t('planDetails.secureCheckout')}
//               </p>
//             </div>

//             {/* Right Side - Email Form */}
//             <div className="p-8 lg:p-10">
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                 {t('planDetails.completeYourSubscription')}
//               </h3>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <label className="block">
//                   <span className="text-gray-800 font-medium block mb-2">{t('planDetails.billingEmail')}</span>
//                   <input
//                     type="email"
//                     required
//                     pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       setSubscribed(false);
//                       setError(null);
//                     }}
//                     className="mt-1 w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-inner"
//                     placeholder={t('planDetails.emailPlaceholder')}
//                     aria-required="true"
//                     aria-invalid={error ? 'true' : 'false'}
//                   />
//                   {error && (
//                     <p className="text-red-500 text-sm mt-2" role="alert">
//                       {error}
//                     </p>
//                   )}
//                 </label>

//                 <button
//                   type="submit"
//                   disabled={isLoading || subscribed}
//                   className={`w-full text-white px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-[1.01] ${
//                     isLoading || subscribed
//                       ? 'bg-purple-400 opacity-80 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700'
//                   }`}
//                   aria-label="Confirm subscription and proceed to payment"
//                 >
//                   <AnimatePresence mode="wait">
//                     {isLoading ? (
//                       <motion.span
//                         key="loading"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="flex items-center justify-center gap-2"
//                       >
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         {t('planDetails.processingCheckout')}
//                       </motion.span>
//                     ) : (
//                       <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                         {t('planDetails.payNow', { price })}
//                       </motion.span>
//                     )}
//                   </AnimatePresence>
//                 </button>

//                 <AnimatePresence>
//                   {(subscribed || isLoading) && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.5 }}
//                       className="bg-emerald-50 border border-emerald-300 p-4 rounded text-center mt-6"
//                     >
//                       <p className="text-emerald-600 font-semibold flex items-center justify-center gap-2">
//                         <CheckCircle className="w-5 h-5" />
//                         {t('planDetails.redirectingToPayment')}
//                       </p>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </form>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default PlanDetails;









import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Check, ChevronLeft, Loader2, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useLocation as useCountryLocation } from '../../contexts/LocationContext';
import { useTranslation } from 'react-i18next';
import Header from './Header';

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

  // Early return for missing state (Session Expired)
  if (!state || !state.planId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-sans">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="text-slate-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('planDetails.sessionExpired')}</h2>
          <p className="text-slate-500 mb-8">{t('planDetails.invalidPlanMessage')}</p>
          <button
            onClick={() => navigate('/subscription')}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
          >
            {t('planDetails.goBackToPlans')}
          </button>
        </motion.div>
      </div>
    );
  }

  const { planId, planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/subscription/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Location': countryCode },
        body: JSON.stringify({
          email, planId, appNames: selectedTypes, interval: billingCycle, autoRenew: true, cancelAtPeriodEnd: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || t('planDetails.somethingWentWrong'));

      setSubscribed(true);
      toast.success(t('planDetails.checkoutCreated'));
      setTimeout(() => { window.location.href = data.checkoutUrl; }, 1500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100-80px)]">
        
        {/* Left Side: Summary (The "Clean" Side) */}
        <div className="lg:col-span-5 bg-slate-50/50 p-8 lg:p-16 border-r border-slate-100">
          <button 
            onClick={() => navigate('/subscription')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('planDetails.goBackToPlans')}
          </button>

          <div className="space-y-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                {planTitle} {t('planDetails.plan')}
              </span>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                {price}
              </h1>
              <p className="text-slate-500 text-sm">
                {t("planDetails.billingText", { billingCycle })}
                {discountPercent > 0 && <span className="text-emerald-600 font-bold ml-2">{t("planDetails.saveText", { discountPercent })}</span>}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t('planDetails.keyFeatures')}
              </h4>
              <ul className="space-y-4">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="mt-1 bg-emerald-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-10 border-t border-slate-200/60">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <p className="text-xs leading-relaxed">
                  {t('planDetails.secureCheckout')}. {t("planDetails.secureText")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form (The "Action" Side) */}
        <div className="lg:col-span-7 p-8 lg:p-24 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold mb-2">{t("planDetails.checkoutTitle")}</h2>
            <p className="text-slate-500 mb-10 text-sm">{t("planDetails.checkoutDescription")}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {t('planDetails.billingEmail')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="mt-3 w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none text-slate-900"
                />
                {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading || subscribed}
                className={`w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-3 ${
                  isLoading || subscribed
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-violet-600 text-white hover:bg-violet-700 shadow-xl shadow-violet-200 hover:shadow-violet-300'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('planDetails.processingCheckout')}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {t('planDetails.payNow', { price: `Checkout ${price}` })}
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-sm font-medium"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('planDetails.redirectingToPayment')}
                </motion.div>
              )}
            </AnimatePresence>
            
            <p className="mt-10 text-center text-[11px] text-slate-400">
              {t("planDetails.agreementText")} 
              {t("planDetails.billingStart", { planId })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanDetails;