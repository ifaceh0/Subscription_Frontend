import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SubscriptionCard from './SubscriptionCard';
import { User, Star, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const Subscription = ({ defaultApp = '' }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appFromQuery = queryParams.get('app');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [billingCycle, setBillingCycle] = useState('month');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || delay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
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
        const response = await fetchWithBackoff(`${API_URL}/api/admin/applications`, {
          method: 'GET',
        });
        const data = await response.json();
        const types = data.map(app => app.name.toLowerCase());
        setAvailableTypes(types);
        console.log('Available Types:', types);
      } catch (err) {
        setError('Failed to fetch applications.');
        toast.error(`Error fetching applications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const response = await fetchWithBackoff(`${API_URL}/api/subscription/allPlans`, {
          method: 'GET',
        });
        const data = await response.json();
        setPricingData(data);
        console.log('Pricing Data:', data);
      } catch (err) {
        setError('Failed to fetch plans.');
        toast.error('Error fetching plans.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (appFromQuery && selectedTypes.length === 0 && availableTypes.length > 0) {
      const mappedType = appFromQuery.toLowerCase();
      if (availableTypes.includes(mappedType)) {
        setSelectedTypes([mappedType]);
      }
    } else if (!appFromQuery && defaultApp && selectedTypes.length === 0 && availableTypes.length > 0) {
      const mappedDefault = defaultApp.toLowerCase();
      if (availableTypes.includes(mappedDefault)) {
        setSelectedTypes([mappedDefault]);
      }
    }
  }, [appFromQuery, defaultApp, availableTypes, selectedTypes.length]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // if (loading || availableTypes.length === 0) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6" role="alert" aria-live="polite">
  //       <motion.div
  //         initial={{ opacity: 0, scale: 0.95 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ duration: 0.5 }}
  //         className="p-10 max-w-md w-full text-center"
  //       >
  //         <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
  //         <p className="text-2xl font-bold text-gray-800">Fetching the Best Deals</p>
  //         <p className="text-gray-500 mt-2">Loading subscription plans and application details...</p>
  //       </motion.div>
  //     </div>
  //   );
  // }

  if (loading || availableTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6" role="alert" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, y: 10 }} // Subtle lift animation on appear
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10 max-w-md w-full text-center rounded shadow-indigo-100/50" // Added modern card styling
        >
          {/* Modern Pulsing Ring Animation */}
          <div className="mx-auto mb-6 relative w-16 h-16">
            
            {/* Inner Ring (The stable center) */}
            <div className="w-8 h-8 rounded-full bg-violet-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Outer Pulsing Ring (The modern animation) */}
            <motion.div
              animate={{ 
                scale: [0.8, 1.4], // Scale out and back
                opacity: [0.7, 0],   // Fade out as it scales
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeOut",
              }}
              className="w-full h-full rounded-full border-4 border-violet-500 absolute top-0 left-0"
            />
          </div>

          <p className="text-2xl font-extrabold text-gray-900 tracking-tight">Fetching the Best Deals</p>
          <p className="text-gray-500 mt-2 text-base">Loading subscription plans and application details...</p>
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
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-2xl font-bold text-red-600 mb-2">Connection Error</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md"
            aria-label="Retry loading plans"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </button>
        </motion.div>
      </div>
    );
  }

  const mergedPricing = {
    Basic: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null } },
    Pro: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null } },
    Enterprise: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null } },
  };

  ['Basic', 'Pro', 'Enterprise'].forEach(tier => {
    const intervalMap = { monthly: 'month', quarterly: 'quarter', yearly: 'year' };
    pricingData.forEach(plan => {
      const selectedTypesLower = selectedTypes.map(type => type.toLowerCase());
      const applicationNamesLower = plan.applicationNames.map(name => name.toLowerCase());
      const isSelectedAppsMatch = selectedTypesLower.every(type => applicationNamesLower.includes(type));
      if (plan.planName.toLowerCase() === tier.toLowerCase() && isSelectedAppsMatch && selectedTypesLower.length > 0) {
        const interval = intervalMap[plan.interval.toLowerCase()];
        if (!mergedPricing[tier][interval] || applicationNamesLower.length === selectedTypesLower.length) {
          mergedPricing[tier][interval] = plan.discountedPrice || 0;
          mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
          mergedPricing[tier].planIds[interval] = plan.planId;
          console.log(`Matched Plan: ${plan.planId}, Interval: ${interval}, Price: ${plan.discountedPrice}, Discount: ${plan.discountPercent}`);
        }
      }
    });
  });

  const formatPrice = (price, interval) => {
    if (interval === 'month') {
      return `$${parseFloat(price || 0).toFixed(2)} /month`;
    } else if (interval === 'quarter') {
      return `$${parseFloat(price || 0).toFixed(2)} /quarter`;
    } else {
      return `$${parseFloat(price || 0).toFixed(2)} /year`;
    }
  };

  const plans = ['Basic', 'Pro', 'Enterprise'].map(tier => ({
    title: tier,
    price: {
      month: formatPrice(mergedPricing[tier].month, 'month'),
      quarter: formatPrice(mergedPricing[tier].quarter, 'quarter'),
      year: formatPrice(mergedPricing[tier].year, 'year'),
    },
    discountPercent: mergedPricing[tier].discount,
    planIds: mergedPricing[tier].planIds,
    features: mergedPricing[tier].features?.length > 0
      ? mergedPricing[tier].features
      : (tier === 'Basic'
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
            ]),
    buttonText: `Add ${tier} Plan`,
    color: tier === 'Basic' ? 'bg-purple-500' : tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-blue-600',
    icon: User,
  }));

  console.log('Merged Pricing:', mergedPricing);
  console.log('Plans:', plans);

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Flexible Pricing, Zero Hassle
          </h1>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Scale your business with the perfect combination of applications and billing cycles.
          </p>
        </div>
      </motion.div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white rounded-full p-1 shadow-xl border border-gray-100">
          {['month', 'quarter', 'year'].map(cycle => (
            <div key={cycle} className="relative mx-1">
              <button
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-2 rounded-full font-bold transition-all duration-300 w-[120px] text-center text-lg ${
                  billingCycle === cycle
                    ? 'bg-violet-600 text-white shadow-lg shadow-indigo-200'
                    : 'text-gray-600 bg-transparent hover:bg-gray-100'
                }`}
                aria-label={`Select ${cycle} billing cycle`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </button>
              {/* {mergedPricing.Basic.discount[cycle] > 0 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10 animate-pulse-slow">
                  {mergedPricing.Basic.discount[cycle]}% OFF
                </span>
              )} */}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/5 bg-white rounded shadow-xl p-6 h-fit sticky top-6 border border-violet-100"
        >
          <div className="text-violet-800 font-extrabold text-2xl mb-4 border-b pb-4 border-violet-100">
            Select Applications
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Bundle the tools you need and see the combined pricing below.
          </p>
          <div className="space-y-3">
            {availableTypes.map(type => (
              <label
                key={type}
                className={`flex items-center gap-3 p-2 rounded-full transition-all duration-200 cursor-pointer border-2 ${
                  selectedTypes.includes(type) ? 'bg-violet-50 border-violet-300 shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-violet-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                  className="appearance-none w-5 h-5 border-2 rounded-full transition-all duration-200 accent-violet-600 checked:bg-violet-600 checked:border-violet-600 focus:ring-2 focus:ring-violet-500"
                  aria-checked={selectedTypes.includes(type)}
                  aria-label={`Select ${type} application`}
                />
                <span className="text-gray-800 font-semibold text-lg capitalize">
                  {type}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-8 text-center border-t pt-4 border-violet-100">
            <button
              onClick={() => setSelectedTypes([])}
              className="w-full px-4 py-2 text-violet-600 border border-violet-300 rounded-full hover:bg-violet-50 transition-all duration-200 font-medium"
              aria-label="Clear all selected applications"
            >
              Clear Selection
            </button>
          </div>
        </motion.div>

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
                    <div className="md:col-span-2 lg:col-span-3 text-center p-10 bg-white rounded shadow-lg border border-gray-100">
                      <p className="text-gray-500 font-medium text-xl">
                        No plans available that match *exactly* your selected products.
                        <br />Please try selecting a different combination.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex justify-center items-center h-full min-h-[400px]">
              <motion.div
                key="no-plan-selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center p-6 bg-white rounded shadow-lg border border-gray-100"
              >
                <p className="text-gray-500 font-medium text-xl flex items-center gap-3">
                  <Star className="w-6 h-6 text-violet-500 fill-violet-500" />
                  Choose your applications in the sidebar to view tailored plans.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;