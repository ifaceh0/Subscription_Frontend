// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import SubscriptionCard from './SubscriptionCard';
// import { User, Briefcase, Building2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const Subscription = ({
//   availableTypes = ['loyalty', 'referral'],
//   pricingData = {
//     loyalty: {
//       Basic: { monthly: 9.99, quarterly: 26.99, yearly: 89.99 },
//       Pro: { monthly: 19.99, quarterly: 54.99, yearly: 184.99 },
//       Enterprise: { monthly: 49.99, quarterly: 139.99, yearly: 429.99 },
//     },
//     referral: {
//       Basic: { monthly: 5.99, quarterly: 15.99, yearly: 55.99 },
//       Pro: { monthly: 14.99, quarterly: 39.99, yearly: 144.99 },
//       Enterprise: { monthly: 39.99, quarterly: 104.99, yearly: 379.99 },
//     },
//   },
//   defaultApp = '',
// }) => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const appFromQuery = queryParams.get('app');

//   const [billingCycle, setBillingCycle] = useState('monthly');
//   const [selectedTypes, setSelectedTypes] = useState([]);

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

//   const mergedPricing = {
//     Basic: { monthly: 0, quarterly: 0, yearly: 0 },
//     Pro: { monthly: 0, quarterly: 0, yearly: 0 },
//     Enterprise: { monthly: 0, quarterly: 0, yearly: 0 },
//   };

//   selectedTypes.forEach((type) => {
//     ['Basic', 'Pro', 'Enterprise'].forEach((tier) => {
//       mergedPricing[tier].monthly += pricingData[type]?.[tier]?.monthly || 0;
//       mergedPricing[tier].quarterly += pricingData[type]?.[tier]?.quarterly || 0;
//       mergedPricing[tier].yearly += pricingData[type]?.[tier]?.yearly || 0;
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
//                 <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
//                   {cycle === 'quarterly' ? '20% OFF' : '30% OFF'}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Sidebar + Cards */}
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
//         {/* Sidebar Checkboxes */}
//         <div className="w-full lg:w-[22%] bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-purple-200">
//           <div className="text-purple-800 font-semibold text-lg">
//             The more products you subscribe, the more you save — tailored for growing businesses.
//           </div>
//           {availableTypes.map((type) => (
//             <label
//               key={type}
//               className="inline-flex items-center gap-3 text-purple-800 text-lg font-medium cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedTypes.includes(type)}
//                 onChange={() => handleCheckboxChange(type)}
//                 className="accent-purple-600 w-5 h-5"
//               />
//               {type.charAt(0).toUpperCase() + type.slice(1)}
//             </label>
//           ))}
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
import { User, Briefcase, Building2, Loader2 } from 'lucide-react';
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
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
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
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <p className="text-xl font-semibold text-red-600">Error</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Process pricing data based on selected types
  const mergedPricing = {
    Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 } },
    Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 } },
    Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 } },
  };

  const appType = selectedTypes.length === 2 ? 'BOTH' : selectedTypes[0]?.toUpperCase() || '';

  ['Basic', 'Pro', 'Enterprise'].forEach((tier) => {
    pricingData.forEach((plan) => {
      if (
        plan.planName === tier &&
        ((appType === 'BOTH' && plan.appType === 'BOTH') ||
         (appType !== 'BOTH' && plan.appType === appType))
      ) {
        const interval = plan.interval.toLowerCase();
        mergedPricing[tier][interval] = plan.discountedPrice;
        mergedPricing[tier].discount[interval] = plan.discountPercent;
      }
    });
  });

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  const plans = ['Basic', 'Pro', 'Enterprise'].map((tier) => ({
    title: tier,
    price: {
      monthly: `${formatPrice(mergedPricing[tier].monthly)} /month`,
      quarterly: `${formatPrice(mergedPricing[tier].quarterly)} /quarter`,
      yearly: `${formatPrice(mergedPricing[tier].yearly)} /year`,
    },
    discountPercent: mergedPricing[tier].discount,
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
  }));

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
        {/* Sidebar Checkboxes */}
        <div className="w-full lg:w-[22%] bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-purple-200">
          <div className="text-purple-800 font-semibold text-lg">
            The more products you subscribe, the more you save — tailored for growing businesses.
          </div>
          {availableTypes.map((type) => (
            <label
              key={type}
              className="inline-flex items-center gap-3 text-purple-800 text-lg font-medium cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleCheckboxChange(type)}
                className="accent-purple-600 w-5 h-5"
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
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
                {plans.map((plan, index) => (
                  <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
                    <SubscriptionCard
                      title={plan.title}
                      price={plan.price}
                      discountPercent={plan.discountPercent}
                      features={plan.features}
                      buttonText={plan.buttonText}
                      color={plan.color}
                      billingCycle={billingCycle}
                      icon={plan.icon}
                      selectedTypes={selectedTypes}
                    />
                  </div>
                ))}
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