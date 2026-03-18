// import { useState, useEffect } from 'react';
// import { useLocation as useRouterLocation } from 'react-router-dom';
// import SubscriptionCard from './SubscriptionCard';
// import { User, Star, Loader2, AlertCircle } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { RefreshCw } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useLocation } from '../contexts/LocationContext';
// import Header from './Header';
// import { useTranslation } from 'react-i18next';
// import FeatureDetailsModal from './Modal/FeatureDetailsModal';
// import LanguageSelector from './LanguageSelector';
// import CountrySelector from './CountrySelector';

// const Subscription = ({ defaultApp = '' }) => {
//   const { t } = useTranslation();

//   const routerLocation = useRouterLocation();
//   const queryParams = new URLSearchParams(routerLocation.search);
//   const appFromQuery = queryParams.get('app');
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const { countryCode } = useLocation();  // ← NEW: get detected country

//   const [billingCycle, setBillingCycle] = useState('month');
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [pricingData, setPricingData] = useState([]);
//   const [availableTypes, setAvailableTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTierForModal, setSelectedTierForModal] = useState(null);

//   const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await fetch(url, {
//           ...options,
//           headers: { 'Content-Type': 'application/json',
//             'X-User-Location': countryCode,
//            },
//         });
//         if (response.status === 429) {
//           const retryAfter = response.headers.get('Retry-After') || delay * Math.pow(2, i);
//           await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//           continue;
//         }
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response;
//       } catch (err) {
//         if (i === retries - 1) throw err;
//         await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchApplications = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchWithBackoff(`${API_URL}/api/admin/applications`, {
//           method: 'GET',
//         });
//         const data = await response.json();
//         const types = data.map(app => app.name.toLowerCase());
//         setAvailableTypes(types);
//         console.log('Available Types:', types);
//       } catch (err) {
//         setError('Failed to fetch applications.');
//         toast.error(`Error fetching applications: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchApplications();
//   }, []);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchWithBackoff(`${API_URL}/api/subscription/allPlans`, {
//           method: 'GET',
//         });
//         let data = await response.json();

//         data = data.filter(plan => plan.countryCode === countryCode);

//         setPricingData(data);
//         console.log('Pricing Data for country', countryCode, ':', data);
//         console.log('Received plans:', data);
//         console.log('After country filter:', data.filter(plan => plan.countryCode === countryCode));
//       } catch (err) {
//         setError('Failed to fetch plans.');
//         toast.error('Error fetching plans.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlans();
//   }, [countryCode]); 

//   useEffect(() => {
//     if (appFromQuery && selectedTypes.length === 0 && availableTypes.length > 0) {
//       const mappedType = appFromQuery.toLowerCase();
//       if (availableTypes.includes(mappedType)) {
//         setSelectedTypes([mappedType]);
//       }
//     } else if (!appFromQuery && defaultApp && selectedTypes.length === 0 && availableTypes.length > 0) {
//       const mappedDefault = defaultApp.toLowerCase();
//       if (availableTypes.includes(mappedDefault)) {
//         setSelectedTypes([mappedDefault]);
//       }
//     }
//   }, [appFromQuery, defaultApp, availableTypes, selectedTypes.length]);

//   const handleCheckboxChange = (type) => {
//     setSelectedTypes(prev =>
//       prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//     );
//   };

//   if (loading || availableTypes.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, y: 10 }} 
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="p-10 max-w-md w-full text-center rounded shadow-indigo-100/50" 
//         >
//           <div className="mx-auto mb-6 relative w-16 h-16">
            
//             <div className="w-8 h-8 rounded-full bg-violet-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//             <motion.div
//               animate={{ 
//                 scale: [0.8, 1.4],
//                 opacity: [0.7, 0],
//               }}
//               transition={{ 
//                 duration: 1.5, 
//                 repeat: Infinity, 
//                 ease: "easeOut",
//               }}
//               className="w-full h-full rounded-full border-4 border-violet-500 absolute top-0 left-0"
//             />
//           </div>

//           <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('subscription.fetchingBestDeals')}</p>
//           <p className="text-gray-500 mt-2 text-base">{t('subscription.loadingSubscriptionPlans')}</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6" role="alert" aria-live="assertive">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="p-10 max-w-md w-full text-center"
//         >
//           <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-6" />
//           <p className="text-2xl font-bold text-red-600 mb-2">{t('subscription.connectionError')}</p>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md"
//             aria-label="Retry loading plans"
//           >
//             <RefreshCw className="w-5 h-5" />
//             {t('subscription.reloadPage')}
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   // const mergedPricing = {
//   //   Basic: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null } },
//   //   Pro: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null } },
//   //   Enterprise: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null } },
//   // };
//   const mergedPricing = {
//     Basic: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
//     Pro: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
//     Enterprise: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
//   };

//   // ['Basic', 'Pro', 'Enterprise'].forEach(tier => {
//   //   const intervalMap = { monthly: 'month', quarterly: 'quarter', yearly: 'year' };
//   //   pricingData.forEach(plan => {
//   //     const selectedTypesLower = selectedTypes.map(type => type.toLowerCase());
//   //     const applicationNamesLower = plan.applicationNames.map(name => name.toLowerCase());
//   //     const isSelectedAppsMatch = selectedTypesLower.every(type => applicationNamesLower.includes(type));
//   //     if (plan.planName.toLowerCase() === tier.toLowerCase() && isSelectedAppsMatch && selectedTypesLower.length > 0) {
//   //       const interval = intervalMap[plan.interval.toLowerCase()];
//   //       if (!mergedPricing[tier][interval] || applicationNamesLower.length === selectedTypesLower.length) {
//   //         mergedPricing[tier][interval] = plan.discountedPrice || 0;
//   //         mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
//   //         mergedPricing[tier].planIds[interval] = plan.planId;
//   //         console.log(`Matched Plan: ${plan.planId}, Interval: ${interval}, Price: ${plan.discountedPrice}, Discount: ${plan.discountPercent}`);
//   //       }
//   //     }
//   //   });
//   // });

//   ['Basic', 'Pro', 'Enterprise'].forEach(tier => {
//     const intervalMap = { monthly: 'month', quarterly: 'quarter', yearly: 'year' };
//     pricingData.forEach(plan => {
//       const selectedTypesLower = selectedTypes.map(type => type.toLowerCase());
//       const applicationNamesLower = plan.applicationNames.map(name => name.toLowerCase());

//       // ← CHANGED: Exact match (same number of apps + all selected are present)
//       const isExactMatch = 
//         selectedTypesLower.length === applicationNamesLower.length &&
//         selectedTypesLower.every(type => applicationNamesLower.includes(type)) &&
//         selectedTypesLower.length > 0;

//       if (plan.planName.toLowerCase() === tier.toLowerCase() && isExactMatch) {
//         const interval = intervalMap[plan.interval.toLowerCase()];
//         // if (interval && (!mergedPricing[tier][interval] || true)) { // remove the || condition if you want strict preference
//         //   mergedPricing[tier][interval] = plan.discountedPrice || 0;
//         //   mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
//         //   mergedPricing[tier].planIds[interval] = plan.planId;

//         //   // Prefer backend formattedPrice
//         //   mergedPricing[tier].formatted = mergedPricing[tier].formatted || {};
//         //   mergedPricing[tier].formatted[interval] = plan.formattedPrice || `$${parseFloat(plan.discountedPrice || 0).toFixed(2)}`;
          
//         //   console.log(`Exact match for ${tier} (${interval}): ${plan.planId}, Apps: ${plan.applicationNames.join(', ')}`);
//         // }
//         if (interval) {
//           mergedPricing[tier][interval] = {
//             price: plan.discountedPrice || 0,
//             formatted: plan.formattedPrice || '0.00'  
//           };
//           mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
//           mergedPricing[tier].planIds[interval] = plan.planId;
//         }
//       }
//     });
//   });

//   const formatPrice = (price, interval) => {
//     if (interval === 'month') {
//       return `$${parseFloat(price || 0).toFixed(2)} /${t('subscription.month')}`;
//     } else if (interval === 'quarter') {
//       return `$${parseFloat(price || 0).toFixed(2)} /${t('subscription.quarter')}`;
//     } else {
//       return `$${parseFloat(price || 0).toFixed(2)} /${t('subscription.year')}`;
//     }
//   };

//   const planHighlights = {
//     Basic: t('subscription.planHighlights.Basic', { returnObjects: true }),
//     Pro: t('subscription.planHighlights.Pro', { returnObjects: true }),
//     Enterprise: t('subscription.planHighlights.Enterprise', { returnObjects: true }),
//   };

//   const plans = ['Basic', 'Pro', 'Enterprise'].map(tier => ({
//     title: tier,
//     // price: {
//     //   month: mergedPricing[tier].formatted?.month || formatPrice(mergedPricing[tier].month, 'month'),
//     //   quarter: mergedPricing[tier].formatted?.quarter || formatPrice(mergedPricing[tier].quarter, 'quarter'),
//     //   year: mergedPricing[tier].formatted?.year || formatPrice(mergedPricing[tier].year, 'year'),
//     // },
//     price: {
//       month: mergedPricing[tier].month?.formatted || '0.00',
//       quarter: mergedPricing[tier].quarter?.formatted || '0.00',
//       year: mergedPricing[tier].year?.formatted || '0.00',
//     },
//     discountPercent: mergedPricing[tier].discount,
//     planIds: mergedPricing[tier].planIds,
//     // features: mergedPricing[tier].features?.length > 0
//     //   ? mergedPricing[tier].features
//     //   : (tier === 'Basic'
//     //       ? [
//     //           t('subscription.basicFeature1'),
//     //           t('subscription.basicFeature2'),
//     //           t('subscription.basicFeature3'),
//     //           t('subscription.basicFeature4')
//     //         ]
//     //       : tier === 'Pro'
//     //       ? [ 
//     //           t('subscription.proFeature1'),
//     //           t('subscription.proFeature2'),
//     //           t('subscription.proFeature3'),
//     //           t('subscription.proFeature4'),
//     //           t('subscription.proFeature5')
//     //         ]
//     //       : [
//     //           t('subscription.enterpriseFeature1'),
//     //           t('subscription.enterpriseFeature2'),
//     //           t('subscription.enterpriseFeature3'),
//     //           t('subscription.enterpriseFeature4'),
//     //           t('subscription.enterpriseFeature5'),
//     //           t('subscription.enterpriseFeature6'),
//     //         ]),

//     features: planHighlights[tier] || [],

//     buttonText: `${t('subscription.add')} ${tier} ${t('subscription.plan')}`,
//     color: tier === 'Basic' ? 'bg-purple-500' : tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-blue-600',
//     icon: User,
//   }));

//   console.log('Merged Pricing:', mergedPricing);
//   console.log('Plans:', plans);
//   console.log('country code:', countryCode);

//   const planDetails = {
//     Basic: t('subscription.planDetails.Basic', { returnObjects: true }),
//     Pro: t('subscription.planDetails.Pro', { returnObjects: true }),
//     Enterprise: t('subscription.planDetails.Enterprise', { returnObjects: true }),
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <Header /> */}
//       <header className="bg-white sticky top-0 z-40">
//             <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex items-center justify-between h-16">
//                 <div className="flex items-center gap-4">
//                   <a
//                     href="https://www.ifaceh.com/" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-3"
//                   >
//                     <span className="font-bold text-xl sm:text-2xl">
//                       <span className="text-gray-900">Interface</span>
//                       <span className="text-violet-600">Hub</span>
//                     </span>
//                   </a>
//                 </div>
      
//                 <div className="flex items-center gap-2 sm:gap-4">
//                   <CountrySelector />
//                   <LanguageSelector />
//                 </div>
//               </div>
//             </div>
//           </header>
      
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-7xl mx-auto mt-4"
//       >
//         <div className="text-center mb-6">
//           <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
//             {t('subscription.flexiblePricingZeroHassle')}
//           </h1>
//           <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
//             {t('subscription.scaleYourBusiness')}
//           </p>
//         </div>
//       </motion.div>

//       <div className="flex justify-center mb-4">
//         <div className="inline-flex bg-white rounded-full p-0.5 shadow-xl border border-gray-100">
//           {['month', 'quarter', 'year'].map(cycle => (
//             <div key={cycle} className="relative mx-1">
//               <button
//                 onClick={() => setBillingCycle(cycle)}
//                 className={`px-6 py-2 rounded-full font-bold transition-all duration-300 w-[120px] text-center text-lg ${
//                   billingCycle === cycle
//                     ? 'bg-violet-600 text-white shadow-lg shadow-indigo-200'
//                     : 'text-gray-600 bg-transparent hover:bg-gray-100'
//                 }`}
//                 aria-label={`Select ${cycle} billing cycle`}
//               >
//                 {t(`subscription.${cycle}`)}
//               </button>
//               {/* {mergedPricing.Basic.discount[cycle] > 0 && (
//                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10 animate-pulse-slow">
//                   {mergedPricing.Basic.discount[cycle]}% OFF
//                 </span>
//               )} */}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="max-w-8xl mx-auto flex flex-col lg:flex-row gap-10 p-8">
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="w-full lg:w-1/5 bg-white rounded-xl shadow-xl p-6 h-fit sticky top-6 border border-violet-100"
//         >
//           <div className="text-violet-800 font-extrabold text-2xl mb-4 border-b pb-4 border-violet-100">
//             {t('subscription.selectApplications')}
//           </div>
//           <p className="text-gray-600 text-sm mb-6">
//             {t('subscription.bundleTheTools')}
//           </p>
//           <div className="space-y-3">
//             {availableTypes.map(type => (
//               <label
//                 key={type}
//                 className={`flex items-center gap-3 p-2 rounded-full transition-all duration-200 cursor-pointer border-2 ${
//                   selectedTypes.includes(type) ? 'bg-violet-50 border-violet-300 shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-violet-50'
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedTypes.includes(type)}
//                   onChange={() => handleCheckboxChange(type)}
//                   className="appearance-none w-4 h-4 border-2 rounded-full transition-all duration-200 accent-violet-600 checked:bg-violet-600 checked:border-violet-600 focus:ring-2 focus:ring-violet-500"
//                   aria-checked={selectedTypes.includes(type)}
//                   aria-label={`Select ${type} application`}
//                 />
//                 <span className="text-gray-800 font-semibold text-lg capitalize">
//                   {type}
//                 </span>
//               </label>
//             ))}
//           </div>
//           <div className="mt-8 text-center border-t pt-4 border-violet-100">
//             <button
//               onClick={() => setSelectedTypes([])}
//               className="w-full px-4 py-2 text-violet-600 border border-violet-300 rounded-full hover:bg-violet-50 transition-all duration-200 font-medium"
//               aria-label="Clear all selected applications"
//             >
//               {t('subscription.clearSelection')}
//             </button>
//           </div>
//         </motion.div>

//         <div className="flex-1">
//           {selectedTypes.length > 0 ? (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={selectedTypes.join('-') + billingCycle}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex flex-wrap justify-center gap-8 px-2"
//               >
//                 {plans.length > 0 ? (
//                   plans.map((plan, index) => (
//                     <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
//                       <SubscriptionCard
//                         title={plan.title}
//                         price={plan.price}
//                         discountPercent={plan.discountPercent}
//                         planIds={plan.planIds}
//                         features={plan.features}
//                         buttonText={plan.buttonText}
//                         color={plan.color}
//                         billingCycle={billingCycle}
//                         icon={plan.icon}
//                         selectedTypes={selectedTypes}
//                         onShowMore={() => setSelectedTierForModal(plan.title)}
//                       />
//                     </div>
//                   ))
//                 ) : (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="flex justify-center items-center h-full min-h-[200px] text-center"
//                   >
//                     <div className="md:col-span-2 lg:col-span-3 text-center p-10 bg-white rounded-full shadow-lg border border-gray-100">
//                       <p className="text-gray-500 font-medium text-xl">
//                         {t('subscription.noPlansAvailable', { country: countryCode })}
//                         <br />{t('subscription.tryDifferentCombination')}
//                       </p>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           ) : (
//             <div className="flex justify-center items-center h-full min-h-[400px]">
//               <motion.div
//                 key="no-plan-selected"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.4 }}
//                 className="text-center p-6 bg-white rounded-full shadow-lg border border-gray-100"
//               >
//                 <p className="text-gray-500 font-medium text-xl flex items-center gap-3">
//                   <Star className="w-6 h-6 text-violet-500 fill-violet-500" />
//                   {t('subscription.chooseApplicationsSidebar')}
//                 </p>
//               </motion.div>
//             </div>
//           )}
//         </div>
//         <FeatureDetailsModal
//           isOpen={!!selectedTierForModal}
//           onClose={() => setSelectedTierForModal(null)}
//           tier={selectedTierForModal || ''}
//           content={planDetails[selectedTierForModal] || []}
//         />
//       </div>
//     </div>
//   );
// };

// export default Subscription;








import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import SubscriptionCard from './SubscriptionCard';
import { User, Star, AlertCircle, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLocation } from '../../contexts/LocationContext';
import { useTranslation } from 'react-i18next';
import FeatureDetailsModal from '../Modal/FeatureDetailsModal';
import LanguageSelector from './LanguageSelector';
import CountrySelector from './CountrySelector';
import PricingPlans from './PricingPlans';

const Subscription = ({ defaultApp = '' }) => {
  const { t } = useTranslation();
  const routerLocation = useRouterLocation();
  const queryParams = new URLSearchParams(routerLocation.search);
  const appFromQuery = queryParams.get('app');
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { countryCode } = useLocation();

  // State Management (Unchanged Logic)
  const [billingCycle, setBillingCycle] = useState('month');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTierForModal, setSelectedTierForModal] = useState(null);

  // API Utilities (Unchanged Logic)
  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: { 
            'Content-Type': 'application/json',
            'X-User-Location': countryCode,
          },
        });
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || delay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await fetchWithBackoff(`${API_URL}/api/subscription/allApplications`, { method: 'GET' });
        const data = await response.json();
        setAvailableTypes(data.map(app => app.name.toLowerCase()));
      } catch (err) {
        setError('Failed to fetch applications.');
        toast.error(`Error: ${err.message}`);
      } finally { setLoading(false); }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const response = await fetchWithBackoff(`${API_URL}/api/subscription/allPlans`, { method: 'GET' });
        let data = await response.json();
        setPricingData(data.filter(plan => plan.countryCode === countryCode));
      } catch (err) {
        setError('Failed to fetch plans.');
        toast.error('Error fetching plans.');
      } finally { setLoading(false); }
    };
    fetchPlans();
  }, [countryCode]);

  useEffect(() => {
    if (appFromQuery && selectedTypes.length === 0 && availableTypes.length > 0) {
      const mappedType = appFromQuery.toLowerCase();
      if (availableTypes.includes(mappedType)) setSelectedTypes([mappedType]);
    } else if (!appFromQuery && defaultApp && selectedTypes.length === 0 && availableTypes.length > 0) {
      const mappedDefault = defaultApp.toLowerCase();
      if (availableTypes.includes(mappedDefault)) setSelectedTypes([mappedDefault]);
    }
  }, [appFromQuery, defaultApp, availableTypes, selectedTypes.length]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  // Pricing Logic (Preserved)
  const mergedPricing = {
    Basic: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
    Pro: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
    Enterprise: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
  };

  ['Basic', 'Pro', 'Enterprise'].forEach(tier => {
    const intervalMap = { monthly: 'month', quarterly: 'quarter', yearly: 'year' };
    pricingData.forEach(plan => {
      const selectedTypesLower = selectedTypes.map(type => type.toLowerCase());
      const applicationNamesLower = plan.applicationNames.map(name => name.toLowerCase());
      const isExactMatch = selectedTypesLower.length === applicationNamesLower.length &&
        selectedTypesLower.every(type => applicationNamesLower.includes(type)) &&
        selectedTypesLower.length > 0;

      if (plan.planName.toLowerCase() === tier.toLowerCase() && isExactMatch) {
        const interval = intervalMap[plan.interval.toLowerCase()];
        if (interval) {
          mergedPricing[tier][interval] = { price: plan.discountedPrice || 0, formatted: plan.formattedPrice || '0.00' };
          mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
          mergedPricing[tier].planIds[interval] = plan.planId;
        }
      }
    });
  });

  const planHighlights = {
    Basic: t('subscription.planHighlights.Basic', { returnObjects: true }),
    Pro: t('subscription.planHighlights.Pro', { returnObjects: true }),
    Enterprise: t('subscription.planHighlights.Enterprise', { returnObjects: true }),
  };

  const plans = ['Basic', 'Pro', 'Enterprise'].map(tier => ({
    title: tier,
    price: {
      month: mergedPricing[tier].month?.formatted || '0.00',
      quarter: mergedPricing[tier].quarter?.formatted || '0.00',
      year: mergedPricing[tier].year?.formatted || '0.00',
    },
    discountPercent: mergedPricing[tier].discount,
    planIds: mergedPricing[tier].planIds,
    features: planHighlights[tier] || [],
    buttonText: `${t('subscription.add')} ${tier}`,
    color: tier === 'Basic' ? 'bg-purple-500' : tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-blue-600',
    // icon: User,
  }));

  const planDetails = {
    Basic: t('subscription.planDetails.Basic', { returnObjects: true }),
    Pro: t('subscription.planDetails.Pro', { returnObjects: true }),
    Enterprise: t('subscription.planDetails.Enterprise', { returnObjects: true }),
  };

  // if (loading || availableTypes.length === 0) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-white">
  //       <div className="text-center">
  //         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
  //           <RefreshCw className="w-10 h-10 text-violet-600 mx-auto mb-4" />
  //         </motion.div>
  //         <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">{t('subscription.fetchingBestDeals')}</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading || availableTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6" role="alert" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10 max-w-md w-full text-center rounded shadow-indigo-100/50" 
        >
          <div className="mx-auto mb-6 relative w-16 h-16">
            
            <div className="w-8 h-8 rounded-full bg-violet-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <motion.div
              animate={{ 
                scale: [0.8, 1.4],
                opacity: [0.7, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeOut",
              }}
              className="w-full h-full rounded-full border-4 border-violet-500 absolute top-0 left-0"
            />
          </div>

          <p className="text-lg font-medium text-slate-600 uppercase tracking-tight">{t('subscription.fetchingBestDeals')}</p>
          <p className="text-slate-500 mt-2 text-base">{t('subscription.loadingSubscriptionPlans')}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6" role="alert" aria-live="assertive">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-10 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <p className="text-2xl font-bold text-red-600 mb-2">{t('subscription.connectionError')}</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md"
            aria-label="Retry loading plans"
          >
            <RefreshCw className="w-5 h-5" />
            {t('subscription.reloadPage')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans">
      {/* HEADER SECTION */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="https://www.ifaceh.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
            {/* <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <Star className="w-5 h-5 text-white fill-white" />
            </div> */}
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Interface<span className="text-violet-600">Hub</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <CountrySelector />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 py-12">
        {/* HERO TITLE */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            {t('subscription.flexiblePricingZeroHassle')}
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {t('subscription.scaleYourBusiness')}
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-100/80 p-1.5 rounded-xl flex items-center gap-1 border border-slate-200 shadow-inner">
            {['month', 'quarter', 'year'].map(cycle => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  billingCycle === cycle 
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t(`subscription.${cycle}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* SIDEBAR: APPLICATION SELECTOR */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                {t('subscription.selectApplications')}
              </h3>
              <div className="space-y-2">
                {availableTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleCheckboxChange(type)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 group ${
                      selectedTypes.includes(type) 
                        ? 'border-violet-600 bg-violet-50/30' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <span className={`capitalize font-semibold text-sm ${selectedTypes.includes(type) ? 'text-violet-700' : 'text-slate-600'}`}>
                      {type}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedTypes.includes(type) ? 'bg-violet-600 border-violet-600' : 'border-slate-300'
                    }`}>
                      {selectedTypes.includes(type) && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => setSelectedTypes([])}
                  className="w-full mt-6 flex items-center justify-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t('subscription.clearSelection')}
                </button>
              )}
            </div>
          </aside>

          {/* MAIN CONTENT: PRICING CARDS */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {selectedTypes.length > 0 ? (
                <motion.div 
                  key={selectedTypes.join('-') + billingCycle}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4"
                >
                  {plans.map((plan, index) => (
                    <SubscriptionCard
                      key={index}
                      {...plan}
                      billingCycle={billingCycle}
                      selectedTypes={selectedTypes}
                      onShowMore={() => setSelectedTierForModal(plan.title)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[1rem]"
                >
                  <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                    <ArrowRight className="w-8 h-8 text-violet-500 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t('subscription.buildYourPlan')}</h4>
                  <p className="text-slate-500 max-w-xs text-center leading-relaxed">
                    {t('subscription.chooseApplicationsSidebar')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <PricingPlans />
      </div>

      <FeatureDetailsModal
        isOpen={!!selectedTierForModal}
        onClose={() => setSelectedTierForModal(null)}
        tier={selectedTierForModal || ''}
        content={planDetails[selectedTierForModal] || []}
      />
    </div>
  );
};

export default Subscription;