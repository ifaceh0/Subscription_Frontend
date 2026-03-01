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











// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
// import {  
//     FiLoader
// } from "react-icons/fi";
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import AddProductCard from './AddProductCard';

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { selectedApps = ["Referral"] } = location.state || {}; // Default to ["Referral"] for testing
//   const [billingCycle] = useState('quarter'); // Changed to 'quarter' to match backend
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
//           ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type)}`).join('&')}`
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

//   pricingData.forEach((plan) => {
//     const selectedTypesLower = selectedTypes.map(type => type.toLowerCase()).sort();
//     const applicationNamesLower = (plan.applicationNames || []).map(name => name.toLowerCase()).sort();
//     const isSelectedAppsMatch = selectedTypesLower.length === applicationNamesLower.length &&
//       selectedTypesLower.every((type, i) => type === applicationNamesLower[i]);
//     if (isSelectedAppsMatch && ['basic', 'pro', 'enterprise'].includes(plan.planName.toLowerCase())) {
//       const tier = plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase();
//       const interval = plan.interval.toLowerCase().replace('ly', '');
//       mergedPricing[tier][interval] = plan.discountedPrice || null;
//       mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
//       mergedPricing[tier].planIds[interval] = plan.planId || null;
//       mergedPricing[tier].features = plan.features || [];
//       mergedPricing[tier].applications = plan.applicationNames || [];
//     }
//   });

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

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex flex-col items-center justify-center h-64"
//         >
//           <FiLoader className="h-12 w-12 text-purple-600 animate-spin" />
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
//           className="bg-white rounded shadow-lg p-8 max-w-md w-full text-center"
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//             <p className="text-xl font-semibold text-red-600">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/subscription-dashboard')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium"
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
//       <div className="min-h-screen bg-gray-100 px-6 py-8">
//         <h1 className="text-5xl font-bold text-gray-800 mb-24 text-center">
//             Add New Product
//         </h1>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="max-w-7xl mx-auto"
//         >
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
//                     className="bg-white rounded max-w-sm shadow-md border border-gray-100"
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
//                   className="bg-white rounded shadow-md p-6 border border-gray-100 col-span-full text-center"
//                 >
//                   <p className="text-gray-600 text-lg">
//                     No plans available for the selected applications.
//                   </p>
//                 </motion.div>
//               )}
//             </motion.div>
//           </AnimatePresence>

//           {showConfirmModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-add-title">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-white rounded p-8 max-w-md w-full shadow-lg"
//               >
//                 <h3 id="confirm-add-title" className="text-2xl font-semibold text-gray-800 mb-4">Confirm Add Product</h3>
//                 <p className="text-gray-600 mb-6">
//                   Are you sure you want to add {selectedTypes.join(', ')} to {selectedPlan.title} ({billingCycle})?
//                 </p>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     onClick={() => setShowConfirmModal(false)}
//                     className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-400 transition-colors"
//                     aria-label="Cancel adding product"
//                   >
//                     No
//                   </button>
//                   <button
//                     onClick={handleAddPlan}
//                     className={`bg-purple-600 text-white font-semibold py-2 px-6 rounded transition-colors ${
//                       loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
//                     }`}
//                     disabled={loading}
//                     aria-label="Confirm adding product"
//                   >
//                     {loading ? 'Processing...' : 'Yes, Add'}
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </motion.div>
//       </div>
//   );
// };

// export default AddProduct;












// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
// import { FiLoader } from "react-icons/fi";
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import AddProductCard from './AddProductCard';
// import { useLocation as useCountryLocation } from '../../contexts/LocationContext';

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { selectedApps = [] } = location.state || {};
//   const [billingCycle, setBillingCycle] = useState('month');
//   const [selectedTypes] = useState(selectedApps);
//   const [pricingData, setPricingData] = useState([]);
//   const [adding, setAdding] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const API_URL = import.meta.env.VITE_API_BASE_URL;
//   const { countryCode } = useCountryLocation();

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
//           ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type)}`).join('&')}`
//           : '';
//         const response = await fetch(`${API_URL}/api/subscription/unsubscribed-plans${query}&email=${encodeURIComponent(email)}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-User-Location': countryCode
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

//     setAdding(true);
//     try {
//       const response = await fetch(`${API_URL}/api/subscription/add-app`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-User-Location': countryCode
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
//       setAdding(false);
//       setShowConfirmModal(false);
//     }
//   };

//   // const formatPrice = (price, interval) => {
//   //   if (price === 0 || price == null) return 'N/A';
//   //   if (interval === 'month') return `$${parseFloat(price).toFixed(2)} /month`;
//   //   if (interval === 'quarter') return `$${parseFloat(price).toFixed(2)} /quarter`;
//   //   return `$${parseFloat(price).toFixed(2)} /year`;
//   // };

// //   const mergedPricing = {
// //   Basic: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
// //   Pro: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
// //   Enterprise: { month: {}, quarter: {}, year: {}, discount: {}, planIds: {} },
// // };

// // ['Basic', 'Pro', 'Enterprise'].forEach(tier => {
// //     const intervalMap = { monthly: 'month', quarterly: 'quarter', yearly: 'year' };
// //     pricingData.forEach(plan => {
// //       const selectedTypesLower = selectedTypes.map(t => t.toLowerCase());
// //       const applicationNamesLower = plan.applicationNames.map(n => n.toLowerCase());

// //       const isExactMatch = 
// //         selectedTypesLower.length === applicationNamesLower.length &&
// //         selectedTypesLower.every(t => applicationNamesLower.includes(t)) &&
// //         selectedTypesLower.length > 0;

// //       if (plan.planName.toLowerCase() === tier.toLowerCase() && isExactMatch) {
// //         const interval = intervalMap[plan.interval.toLowerCase()];
// //         if (interval) {
// //           mergedPricing[tier][interval] = {
// //             price: plan.discountedPrice || 0,
// //             formatted: plan.formattedPrice || '0.00'
// //           };
// //           mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
// //           mergedPricing[tier].planIds[interval] = plan.planId;
// //         }
// //       }
// //     });
// //   });

//   const uniqueTiers = [...new Set(pricingData.map(plan => 
//     plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase()
//   ))];

//   const plans = uniqueTiers
//     .map((tier) => {
//       const matchingPlan = pricingData.find(plan => 
//         plan.planName.toLowerCase() === tier.toLowerCase() &&
//         plan.interval.toLowerCase().includes(billingCycle) && 
//         plan.applicationNames?.length === selectedTypes.length &&
//         selectedTypes.every(app => 
//           plan.applicationNames?.map(n => n.toLowerCase()).includes(app.toLowerCase())
//         )
//       );

//       if (!matchingPlan) return null;

//       const intervalKey = billingCycle;

//       // return {
//       //   title: tier,
//       //   price: {
//       //     month: formatPrice(matchingPlan.discountedPrice, 'month'),
//       //     quarter: formatPrice(matchingPlan.discountedPrice, 'quarter'),
//       //     year: formatPrice(matchingPlan.discountedPrice, 'year'),
//       //   },
//       //   discountPercent: { [intervalKey]: matchingPlan.discountPercent || 0 },
//       //   planIds: { [intervalKey]: matchingPlan.planId },
//       //   features: matchingPlan.features || [],
//       //   applications: matchingPlan.applicationNames || [],
//       //   buttonText: `Add ${tier} Plan`,
//       //   color: tier === 'Basic' ? 'bg-purple-500' : 
//       //          tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 
//       //          'bg-blue-600',
//       // };
//       return {
//         title: tier,
//         price: {
//             month: matchingPlan.formattedPrice || '0.00',    // ← Use backend formatted string
//             quarter: matchingPlan.formattedPrice || '0.00',
//             year: matchingPlan.formattedPrice || '0.00',
//           },
//         discountPercent: { [intervalKey]: matchingPlan.discountPercent || 0 },
//         planIds: { [intervalKey]: matchingPlan.planId },
//         features: matchingPlan.features || [],
//         applications: matchingPlan.applicationNames || [],
//         buttonText: `Add ${tier} Plan`,
//         color: tier === 'Basic' ? 'bg-purple-500' : 
//               tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 
//               'bg-blue-600',
//       };
//     })
//     .filter(plan => plan !== null && plan.planIds[billingCycle] !== null);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex flex-col items-center justify-center h-64"
//         >
//           <FiLoader className="h-12 w-12 text-purple-600 animate-spin" />
//           <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details for add product plan...</p>
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
//           className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//             <p className="text-xl font-semibold text-red-600">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/subscription-dashboard')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium"
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
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-4">
//               <a 
//                 href="https://www.ifaceh.com/" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-3"
//               >
//                 {/* <Star className="h-5 w-5 text-violet-600 fill-violet-100" /> */}
//                 <span className="font-bold text-xl sm:text-2xl">
//                   <span className="text-gray-900">Interface</span>
//                   <span className="text-violet-600">Hub</span>
//                 </span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </header>
//       <h1 className="text-5xl font-bold text-gray-800 mb-12 mt-8 text-center">
//         Add New Product
//       </h1>

//       {/* Billing Cycle Selector */}
//       <div className="flex justify-center mb-12">
//         <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
//           {['month', 'quarter', 'year'].map((cycle) => (
//             <button
//               key={cycle}
//               onClick={() => setBillingCycle(cycle)}
//               className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
//                 billingCycle === cycle
//                   ? 'bg-purple-600 text-white'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               {cycle.charAt(0).toUpperCase() + cycle.slice(1) + (cycle === 'year' ? 'ly' : 'ly')}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Selected Apps Display */}
//       <div className="text-center mb-8">
//         <p className="text-lg text-gray-700">
//           Adding: <strong>{selectedTypes.join(', ')}</strong>
//         </p>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto p-4"
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={selectedTypes.join('-') + billingCycle}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//           >
//             {plans.length > 0 ? (
//               plans.map((plan, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <AddProductCard
//                     title={plan.title}
//                     price={plan.price}
//                     discountPercent={plan.discountPercent}
//                     planIds={plan.planIds}
//                     features={plan.features}
//                     color={plan.color}
//                     billingCycle={billingCycle}
//                     selectedTypes={selectedTypes}
//                     applications={plan.applications}
//                     onSelect={() => {
//                       setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
//                       setShowConfirmModal(true);
//                     }}
//                     isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
//                   />
//                 </motion.div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-xl text-gray-600">
//                   No plans available for {selectedTypes.join(', ')} in {billingCycle} billing.
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>

//         {/* Confirm Modal with Local Loading */}
//         {showConfirmModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-add-title">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
//             >
//               <h3 id="confirm-add-title" className="text-2xl font-bold text-gray-800 mb-4">Confirm Add Product</h3>
//               <p className="text-gray-600 mb-8">
//                 Add <strong>{selectedTypes.join(', ')}</strong> to <strong>{selectedPlan.title}</strong> plan ({billingCycle})?
//               </p>
//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   disabled={adding}
//                   className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                   aria-label="Cancel adding product"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddPlan}
//                   disabled={adding}
//                   className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
//                   aria-label="Confirm adding product"
//                 >
//                   {adding ? (
//                     <>
//                       Processing...
//                       <FiLoader className="h-5 w-5 animate-spin" />
//                     </>
//                   ) : (
//                     'Yes, Add'
//                   )}
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








// updated code for language change
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import AddProductCard from './AddProductCard';
import { useLocation as useCountryLocation } from '../../contexts/LocationContext';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import FeatureDetailsModal from '../Modal/FeatureDetailsModal';

const AddProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedApps = [] } = location.state || {};
  const [billingCycle, setBillingCycle] = useState('month');
  const [selectedTypes] = useState(selectedApps);
  const [pricingData, setPricingData] = useState([]);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { countryCode } = useCountryLocation();
  const [selectedTierForModal, setSelectedTierForModal] = useState(null);

  useEffect(() => {
    console.log('Selected Apps from location.state:', selectedApps);
    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError(t('addProduct.noEmailFound'));
      setLoading(false);
      return;
    }
    if (!selectedApps || selectedApps.length === 0) {
      setError(t('addProduct.noAppsSelected'));
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
            'X-User-Location': countryCode
          },
        });
        if (!response.ok) {
          if (response.status === 404) throw new Error(t('addProduct.noPlansAvailable'));
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Backend response from /unsubscribed-plans:', data);
        setPricingData(data || []);
      } catch (err) {
        setError(`${t('addProduct.failedToFetchPlans')}: ${err.message}`);
        toast.error(`${t('addProduct.error')}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedApps, navigate]);

  const handleAddPlan = async () => {
    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError(t('addProduct.noEmailFound'));
      toast.error(t('addProduct.noEmailFound'));
      return;
    }
    if (!selectedPlan) {
      toast.error(t('addProduct.selectPlanFirst'));
      return;
    }
    if (selectedTypes.length === 0) {
      toast.error(t('addProduct.noAppsSelected'));
      return;
    }

    setAdding(true);
    try {
      const response = await fetch(`${API_URL}/api/subscription/add-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Location': countryCode
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
        setError(data.error || t('addProduct.failedToAdd'));
        toast.error(data.error || t('addProduct.failedToAdd'));
      }
    } catch (err) {
      setError(`${t('addProduct.failedToAdd')}: ${err.message}`);
      toast.error(`${t('addProduct.error')}: ${err.message}`);
    } finally {
      setAdding(false);
      setShowConfirmModal(false);
    }
  };

  const planHighlights = {
    Basic: t('subscription.planHighlights.Basic', { returnObjects: true }) || [],
    Pro: t('subscription.planHighlights.Pro', { returnObjects: true }) || [],
    Enterprise: t('subscription.planHighlights.Enterprise', { returnObjects: true }) || [],
  };

  const planDetails = {
    Basic: t('subscription.planDetails.Basic', { returnObjects: true }) || [],
    Pro: t('subscription.planDetails.Pro', { returnObjects: true }) || [],
    Enterprise: t('subscription.planDetails.Enterprise', { returnObjects: true }) || [],
  };

  const uniqueTiers = [...new Set(pricingData.map(plan => 
    plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase()
  ))];

  // const plans = uniqueTiers
  //   .map((tier) => {
  //     const matchingPlan = pricingData.find(plan => 
  //       plan.planName.toLowerCase() === tier.toLowerCase() &&
  //       plan.interval.toLowerCase().includes(billingCycle) && 
  //       plan.applicationNames?.length === selectedTypes.length &&
  //       selectedTypes.every(app => 
  //         plan.applicationNames?.map(n => n.toLowerCase()).includes(app.toLowerCase())
  //       )
  //     );

  //     if (!matchingPlan) return null;

  //     const intervalKey = billingCycle;

  //     return {
  //       title: tier,
  //       price: {
  //           month: matchingPlan.formattedPrice || '0.00',
  //           quarter: matchingPlan.formattedPrice || '0.00',
  //           year: matchingPlan.formattedPrice || '0.00',
  //         },
  //       discountPercent: { [intervalKey]: matchingPlan.discountPercent || 0 },
  //       planIds: { [intervalKey]: matchingPlan.planId },
  //       features: matchingPlan.features || [],
  //       applications: matchingPlan.applicationNames || [],
  //       buttonText: `${t('addProduct.add')} ${tier} ${t('addProduct.plan')}`,
  //       color: tier === 'Basic' ? 'bg-purple-500' : 
  //             tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 
  //             'bg-blue-600',
  //     };
  //   })
  //   .filter(plan => plan !== null && plan.planIds[billingCycle] !== null);

  const plans = ['Basic', 'Pro', 'Enterprise'].map(tier => {
    const tierPlans = pricingData.filter(plan =>
      plan.planName.toLowerCase() === tier.toLowerCase() &&
      plan.applicationNames?.length === selectedTypes.length &&
      selectedTypes.every(app =>
        plan.applicationNames.map(n => n.toLowerCase()).includes(app.toLowerCase())
      )
    );

    if (tierPlans.length === 0) return null;

    const priceObj = {};
    const discountObj = {};
    const planIdObj = {};

    tierPlans.forEach(plan => {
      let key;
      const intervalLower = plan.interval.toLowerCase();
      if (intervalLower === 'monthly') key = 'month';
      else if (intervalLower === 'quarterly') key = 'quarter';
      else if (intervalLower === 'yearly') key = 'year';
      else return;

      priceObj[key] = plan.formattedPrice || '0.00';
      discountObj[key] = plan.discountPercent || 0;
      planIdObj[key] = plan.planId;
    });

    return {
      title: tier,
      price: priceObj,
      discountPercent: discountObj,
      planIds: planIdObj,
      features: planHighlights[tier] || [],
      applications: tierPlans[0]?.applicationNames || [],
      buttonText: `${t('addProduct.add')} ${tier} ${t('addProduct.plan')}`,
      color: tier === 'Basic' ? 'bg-purple-500' :
            tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
            'bg-blue-600',
    };
  }).filter(Boolean);

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
          <p className="mt-4 text-gray-600 text-lg">{t('addProduct.loadingPlans')}</p>
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
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <p className="text-xl font-semibold text-red-600">{t('addProduct.error')}</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subscription-dashboard')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-all duration-200 font-medium"
            aria-label="Back to dashboard"
          >
            <RefreshCw className="w-5 h-5" />
            {t('addProduct.backToDashboard')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <h1 className="text-5xl font-bold text-gray-800 mb-12 mt-8 text-center">
        {t('addProduct.addNewProduct')}
      </h1>

      {/* Billing Cycle Selector */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
          {['month', 'quarter', 'year'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                billingCycle === cycle
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t(`addProduct.${cycle}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Apps Display */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-700">
          {t('addProduct.adding')}: <strong>{selectedTypes.join(', ')}</strong>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTypes.join('-') + billingCycle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                    onShowMore={() => setSelectedTierForModal(plan.title)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">
                  {t('addProduct.noPlansAvailableFor', { 
                    apps: selectedTypes.join(', '), 
                    cycle: billingCycle 
                  })}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Confirm Modal with Local Loading */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-add-title">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
            >
              <h3 id="confirm-add-title" className="text-2xl font-bold text-gray-800 mb-4">{t('addProduct.confirmAddProduct')}</h3>
              <p className="text-gray-600 mb-8">
                {t('addProduct.confirmAddMessage', {
                  apps: selectedTypes.join(', '),
                  plan: selectedPlan.title,
                  cycle: t(`addProduct.${billingCycle}`)
                })}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={adding}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cancel adding product"
                >
                  {t('addProduct.cancel')}
                </button>
                <button
                  onClick={handleAddPlan}
                  disabled={adding}
                  className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                  aria-label="Confirm adding product"
                >
                  {adding ? (
                    <>
                      {t('addProduct.processing')}
                      <FiLoader className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    t('addProduct.yesAdd')
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        <FeatureDetailsModal
          isOpen={!!selectedTierForModal}
          onClose={() => setSelectedTierForModal(null)}
          tier={selectedTierForModal || ''}
          content={planDetails[selectedTierForModal] || []}
        />
      </motion.div>
    </div>
  );
};

export default AddProduct;