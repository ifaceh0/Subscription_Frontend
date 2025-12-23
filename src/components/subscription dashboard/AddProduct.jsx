// //new
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Loader2, AlertCircle, Package, RefreshCw } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import AddProductCard from './AddProductCard';

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { selectedApps = [] } = location.state || {};
//   const [billingCycle, setBillingCycle] = useState('month');
//   const [selectedTypes, setSelectedTypes] = useState(selectedApps);
//   const [pricingData, setPricingData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   useEffect(() => {
//     console.log('Selected Apps from location.state:', selectedApps);
//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please sign in again.');
//       setLoading(false);
//       return;
//     }
//     if (!selectedApps || selectedApps.length === 0) {
//       setError('No applications selected. Please select applications from the dashboard.');
//       setLoading(false);
//       return;
//     }

//     const fetchPlans = async () => {
//       setLoading(true);
//       try {
//         const query = selectedTypes.length > 0
//           ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type.toLowerCase())}`).join('&')}`
//           : '';
//         const response = await fetch(`${API_URL}/api/subscription/unsubscribed-plans${query}&email=${encodeURIComponent(email)}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           if (response.status === 404) throw new Error('No plans available for the selected applications.');
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Backend response from /unsubscribed-plans:', data);
//         setPricingData(data || []);
//       } catch (err) {
//         setError(`Failed to fetch plans: ${err.message}`);
//         toast.error(`Error: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlans();
//   }, [selectedApps, navigate]);

//   const handleAddPlan = async () => {
//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please sign in again.');
//       toast.error('No email found.');
//       return;
//     }
//     if (!selectedPlan) {
//       toast.error('Please select a plan.');
//       return;
//     }
//     if (selectedTypes.length === 0) {
//       toast.error('No applications selected.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/subscription/add-app`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           appNames: selectedTypes.map(type => type.toLowerCase()),
//           newPlanId: selectedPlan.planId,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok && data.message) {
//         toast.success(data.message);
//         navigate('/subscription-dashboard');
//       } else {
//         setError(data.error || 'Failed to add product.');
//         toast.error(data.error || 'Failed to add product.');
//       }
//     } catch (err) {
//       setError(`Failed to add product: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//       setShowConfirmModal(false);
//     }
//   };

//   const mergedPricing = {
//     Basic: { month: null, quarter: null, year: null, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [], applications: [] },
//     Pro: { month: null, quarter: null, year: null, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [], applications: [] },
//     Enterprise: { month: null, quarter: null, year: null, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [], applications: [] },
//   };

//   pricingData.forEach((plan, index) => {
//     console.log(`Processing plan ${index}:`, plan);
//     const selectedTypesLower = selectedTypes.map(type => type.toLowerCase()).sort();
//     const applicationNamesLower = (plan.applicationNames || []).map(name => name.toLowerCase()).sort();
//     const isSelectedAppsMatch = selectedTypesLower.length === applicationNamesLower.length &&
//       selectedTypesLower.every((type, i) => type === applicationNamesLower[i]);
//     if (isSelectedAppsMatch && ['basic', 'pro', 'enterprise'].includes(plan.planName.toLowerCase())) {
//       const tier = plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase();
//       const interval = plan.interval.toLowerCase().replace('ly', '');
//       console.log(`Mapping plan ${plan.planId} to tier ${tier}, interval ${interval}`);
//       mergedPricing[tier][interval] = plan.discountedPrice || null;
//       mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
//       mergedPricing[tier].planIds[interval] = plan.planId || null;
//       mergedPricing[tier].features = plan.features || [];
//       mergedPricing[tier].applications = plan.applicationNames || [];
//     }
//   });

//   console.log('Merged pricing:', JSON.stringify(mergedPricing, null, 2));

//   const formatPrice = (price, interval) => {
//     if (price === null || price === undefined) return 'N/A';
//     return `$${parseFloat(price).toFixed(2)} /${interval}`;
//   };

//   const plans = ['Basic', 'Pro', 'Enterprise']
//     .map((tier) => ({
//       title: tier,
//       price: {
//         month: formatPrice(mergedPricing[tier].month, 'month'),
//         quarter: formatPrice(mergedPricing[tier].quarter, 'quarter'),
//         year: formatPrice(mergedPricing[tier].year, 'year'),
//       },
//       discountPercent: mergedPricing[tier].discount,
//       planIds: mergedPricing[tier].planIds,
//       applications: mergedPricing[tier].applications,
//       features: mergedPricing[tier].features.length > 0
//         ? mergedPricing[tier].features
//         : (tier === 'Basic'
//             ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
//             : tier === 'Pro'
//             ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
//             : [
//                 'Unlimited users',
//                 'Unlimited storage',
//                 '24/7 dedicated support',
//                 'Advanced security features',
//                 'Custom development',
//                 'On-premise deployment option',
//               ]),
//       buttonText: `Add ${tier} Plan`,
//       color: tier === 'Basic' ? 'bg-purple-500' : tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-blue-600',
//     }))
//     .filter((plan) => plan.planIds[billingCycle] !== null);

//   console.log('Plans:', JSON.stringify(plans, null, 2));

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex flex-col items-center justify-center h-64"
//         >
//           <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
//           <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="assertive">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//             <p className="text-xl font-semibold text-red-600">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/subscription-dashboard')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
//             aria-label="Back to dashboard"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Back to Dashboard
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto"
//       >
//         <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
//           Add a New Product
//         </h1>

//         <div className="flex justify-center mb-8">
//           <div className="inline-flex bg-white rounded-full p-1 shadow-md">
//             {['month', 'quarter', 'year'].map((cycle) => (
//               <div key={cycle} className="relative mx-1">
//                 <button
//                   onClick={() => setBillingCycle(cycle)}
//                   className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 w-[100px] text-center ${
//                     billingCycle === cycle
//                       ? 'bg-purple-600 text-white'
//                       : 'text-purple-700 bg-transparent hover:bg-purple-100'
//                   }`}
//                   aria-label={`Select ${cycle} billing cycle`}
//                 >
//                   {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
//                 </button>
//                 {mergedPricing.Basic.discount[cycle] > 0 && (
//                   <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow z-10">
//                     {mergedPricing.Basic.discount[cycle]}% OFF
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="mb-6 bg-white rounded-lg shadow-md p-6 border border-gray-100 max-w-md mx-auto"
//         >
//           <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
//             <Package className="w-5 h-5 text-indigo-600" />
//             Selected Applications
//           </h3>
//           {selectedTypes.length > 0 ? (
//             <div className="flex flex-wrap gap-2">
//               {selectedTypes.map((app) => (
//                 <span
//                   key={app}
//                   className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
//                 >
//                   {app}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm italic">No applications selected</p>
//           )}
//         </motion.div>

//         <section className="mb-12">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//             <Package className="w-6 h-6 text-indigo-600" />
//             Available Plans
//           </h2>
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedTypes.join('-') + billingCycle}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {plans.length > 0 ? (
//                 plans.map((plan, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className="bg-white rounded-lg shadow-md border border-gray-100"
//                   >
//                     <AddProductCard
//                       title={plan.title}
//                       price={plan.price}
//                       discountPercent={plan.discountPercent}
//                       planIds={plan.planIds}
//                       features={plan.features}
//                       color={plan.color}
//                       billingCycle={billingCycle}
//                       selectedTypes={selectedTypes}
//                       applications={plan.applications}
//                       onSelect={() => {
//                         setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
//                         setShowConfirmModal(true);
//                       }}
//                       isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
//                     />
//                   </motion.div>
//                 ))
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white rounded-lg shadow-md p-6 border border-gray-100 col-span-full text-center"
//                 >
//                   <p className="text-gray-600 text-lg">
//                     No plans available for {selectedTypes.join(', ')} in the {billingCycle} billing cycle.
//                   </p>
//                 </motion.div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </section>

//         {showConfirmModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-add-title">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg"
//             >
//               <h3 id="confirm-add-title" className="text-2xl font-semibold text-gray-800 mb-4">Confirm Add Product</h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to add {selectedTypes.join(', ')} to {selectedPlan.title} ({billingCycle})?
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
//                   aria-label="Cancel adding product"
//                 >
//                   No
//                 </button>
//                 <button
//                   onClick={handleAddPlan}
//                   className={`bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors ${
//                     loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
//                   }`}
//                   disabled={loading}
//                   aria-label="Confirm adding product"
//                 >
//                   {loading ? 'Processing...' : 'Yes, Add'}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default AddProduct;











import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import {  
    FiLoader
} from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import AddProductCard from './AddProductCard';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedApps = ["Referral"] } = location.state || {}; // Default to ["Referral"] for testing
  const [billingCycle] = useState('quarter'); // Changed to 'quarter' to match backend
  const [selectedTypes, setSelectedTypes] = useState(selectedApps);
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

  useEffect(() => {
    console.log('Selected Apps from location.state:', selectedApps);
    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError('No email found. Please sign in again.');
      setLoading(false);
      return;
    }
    if (!selectedApps || selectedApps.length === 0) {
      setError('No applications selected. Please select applications from the dashboard.');
      setLoading(false);
      return;
    }

    const fetchPlans = async () => {
      setLoading(true);
      try {
        const query = selectedTypes.length > 0
          ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type)}`).join('&')}`
          : '';
        const response = await fetch(`${API_URL}/api/subscription/unsubscribed-plans${query}&email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          if (response.status === 404) throw new Error('No plans available for the selected applications.');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Backend response from /unsubscribed-plans:', data);
        setPricingData(data || []);
      } catch (err) {
        setError(`Failed to fetch plans: ${err.message}`);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedApps, navigate]);

  const handleAddPlan = async () => {
    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError('No email found. Please sign in again.');
      toast.error('No email found.');
      return;
    }
    if (!selectedPlan) {
      toast.error('Please select a plan.');
      return;
    }
    if (selectedTypes.length === 0) {
      toast.error('No applications selected.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/subscription/add-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          appNames: selectedTypes.map(type => type.toLowerCase()),
          newPlanId: selectedPlan.planId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.message) {
        toast.success(data.message);
        navigate('/subscription-dashboard');
      } else {
        setError(data.error || 'Failed to add product.');
        toast.error(data.error || 'Failed to add product.');
      }
    } catch (err) {
      setError(`Failed to add product: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const mergedPricing = {
    Basic: { month: null, quarter: null, year: null, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [], applications: [] },
    Pro: { month: null, quarter: null, year: null, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [], applications: [] },
    Enterprise: { month: null, quarter: null, year: null, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [], applications: [] },
  };

  pricingData.forEach((plan) => {
    const selectedTypesLower = selectedTypes.map(type => type.toLowerCase()).sort();
    const applicationNamesLower = (plan.applicationNames || []).map(name => name.toLowerCase()).sort();
    const isSelectedAppsMatch = selectedTypesLower.length === applicationNamesLower.length &&
      selectedTypesLower.every((type, i) => type === applicationNamesLower[i]);
    if (isSelectedAppsMatch && ['basic', 'pro', 'enterprise'].includes(plan.planName.toLowerCase())) {
      const tier = plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase();
      const interval = plan.interval.toLowerCase().replace('ly', '');
      mergedPricing[tier][interval] = plan.discountedPrice || null;
      mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
      mergedPricing[tier].planIds[interval] = plan.planId || null;
      mergedPricing[tier].features = plan.features || [];
      mergedPricing[tier].applications = plan.applicationNames || [];
    }
  });

  const formatPrice = (price, interval) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${parseFloat(price).toFixed(2)} /${interval}`;
  };

  const plans = ['Basic', 'Pro', 'Enterprise']
    .map((tier) => ({
      title: tier,
      price: {
        month: formatPrice(mergedPricing[tier].month, 'month'),
        quarter: formatPrice(mergedPricing[tier].quarter, 'quarter'),
        year: formatPrice(mergedPricing[tier].year, 'year'),
      },
      discountPercent: mergedPricing[tier].discount,
      planIds: mergedPricing[tier].planIds,
      applications: mergedPricing[tier].applications,
      features: mergedPricing[tier].features.length > 0
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
    }))
    .filter((plan) => plan.planIds[billingCycle] !== null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <FiLoader className="h-12 w-12 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="assertive">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <p className="text-xl font-semibold text-red-600">Error</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subscription-dashboard')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium"
            aria-label="Back to dashboard"
          >
            <RefreshCw className="w-5 h-5" />
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-24 text-center">
            Add New Product
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTypes.join('-') + billingCycle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded max-w-sm shadow-md border border-gray-100"
                  >
                    <AddProductCard
                      title={plan.title}
                      price={plan.price}
                      discountPercent={plan.discountPercent}
                      planIds={plan.planIds}
                      features={plan.features}
                      color={plan.color}
                      billingCycle={billingCycle}
                      selectedTypes={selectedTypes}
                      applications={plan.applications}
                      onSelect={() => {
                        setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
                        setShowConfirmModal(true);
                      }}
                      isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded shadow-md p-6 border border-gray-100 col-span-full text-center"
                >
                  <p className="text-gray-600 text-lg">
                    No plans available for the selected applications.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-add-title">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded p-8 max-w-md w-full shadow-lg"
              >
                <h3 id="confirm-add-title" className="text-2xl font-semibold text-gray-800 mb-4">Confirm Add Product</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to add {selectedTypes.join(', ')} to {selectedPlan.title} ({billingCycle})?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-400 transition-colors"
                    aria-label="Cancel adding product"
                  >
                    No
                  </button>
                  <button
                    onClick={handleAddPlan}
                    className={`bg-purple-600 text-white font-semibold py-2 px-6 rounded transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                    }`}
                    disabled={loading}
                    aria-label="Confirm adding product"
                  >
                    {loading ? 'Processing...' : 'Yes, Add'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
  );
};

export default AddProduct;