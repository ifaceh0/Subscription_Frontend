// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import SubscriptionCard from './SubscriptionCard';
// import { User, Briefcase, Building2, Loader2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const Subscription = ({
//   availableTypes = ['loyalty', 'referral'],
//   defaultApp = '',
// }) => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const appFromQuery = queryParams.get('app');

//   const [billingCycle, setBillingCycle] = useState('monthly');
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [pricingData, setPricingData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch plans from backend
//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const response = await fetch('https://subscription-backend-e8gq.onrender.com/api/subscription/plans', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           throw new Error('Failed to fetch plans');
//         }
//         const data = await response.json();
//         setPricingData(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchPlans();
//   }, []);

//   // Handle default app selection
//   useEffect(() => {
//     if (appFromQuery && selectedTypes.length === 0) {
//       let mappedType = '';
//       if (appFromQuery.toLowerCase().includes('loyalty')) {
//         mappedType = 'loyalty';
//       } else if (appFromQuery.toLowerCase().includes('referral')) {
//         mappedType = 'referral';
//       } else if (availableTypes.includes(appFromQuery)) {
//         mappedType = appFromQuery;
//       }
//       if (mappedType && availableTypes.includes(mappedType)) {
//         setSelectedTypes([mappedType]);
//       }
//     } else if (!appFromQuery && defaultApp && selectedTypes.length === 0) {
//       setSelectedTypes([defaultApp]);
//     }
//   }, [appFromQuery, defaultApp, availableTypes, selectedTypes.length]);

//   const handleCheckboxChange = (type) => {
//     setSelectedTypes((prev) =>
//       prev.includes(type)
//         ? prev.filter((t) => t !== type)
//         : [...prev, type]
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="p-8 max-w-md w-full text-center"
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
//             <p className="text-xl font-semibold text-gray-800">Loading Plans...</p>
//           </div>
//           <p className="text-gray-600">Please wait while we fetch the subscription details.</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="p-8 max-w-md w-full text-center"
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//             <p className="text-xl font-semibold text-red-600">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Try Again
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   const mergedPricing = {
//     Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
//     Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
//     Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
//   };

//   const appType = selectedTypes.length === 2 ? 'BOTH' : selectedTypes[0]?.toUpperCase() || '';

//   ['Basic', 'Pro', 'Enterprise'].forEach((tier) => {
//     pricingData.forEach((plan) => {
//       if (
//         plan.planName === tier &&
//         ((appType === 'BOTH' && plan.appType === 'BOTH') ||
//          (appType !== 'BOTH' && plan.appType === appType))
//       ) {
//         const interval = plan.interval.toLowerCase();
//         mergedPricing[tier][interval] = plan.discountedPrice;
//         mergedPricing[tier].discount[interval] = plan.discountPercent;
//         mergedPricing[tier].planIds[interval] = plan.planId;
//       }
//     });
//   });

//   const formatPrice = (price) => `$${price.toFixed(2)}`;

//   const plans = ['Basic', 'Pro', 'Enterprise'].map((tier) => ({
//     title: tier,
//     price: {
//       monthly: `${formatPrice(mergedPricing[tier].monthly)} /month`,
//       quarterly: `${formatPrice(mergedPricing[tier].quarterly)} /quarter`,
//       yearly: `${formatPrice(mergedPricing[tier].yearly)} /year`,
//     },
//     discountPercent: mergedPricing[tier].discount,
//     planIds: mergedPricing[tier].planIds,
//     features:
//       tier === 'Basic'
//         ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
//         : tier === 'Pro'
//         ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
//         : [
//             'Unlimited users',
//             'Unlimited storage',
//             '24/7 dedicated support',
//             'Advanced security features',
//             'Custom development',
//             'On-premise deployment option',
//           ],
//     buttonText: `Select ${tier} Plan`,
//     color:
//       tier === 'Basic'
//         ? 'bg-purple-500'
//         : tier === 'Pro'
//         ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
//         : 'bg-blue-600',
//     icon: tier === 'Basic' ? User : tier === 'Pro' ? Briefcase : Building2,
//   }));

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
//       <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
//         Choose Your Subscription Plan
//       </h1>

//       {/* Billing Cycle Toggle */}
//       <div className="flex justify-center mb-8">
//         <div className="inline-flex bg-white rounded-full p-1 shadow-md">
//           {['monthly', 'quarterly', 'yearly'].map((cycle) => (
//             <div key={cycle} className="relative mx-1">
//               <button
//                 onClick={() => setBillingCycle(cycle)}
//                 className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 w-[100px] text-center ${
//                   billingCycle === cycle
//                     ? 'bg-purple-600 text-white'
//                     : 'text-purple-700 bg-transparent'
//                 }`}
//               >
//                 {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
//               </button>
//               {(cycle === 'quarterly' || cycle === 'yearly') && (
//                 <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 w-[max-content] text-white text-[10px] px-2 py-0.5 rounded-full shadow z-10">
//                   {cycle === 'quarterly' ? '5-10% OFF' : '10-15% OFF'}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Sidebar + Cards */}
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
//         {/* Enhanced Sidebar */}
//         <div className="w-full lg:w-[22%] bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-6 flex flex-col gap-5 border border-purple-100">
//           <div className="text-purple-800 font-bold text-xl mb-4 text-center">
//             Customize Your Subscription
//           </div>
//           <p className="text-purple-600 text-sm mb-6 text-center">
//             Maximize savings by bundling products tailored for your growing business.
//           </p>
//           {availableTypes.map((type) => (
//             <label
//               key={type}
//               className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-purple-50 transition-all duration-200 cursor-pointer border border-purple-100"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedTypes.includes(type)}
//                 onChange={() => handleCheckboxChange(type)}
//                 className="accent-purple-600 w-5 h-5"
//               />
//               <span className="text-purple-800 font-medium text-lg capitalize">
//                 {type}
//               </span>
//             </label>
//           ))}
//           <div className="mt-auto text-center">
//             <button
//               onClick={() => setSelectedTypes([])}
//               className="mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
//             >
//               Clear Selection
//             </button>
//           </div>
//         </div>

//         {/* Pricing Cards */}
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
//                 {plans.map((plan, index) => (
//                   <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
//                     <SubscriptionCard
//                       title={plan.title}
//                       price={plan.price}
//                       discountPercent={plan.discountPercent}
//                       planIds={plan.planIds}
//                       features={plan.features}
//                       buttonText={plan.buttonText}
//                       color={plan.color}
//                       billingCycle={billingCycle}
//                       icon={plan.icon}
//                       selectedTypes={selectedTypes}
//                     />
//                   </div>
//                 ))}
//               </motion.div>
//             </AnimatePresence>
//           ) : (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key="no-plan"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex justify-center items-center h-full min-h-[200px] text-center"
//               >
//                 <p className="text-purple-600 font-medium text-lg">
//                   Please select at least one product to view subscription plans.
//                 </p>
//               </motion.div>
//             </AnimatePresence>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Subscription;






import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SubscriptionCard from './SubscriptionCard';
import { User, Briefcase, Building2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Subscription = ({
  availableTypes = ['loyalty', 'referral'],
  defaultApp = '',
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appFromQuery = queryParams.get('app');

  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://subscription-backend-e8gq.onrender.com/api/subscription/plans', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await response.json();
        console.log('Backend Response:', data);
        setPricingData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Handle default app selection
  useEffect(() => {
    if (appFromQuery && selectedTypes.length === 0) {
      let mappedType = '';
      if (appFromQuery.toLowerCase().includes('loyalty')) {
        mappedType = 'loyalty';
      } else if (appFromQuery.toLowerCase().includes('referral')) {
        mappedType = 'referral';
      } else if (availableTypes.includes(appFromQuery)) {
        mappedType = appFromQuery;
      }
      if (mappedType && availableTypes.includes(mappedType)) {
        setSelectedTypes([mappedType]);
      }
    } else if (!appFromQuery && defaultApp && selectedTypes.length === 0) {
      setSelectedTypes([defaultApp]);
    }
  }, [appFromQuery, defaultApp, availableTypes, selectedTypes.length]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xl font-semibold text-gray-800">Loading Plans...</p>
          </div>
          <p className="text-gray-600">Please wait while we fetch the subscription details.</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <p className="text-xl font-semibold text-red-600">Error</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const mergedPricing = {
    Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
    Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
    Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
  };

  // Map backend data to frontend pricing structure
  ['Basic', 'Pro', 'Enterprise'].forEach((tier) => {
    pricingData.forEach((plan) => {
      // Normalize case for comparison
      const selectedTypesLower = selectedTypes.map((type) => type.toLowerCase());
      const applicationNamesLower = plan.applicationNames.map((name) => name.toLowerCase());
      const isSelectedAppsMatch = selectedTypesLower.every((type) =>
        applicationNamesLower.includes(type)
      );
      const isAppCountMatch = selectedTypesLower.length === applicationNamesLower.length;

      if (plan.planName.toLowerCase() === tier.toLowerCase() && isSelectedAppsMatch && isAppCountMatch) {
        const interval = plan.interval.toLowerCase();
        mergedPricing[tier][interval] = plan.discountedPrice || 0;
        mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
        mergedPricing[tier].planIds[interval] = plan.planId;
      }
    });
  });

  console.log('Merged Pricing:', mergedPricing);

  const formatPrice = (price, interval) => {
    if (interval === 'monthly') {
      return `$${parseFloat(price || 0).toFixed(2)} /month`;
    } else if (interval === 'quarterly') {
      return `$${parseFloat(price || 0).toFixed(2)} /quarter`;
    } else {
      return `$${parseFloat(price || 0).toFixed(2)} /year`;
    }
  };

  // Only include plans that have at least one non-zero price
  const plans = ['Basic', 'Pro', 'Enterprise']
    .map((tier) => ({
      title: tier,
      price: {
        monthly: formatPrice(mergedPricing[tier].monthly, 'monthly'),
        quarterly: formatPrice(mergedPricing[tier].quarterly, 'quarterly'),
        yearly: formatPrice(mergedPricing[tier].yearly, 'yearly'),
      },
      discountPercent: mergedPricing[tier].discount,
      planIds: mergedPricing[tier].planIds,
      features:
        tier === 'Basic'
          ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
          : tier === 'Pro'
          ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
          : [
              'Unlimited users',
              'Unlimited storage',
              '24/7 dedicated support',
              'Advanced security features',
              'Custom development',
              'On-premise deployment option',
            ],
      buttonText: `Select ${tier} Plan`,
      color:
        tier === 'Basic'
          ? 'bg-purple-500'
          : tier === 'Pro'
          ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
          : 'bg-blue-600',
      icon: tier === 'Basic' ? User : tier === 'Pro' ? Briefcase : Building2,
    }))
    .filter((plan) =>
      Object.values(mergedPricing[plan.title]).some(
        (value) => typeof value === 'number' && value > 0
      )
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
      <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
        Choose Your Subscription Plan
      </h1>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white rounded-full p-1 shadow-md">
          {['monthly', 'quarterly', 'yearly'].map((cycle) => (
            <div key={cycle} className="relative mx-1">
              <button
                onClick={() => setBillingCycle(cycle)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 w-[100px] text-center ${
                  billingCycle === cycle
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-700 bg-transparent'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </button>
              {(cycle === 'quarterly' || cycle === 'yearly') && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 w-[max-content] text-white text-[10px] px-2 py-0.5 rounded-full shadow z-10">
                  {cycle === 'quarterly' ? '5-10% OFF' : '10-15% OFF'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar + Cards */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Enhanced Sidebar */}
        <div className="w-full lg:w-[22%] bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-6 flex flex-col gap-5 border border-purple-100">
          <div className="text-purple-800 font-bold text-xl mb-4 text-center">
            Customize Your Subscription
          </div>
          <p className="text-purple-600 text-sm mb-6 text-center">
            Maximize savings by bundling products tailored for your growing business.
          </p>
          {availableTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-purple-50 transition-all duration-200 cursor-pointer border border-purple-100"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleCheckboxChange(type)}
                className="accent-purple-600 w-5 h-5"
              />
              <span className="text-purple-800 font-medium text-lg capitalize">
                {type}
              </span>
            </label>
          ))}
          <div className="mt-auto text-center">
            <button
              onClick={() => setSelectedTypes([])}
              className="mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex-1">
          {selectedTypes.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTypes.join('-') + billingCycle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap justify-center gap-8 px-2"
              >
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
                      <SubscriptionCard
                        title={plan.title}
                        price={plan.price}
                        discountPercent={plan.discountPercent}
                        planIds={plan.planIds}
                        features={plan.features}
                        buttonText={plan.buttonText}
                        color={plan.color}
                        billingCycle={billingCycle}
                        icon={plan.icon}
                        selectedTypes={selectedTypes}
                      />
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center h-full min-h-[200px] text-center"
                  >
                    <p className="text-purple-600 font-medium text-lg">
                      No plans available for the selected products.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="no-plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center h-full min-h-[200px] text-center"
              >
                <p className="text-purple-600 font-medium text-lg">
                  Please select at least one product to view subscription plans.
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;