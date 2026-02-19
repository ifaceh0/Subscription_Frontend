// // import { useState, useEffect } from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import ChangePlanCard from './ChangePlanCard';
// // import { User, Briefcase, Building2, Loader2, AlertCircle, Package } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { RefreshCw } from "lucide-react";

// // const ChangePlan = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { subscriptionDetails } = location.state || {};
// //   const [billingCycle, setBillingCycle] = useState('monthly');
// //   const [selectedTypes, setSelectedTypes] = useState(subscriptionDetails?.applications || []);
// //   const [pricingData, setPricingData] = useState(null);
// //   const [availableTypes, setAvailableTypes] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedPlan, setSelectedPlan] = useState(null);
// //   const [showConfirmModal, setShowConfirmModal] = useState(false);

// //   const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

// //   useEffect(() => {
// //     const fetchApplicationsAndPlans = async () => {
// //       try {
// //         const appResponse = await fetch(`${API_URL}/api/admin/applications`, {
// //           method: 'GET',
// //           headers: { 'Content-Type': 'application/json' },
// //         });
// //         if (!appResponse.ok) {
// //           throw new Error('Failed to fetch applications');
// //         }
// //         const appData = await appResponse.json();
// //         setAvailableTypes(appData.map(app => app.name.toLowerCase()));

// //         const planResponse = await fetch(`${API_URL}/api/subscription/plans`, {
// //           method: 'GET',
// //           headers: { 'Content-Type': 'application/json' },
// //         });
// //         if (!planResponse.ok) {
// //           throw new Error('Failed to fetch plans');
// //         }
// //         const planData = await planResponse.json();
// //         setPricingData(planData);

// //         setLoading(false);
// //       } catch (err) {
// //         setError(err.message);
// //         setLoading(false);
// //       }
// //     };
// //     fetchApplicationsAndPlans();
// //   }, []);

// //   const handleCheckboxChange = (type) => {
// //     setSelectedTypes((prev) =>
// //       prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
// //     );
// //     setSelectedPlan(null);
// //   };

// //   const handleChangePlan = async () => {
// //     const email = localStorage.getItem("CompanyEmail");
// //     if (!email) {
// //       setError("No email found. Please sign in again.");
// //       return;
// //     }
// //     if (!selectedPlan) {
// //       setError("Please select a plan.");
// //       return;
// //     }
// //     if (selectedTypes.length === 0) {
// //       setError("Please select at least one application.");
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           email,
// //           appNames: selectedTypes.join(","),
// //           newPlanTypeId: selectedPlan.planId,
// //         }),
// //       });
// //       const data = await response.json();
// //       if (data.message) {
// //         navigate("/subscription-dashboard", {
// //           state: { successMessage: "Plan changed successfully. You will receive a confirmation email soon." },
// //         });
// //       } else {
// //         setError(data.error || "Failed to change plan.");
// //       }
// //     } catch (err) {
// //       setError(`Failed to change plan: ${err.message}`);
// //     }
// //   };

// //   const mergedPricing = {
// //     Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
// //     Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
// //     Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
// //   };

// //   const currentPlanId = subscriptionDetails?.planId;
// //   ['Basic', 'Pro', 'Enterprise'].forEach((tier) => {
// //     pricingData?.forEach((plan) => {
// //       if (plan.planId === currentPlanId) return;
// //       const selectedTypesLower = selectedTypes.map((type) => type.toLowerCase());
// //       const applicationNamesLower = plan.applicationNames.map((name) => name.toLowerCase());
// //       const isSelectedAppsMatch = selectedTypesLower.every((type) =>
// //         applicationNamesLower.includes(type)
// //       );
// //       const isAppCountMatch = selectedTypesLower.length === applicationNamesLower.length;

// //       if (
// //         plan.planName.toLowerCase() === tier.toLowerCase() &&
// //         isSelectedAppsMatch &&
// //         isAppCountMatch &&
// //         plan.discountedPrice > 0
// //       ) {
// //         const interval = plan.interval.toLowerCase();
// //         mergedPricing[tier][interval] = plan.discountedPrice;
// //         mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
// //         mergedPricing[tier].planIds[interval] = plan.planId;
// //       }
// //     });
// //   });

// //   const formatPrice = (price, interval) => {
// //     if (price === 0) return null;
// //     if (interval === 'monthly') {
// //       return `$${parseFloat(price).toFixed(2)} /month`;
// //     } else if (interval === 'quarterly') {
// //       return `$${parseFloat(price).toFixed(2)} /quarter`;
// //     } else {
// //       return `$${parseFloat(price).toFixed(2)} /year`;
// //     }
// //   };

// //   const plans = ['Basic', 'Pro', 'Enterprise']
// //     .map((tier) => ({
// //       title: tier,
// //       price: {
// //         monthly: formatPrice(mergedPricing[tier].monthly, 'monthly'),
// //         quarterly: formatPrice(mergedPricing[tier].quarterly, 'quarterly'),
// //         yearly: formatPrice(mergedPricing[tier].yearly, 'yearly'),
// //       },
// //       discountPercent: mergedPricing[tier].discount,
// //       planIds: mergedPricing[tier].planIds,
// //       features:
// //         tier === 'Basic'
// //           ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
// //           : tier === 'Pro'
// //           ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
// //           : [
// //               'Unlimited users',
// //               'Unlimited storage',
// //               '24/7 dedicated support',
// //               'Advanced security features',
// //               'Custom development',
// //               'On-premise deployment option',
// //             ],
// //       buttonText: `Select ${tier} Plan`,
// //       color:
// //         tier === 'Basic'
// //           ? 'bg-purple-500'
// //           : tier === 'Pro'
// //           ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
// //           : 'bg-blue-600',
// //       icon: tier === 'Basic' ? User : tier === 'Pro' ? Briefcase : Building2,
// //     }))
// //     .filter((plan) => plan.price[billingCycle]);

// //   if (loading || availableTypes.length === 0) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
// //         <div className="flex flex-col items-center justify-center h-64">
// //           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
// //           <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
// //         <motion.div
// //           initial={{ opacity: 0, scale: 0.95 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           transition={{ duration: 0.3 }}
// //           className="p-8 max-w-md w-full text-center"
// //         >
// //           <div className="flex items-center justify-center gap-3 mb-4">
// //             <AlertCircle className="w-8 h-8 text-red-600" />
// //             <p className="text-xl font-semibold text-red-600">Error</p>
// //           </div>
// //           <p className="text-gray-600 mb-6">{error}</p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
// //           >
// //             <RefreshCw className="w-5 h-5" />
// //             Try Again
// //           </button>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
// //       <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
// //         Change Your Subscription Plan
// //       </h1>

// //       <div className="flex justify-center mb-8">
// //         <div className="inline-flex bg-white rounded-full p-1 shadow-md">
// //           {['monthly', 'quarterly', 'yearly'].map((cycle) => (
// //             <div key={cycle} className="relative mx-1">
// //               <button
// //                 onClick={() => setBillingCycle(cycle)}
// //                 className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 w-[100px] text-center ${
// //                   billingCycle === cycle
// //                     ? 'bg-purple-600 text-white'
// //                     : 'text-purple-700 bg-transparent'
// //                 }`}
// //               >
// //                 {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
// //         <div className="flex-1">
// //           {/* <div className="mb-8">
// //             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Applications</h3>
// //             <div className="space-y-4">
// //               {subscriptionDetails?.applications.map((app) => (
// //                 <div key={app} className="flex text-lg items-center">
// //                   <input
// //                     type="checkbox"
// //                     id={`app-${app}`}
// //                     checked={selectedTypes.includes(app)}
// //                     onChange={() => handleCheckboxChange(app)}
// //                     className="mr-2 h-5 w-5 text-indigo-600 rounded"
// //                   />
// //                   <label htmlFor={`app-${app}`}>{app}</label>
// //                 </div>
// //               ))}
// //             </div>
// //           </div> */}
// //           {/* <div className="mb-8">
// //             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Selected Applications For Change Plan</h3>
// //             <p className="text-lg text-gray-600">{selectedTypes.join(", ") || "None"}</p>
// //           </div> */}

// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.3 }}
// //             className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100 max-w-md mx-auto"
// //           >
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //               <Package className="w-5 h-5 text-indigo-600" />
// //               Selected Applications for plan change
// //             </h3>
// //             {selectedTypes.length > 0 ? (
// //               <div className="flex flex-wrap gap-2">
// //                 {selectedTypes.map((app) => (
// //                   <span
// //                     key={app}
// //                     className="inline-flex items-center px-8 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
// //                   >
// //                     {app}
// //                   </span>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 text-sm italic">No applications selected</p>
// //             )}
// //           </motion.div>

// //           {selectedTypes.length > 0 ? (
// //             <AnimatePresence mode="wait">
// //               <motion.div
// //                 key={selectedTypes.join('-') + billingCycle}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -20 }}
// //                 transition={{ duration: 0.3 }}
// //                 className="flex flex-wrap justify-center gap-8 px-2"
// //               >
// //                 {plans.length > 0 ? (
// //                   plans.map((plan, index) => (
// //                     <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
// //                       <ChangePlanCard
// //                         title={plan.title}
// //                         price={plan.price}
// //                         discountPercent={plan.discountPercent}
// //                         planIds={plan.planIds}
// //                         features={plan.features}
// //                         color={plan.color}
// //                         billingCycle={billingCycle}
// //                         icon={plan.icon}
// //                         selectedTypes={selectedTypes}
// //                         onSelect={() => {
// //                           setSelectedPlan({ ...plan, planId: plan.planIds[billingCycle] });
// //                           setShowConfirmModal(true);
// //                         }}
// //                         isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
// //                       />
// //                     </div>
// //                   ))
// //                 ) : (
// //                   <motion.div
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     exit={{ opacity: 0, y: -20 }}
// //                     transition={{ duration: 0.3 }}
// //                     className="flex justify-center items-center h-full min-h-[200px] text-center"
// //                   >
// //                     <p className="text-purple-600 font-medium text-lg">
// //                       No plans available for the selected applications.
// //                     </p>
// //                   </motion.div>
// //                 )}
// //               </motion.div>
// //             </AnimatePresence>
// //           ) : (
// //             <AnimatePresence mode="wait">
// //               <motion.div
// //                 key="no-plan"
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -20 }}
// //                 transition={{ duration: 0.3 }}
// //                 className="flex justify-center items-center h-full min-h-[200px] text-center"
// //               >
// //                 <p className="text-purple-600 font-medium text-lg">
// //                   No applications selected for plan change.
// //                 </p>
// //               </motion.div>
// //             </AnimatePresence>
// //           )}
// //         </div>
// //       </div>

// //       {showConfirmModal && (
// //         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
// //             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Plan Change</h3>
// //             <p className="text-gray-600 mb-6">
// //               Are you sure you want to change the plan for {selectedTypes.join(", ")} to {selectedPlan.title}?
// //             </p>
// //             <div className="flex justify-end space-x-4">
// //               <button
// //                 onClick={() => setShowConfirmModal(false)}
// //                 className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
// //               >
// //                 No
// //               </button>
// //               <button
// //                 onClick={handleChangePlan}
// //                 className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
// //               >
// //                 Yes, Change
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChangePlan;`




































// // import { useState, useEffect } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { User, Briefcase, Building2, Loader2, AlertCircle, Package } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { RefreshCw } from 'lucide-react';
// // import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// // import { loadStripe } from '@stripe/stripe-js';
// // import ChangePlanCard from './ChangePlanCard';

// // // Initialize Stripe with the public key from environment variable
// // const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// // const ChangePlan = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { subscriptionDetails } = location.state || {};
// //   const selectedApps = subscriptionDetails?.applications || [];
// //   const currentPlanId = subscriptionDetails?.planId;
// //   const [billingCycle, setBillingCycle] = useState('monthly');
// //   const [selectedTypes, setSelectedTypes] = useState(selectedApps);
// //   const [pricingData, setPricingData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedPlan, setSelectedPlan] = useState(null);
// //   const [showConfirmModal, setShowConfirmModal] = useState(false);
// //   const [showPaymentModal, setShowPaymentModal] = useState(false);
// //   const [clientSecret, setClientSecret] = useState(null);

// //   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

// //   useEffect(() => {
// //     if (!selectedApps || selectedApps.length === 0) {
// //       setError('No applications selected. Please select applications from the dashboard.');
// //       setLoading(false);
// //       return;
// //     }

// //     const email = localStorage.getItem('CompanyEmail');
// //     if (!email) {
// //       setError('No email found. Please sign in again.');
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchSubscribedPlans = async () => {
// //       try {
// //         const planResponse = await fetch(`${API_URL}/api/subscription/subscribed-plan?email=${encodeURIComponent(email)}`, {
// //           method: 'GET',
// //           headers: { 'Content-Type': 'application/json' },
// //         });
// //         if (!planResponse.ok) {
// //           throw new Error('Failed to fetch subscribed plans');
// //         }
// //         const planData = await planResponse.json();
// //         console.log('Subscribed Plans Response:', planData);
// //         setPricingData(planData || []);
// //         setLoading(false);
// //       } catch (err) {
// //         setError(err.message);
// //         setLoading(false);
// //       }
// //     };
// //     fetchSubscribedPlans();
// //   }, [selectedApps]);

// //   const fetchSetupIntent = async () => {
// //     const email = localStorage.getItem('CompanyEmail');
// //     try {
// //       const response = await fetch(`${API_URL}/api/subscription/create-setup-intent`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ email }),
// //       });
// //       const data = await response.json();
// //       console.log('Setup Intent Response:', data);
// //       if (data.clientSecret) {
// //         setClientSecret(data.clientSecret);
// //         setShowPaymentModal(true);
// //       } else {
// //         setError(data.error || 'Failed to initiate payment setup.');
// //       }
// //     } catch (err) {
// //       setError(`Failed to initiate payment setup: ${err.message}`);
// //     }
// //   };

// //   const handleChangePlan = async () => {
// //     const email = localStorage.getItem('CompanyEmail');
// //     if (!email) {
// //       setError('No email found. Please sign in again.');
// //       return;
// //     }
// //     if (!selectedPlan) {
// //       setError('Please select a plan.');
// //       return;
// //     }
// //     if (selectedTypes.length === 0) {
// //       setError('No applications selected.');
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           email,
// //           appNames: selectedTypes.join(','),
// //           newPlanTypeId: selectedPlan.planId,
// //         }),
// //       });
// //       const data = await response.json();
// //       console.log('Change Plan Response:', data);
// //       if (data.message) {
// //         navigate('/subscription-dashboard', {
// //           state: { successMessage: 'Plan changed successfully. You will receive a confirmation email soon.' },
// //         });
// //       } else if (data.error && data.error.includes('no attached payment source')) {
// //         setError('Please add a payment method to continue.');
// //         await fetchSetupIntent();
// //       } else {
// //         setError(data.error || 'Failed to change plan.');
// //       }
// //     } catch (err) {
// //       setError(`Failed to change plan: ${err.message}`);
// //     }
// //   };

// //   const PaymentForm = () => {
// //     const stripe = useStripe();
// //     const elements = useElements();
// //     const [paymentError, setPaymentError] = useState(null);
// //     const [paymentLoading, setPaymentLoading] = useState(false);

// //     const handleSubmit = async (event) => {
// //       event.preventDefault();
// //       if (!stripe || !elements) {
// //         return;
// //       }

// //       setPaymentLoading(true);
// //       try {
// //         const result = await stripe.confirmCardSetup(clientSecret, {
// //           payment_method: {
// //             card: elements.getElement(CardElement),
// //           },
// //         });

// //         if (result.error) {
// //           setPaymentError(result.error.message);
// //           setPaymentLoading(false);
// //         } else {
// //           setShowPaymentModal(false);
// //           setPaymentError(null);
// //           setPaymentLoading(false);
// //           handleChangePlan();
// //         }
// //       } catch (err) {
// //         setPaymentError('Failed to save payment method.');
// //         setPaymentLoading(false);
// //       }
// //     };

// //     return (
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <CardElement
// //           options={{
// //             style: {
// //               base: {
// //                 fontSize: '16px',
// //                 color: '#424770',
// //                 '::placeholder': { color: '#aab7c4' },
// //               },
// //               invalid: { color: '#9e2146' },
// //             },
// //           }}
// //         />
// //         {paymentError && <p className="text-red-600 text-sm">{paymentError}</p>}
// //         <div className="flex justify-end space-x-4">
// //           <button
// //             type="button"
// //             onClick={() => setShowPaymentModal(false)}
// //             className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             disabled={!stripe || paymentLoading}
// //             className={`bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 ${
// //               paymentLoading ? 'opacity-50 cursor-not-allowed' : ''
// //             }`}
// //           >
// //             {paymentLoading ? 'Processing...' : 'Save Payment Method'}
// //           </button>
// //         </div>
// //       </form>
// //     );
// //   };

// //   const mergedPricing = {
// //     Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
// //     Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
// //     Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
// //   };

// //   pricingData?.forEach((plan) => {
// //     if (plan.planId === currentPlanId) return; // Skip current plan
// //     const selectedTypesLower = selectedTypes.map((type) => type.toLowerCase());
// //     const applicationNamesLower = plan.applicationNames?.map((name) => name.toLowerCase()) || [];
// //     // Exact match: all selected types must be in plan and vice versa
// //     const isSelectedAppsMatch = selectedTypesLower.every((type) => applicationNamesLower.includes(type)) &&
// //       applicationNamesLower.every((name) => selectedTypesLower.includes(name));

// //     if (
// //       plan.planName.toLowerCase() === 'basic' ||
// //       plan.planName.toLowerCase() === 'pro' ||
// //       plan.planName.toLowerCase() === 'enterprise'
// //     ) {
// //       const tier = plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase();
// //       if (isSelectedAppsMatch && plan.discountedPrice > 0) {
// //         const interval = plan.interval.toLowerCase();
// //         // Use plan's monthlyBasePrice as base, adjust for multiple apps if needed
// //         let monthlyBasePrice = plan.monthlyBasePrice;
// //         if (selectedTypes.length > 1 && applicationNamesLower.length === selectedTypesLower.length) {
// //           // For combined plans, ensure the base price matches the combined total
// //           const individualPlans = pricingData.filter(p =>
// //             p.planName.toLowerCase() === plan.planName.toLowerCase() &&
// //             p.interval.toLowerCase() === 'monthly' &&
// //             p.applicationNames.length === 1 &&
// //             selectedTypesLower.includes(p.applicationNames[0].toLowerCase())
// //           );
// //           if (individualPlans.length === selectedTypes.length) {
// //             monthlyBasePrice = individualPlans.reduce((sum, p) => sum + p.monthlyBasePrice, 0);
// //           }
// //         }
// //         // Apply discount to get monthly price
// //         let monthlyPrice = monthlyBasePrice * (1 - plan.discountPercent / 100);
// //         if (interval === 'quarterly') {
// //           monthlyPrice = monthlyPrice; // Monthly price remains, total is monthlyPrice * 3
// //         } else if (interval === 'yearly') {
// //           monthlyPrice = monthlyPrice; // Monthly price remains, total is monthlyPrice * 12
// //         }
// //         // Only update if the price is not already set or this is a better match
// //         if (mergedPricing[tier][interval] === 0 || applicationNamesLower.length === selectedTypesLower.length) {
// //           mergedPricing[tier][interval] = monthlyPrice;
// //           mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
// //           mergedPricing[tier].planIds[interval] = plan.planId;
// //         }
// //       }
// //     }
// //   });

// //   const formatPrice = (price, interval) => {
// //     if (price === 0 || price == null) return 'N/A';
// //     const monthlyPrice = price; // Already monthly equivalent from mergedPricing
// //     if (interval === 'monthly') {
// //       return `$${parseFloat(monthlyPrice).toFixed(2)} /month`;
// //     } else if (interval === 'quarterly') {
// //       return `$${parseFloat(monthlyPrice * 3).toFixed(2)} /quarter`; // Show total quarterly price
// //     } else {
// //       return `$${parseFloat(monthlyPrice * 12).toFixed(2)} /year`; // Show total yearly price
// //     }
// //   };

// //   const plans = ['Basic', 'Pro', 'Enterprise']
// //     .map((tier) => ({
// //       title: tier,
// //       price: {
// //         monthly: formatPrice(mergedPricing[tier].monthly, 'monthly'),
// //         quarterly: formatPrice(mergedPricing[tier].quarterly, 'quarterly'),
// //         yearly: formatPrice(mergedPricing[tier].yearly, 'yearly'),
// //       },
// //       discountPercent: mergedPricing[tier].discount,
// //       planIds: mergedPricing[tier].planIds,
// //       features:
// //         tier === 'Basic'
// //           ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
// //           : tier === 'Pro'
// //           ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
// //           : [
// //               'Unlimited users',
// //               'Unlimited storage',
// //               '24/7 dedicated support',
// //               'Advanced security features',
// //               'Custom development',
// //               'On-premise deployment option',
// //             ],
// //       buttonText: `Select ${tier} Plan`,
// //       color:
// //         tier === 'Basic'
// //           ? 'bg-purple-500'
// //           : tier === 'Pro'
// //           ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
// //           : 'bg-blue-600',
// //       icon: tier === 'Basic' ? User : tier === 'Pro' ? Briefcase : Building2,
// //     }))
// //     .filter((plan) => plan.price[billingCycle] && plan.price[billingCycle] !== 'N/A');

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
// //         <div className="flex flex-col items-center justify-center h-64">
// //           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
// //           <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
// //         <motion.div
// //           initial={{ opacity: 0, scale: 0.95 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           transition={{ duration: 0.3 }}
// //           className="p-8 max-w-md w-full text-center"
// //         >
// //           <div className="flex items-center justify-center gap-3 mb-4">
// //             <AlertCircle className="w-8 h-8 text-red-600" />
// //             <p className="text-xl font-semibold text-red-600">Error</p>
// //           </div>
// //           <p className="text-gray-600 mb-6">{error}</p>
// //           <button
// //             onClick={() => navigate('/subscription-dashboard')}
// //             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
// //           >
// //             <RefreshCw className="w-5 h-5" />
// //             Back to Dashboard
// //           </button>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
// //       <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
// //         Change Your Subscription Plan
// //       </h1>

// //       <div className="flex justify-center mb-8">
// //         <div className="inline-flex bg-white rounded-full p-1 shadow-md">
// //           {['monthly', 'quarterly', 'yearly'].map((cycle) => (
// //             <div key={cycle} className="relative mx-1">
// //               <button
// //                 onClick={() => setBillingCycle(cycle)}
// //                 className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 w-[100px] text-center ${
// //                   billingCycle === cycle
// //                     ? 'bg-purple-600 text-white'
// //                     : 'text-purple-700 bg-transparent'
// //                 }`}
// //               >
// //                 {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
// //         <div className="flex-1">
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.3 }}
// //             className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100 max-w-md mx-auto"
// //           >
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //               <Package className="w-5 h-5 text-indigo-600" />
// //               Selected Applications
// //             </h3>
// //             {selectedTypes.length > 0 ? (
// //               <div className="flex flex-wrap gap-2">
// //                 {selectedTypes.map((app) => (
// //                   <span
// //                     key={app}
// //                     className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
// //                   >
// //                     {app}
// //                   </span>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 text-sm italic">No applications selected</p>
// //             )}
// //           </motion.div>

// //           <AnimatePresence mode="wait">
// //             <motion.div
// //               key={selectedTypes.join('-') + billingCycle}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -20 }}
// //               transition={{ duration: 0.3 }}
// //               className="flex flex-wrap justify-center gap-8 px-2"
// //             >
// //               {plans.length > 0 ? (
// //                 plans.map((plan, index) => (
// //                   <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
// //                     <ChangePlanCard
// //                       title={plan.title}
// //                       price={plan.price}
// //                       discountPercent={plan.discountPercent}
// //                       planIds={plan.planIds}
// //                       features={plan.features}
// //                       color={plan.color}
// //                       billingCycle={billingCycle}
// //                       icon={plan.icon}
// //                       selectedTypes={selectedTypes}
// //                       onSelect={() => {
// //                         setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
// //                         setShowConfirmModal(true);
// //                       }}
// //                       isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
// //                     />
// //                   </div>
// //                 ))
// //               ) : (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -20 }}
// //                   transition={{ duration: 0.3 }}
// //                   className="flex justify-center items-center h-full min-h-[200px] text-center"
// //                 >
// //                   <p className="text-purple-600 font-medium text-lg">
// //                     No plans available for {selectedTypes.join(', ')} in the {billingCycle} billing cycle.
// //                   </p>
// //                 </motion.div>
// //               )}
// //             </motion.div>
// //           </AnimatePresence>
// //         </div>
// //       </div>

// //       {showConfirmModal && (
// //         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
// //             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Plan Change</h3>
// //             <p className="text-gray-600 mb-6">
// //               Are you sure you want to change {selectedTypes.join(', ')} to {selectedPlan.title} ({billingCycle})?
// //             </p>
// //             <div className="flex justify-end space-x-4">
// //               <button
// //                 onClick={() => setShowConfirmModal(false)}
// //                 className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
// //               >
// //                 No
// //               </button>
// //               <button
// //                 onClick={handleChangePlan}
// //                 className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
// //               >
// //                 Yes, Change
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {showPaymentModal && clientSecret && (
// //         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
// //             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Payment Method</h3>
// //             <p className="text-gray-600 mb-6">
// //               Please add a payment method to proceed with the plan change.
// //             </p>
// //             <Elements stripe={stripePromise}>
// //               <PaymentForm />
// //             </Elements>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChangePlan;
















// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { User, Briefcase, Building2, Loader2, AlertCircle, Package, RefreshCw } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import ChangePlanCard from './ChangePlanCard';

// const ChangePlan = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { selectedApps } = location.state || [];
//   const [billingCycle, setBillingCycle] = useState('monthly');
//   const [selectedTypes, setSelectedTypes] = useState(selectedApps);
//   const [pricingData, setPricingData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const sessionId = params.get('session_id');
//     const changePlan = params.get('change_plan');

//     if (sessionId && changePlan === 'true') {
//       const checkStatus = async () => {
//         const email = localStorage.getItem('CompanyEmail');
//         if (!email) return;
//         try {
//           const response = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`);
//           if (response.ok) {
//             navigate('/subscription-dashboard', {
//               state: { successMessage: 'Plan changed successfully. You will receive a confirmation email soon.' },
//             });
//           } else {
//             setTimeout(checkStatus, 3000); // Retry after 3 seconds
//           }
//         } catch (err) {
//           setTimeout(checkStatus, 3000);
//         }
//       };
//       setTimeout(checkStatus, 3000); // Initial delay of 3 seconds
//     }

//     if (!selectedApps || selectedApps.length === 0) {
//       setError('No applications selected. Please select applications from the dashboard.');
//       setLoading(false);
//       return;
//     }

//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please sign in again.');
//       setLoading(false);
//       return;
//     }

//     const fetchAvailablePlans = async () => {
//       try {
//         const planResponse = await fetch(`${API_URL}/api/subscription/subscribed-plan?email=${encodeURIComponent(email)}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (!planResponse.ok) {
//           throw new Error('Failed to fetch subscribed plans');
//         }
//         const planData = await planResponse.json();
//         console.log('Subscribed Plans Response:', planData);
//         setPricingData(planData || []);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchAvailablePlans();
//   }, [selectedApps, navigate, location]);

//   const handleChangePlan = async () => {
//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please sign in again.');
//       return;
//     }
//     if (!selectedPlan) {
//       setError('Please select a plan.');
//       return;
//     }
//     if (selectedTypes.length === 0) {
//       setError('No applications selected.');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email,
//           appNames: selectedTypes.join(','),
//           newPlanTypeId: selectedPlan.planId,
//         }),
//       });
//       const data = await response.json();
//       console.log('Change Plan Response:', data);
//       if (data.checkoutUrl) {
//         window.location.href = data.checkoutUrl;
//       } else {
//         setError(data.error || 'Failed to initiate plan change.');
//       }
//     } catch (err) {
//       setError(`Failed to change plan: ${err.message}`);
//     }
//   };

//   const mergedPricing = {
//     Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
//     Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
//     Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
//   };

//   pricingData?.forEach((plan) => {
//     const selectedTypesLower = selectedTypes.map((type) => type.toLowerCase());
//     const applicationNamesLower = plan.applicationNames?.map((name) => name.toLowerCase()) || [];
//     const isSelectedAppsMatch = selectedTypesLower.every((type) => applicationNamesLower.includes(type)) &&
//       applicationNamesLower.every((name) => selectedTypesLower.includes(name));

//     if (
//       plan.planName.toLowerCase() === 'basic' ||
//       plan.planName.toLowerCase() === 'pro' ||
//       plan.planName.toLowerCase() === 'enterprise'
//     ) {
//       const tier = plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase();
//       if (isSelectedAppsMatch && plan.discountedPrice > 0) {
//         const interval = plan.interval.toLowerCase();
//         let monthlyBasePrice = plan.monthlyBasePrice;
//         if (selectedTypes.length > 1 && applicationNamesLower.length === selectedTypesLower.length) {
//           const individualPlans = pricingData.filter(p =>
//             p.planName.toLowerCase() === plan.planName.toLowerCase() &&
//             p.interval.toLowerCase() === 'monthly' &&
//             p.applicationNames.length === 1 &&
//             selectedTypesLower.includes(p.applicationNames[0].toLowerCase())
//           );
//           if (individualPlans.length === selectedTypes.length) {
//             monthlyBasePrice = individualPlans.reduce((sum, p) => sum + p.monthlyBasePrice, 0);
//           }
//         }
//         let monthlyPrice = monthlyBasePrice * (1 - plan.discountPercent / 100);
//         if (interval === 'quarterly') {
//           monthlyPrice = monthlyPrice;
//         } else if (interval === 'yearly') {
//           monthlyPrice = monthlyPrice;
//         }
//         if (mergedPricing[tier][interval] === 0 || applicationNamesLower.length === selectedTypesLower.length) {
//           mergedPricing[tier][interval] = monthlyPrice;
//           mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
//           mergedPricing[tier].planIds[interval] = plan.planId;
//         }
//       }
//     }
//   });

//   const formatPrice = (price, interval) => {
//     if (price === 0 || price == null) return 'N/A';
//     const monthlyPrice = price;
//     if (interval === 'monthly') {
//       return `$${parseFloat(monthlyPrice).toFixed(2)} /month`;
//     } else if (interval === 'quarterly') {
//       return `$${parseFloat(monthlyPrice * 3).toFixed(2)} /quarter`;
//     } else {
//       return `$${parseFloat(monthlyPrice * 12).toFixed(2)} /year`;
//     }
//   };

//   const plans = ['Basic', 'Pro', 'Enterprise']
//     .map((tier) => ({
//       title: tier,
//       price: {
//         monthly: formatPrice(mergedPricing[tier].monthly, 'monthly'),
//         quarterly: formatPrice(mergedPricing[tier].quarterly, 'quarterly'),
//         yearly: formatPrice(mergedPricing[tier].yearly, 'yearly'),
//       },
//       discountPercent: mergedPricing[tier].discount,
//       planIds: mergedPricing[tier].planIds,
//       features:
//         tier === 'Basic'
//           ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
//           : tier === 'Pro'
//           ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
//           : [
//               'Unlimited users',
//               'Unlimited storage',
//               '24/7 dedicated support',
//               'Advanced security features',
//               'Custom development',
//               'On-premise deployment option',
//             ],
//       buttonText: `Select ${tier} Plan`,
//       color:
//         tier === 'Basic'
//           ? 'bg-purple-500'
//           : tier === 'Pro'
//           ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
//           : 'bg-blue-600',
//       icon: tier === 'Basic' ? User : tier === 'Pro' ? Briefcase : Building2,
//     }))
//     .filter((plan) => plan.price[billingCycle] && plan.price[billingCycle] !== 'N/A');

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
//         <div className="flex flex-col items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
//           <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details...</p>
//         </div>
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
//             onClick={() => navigate('/subscription-dashboard')}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Back to Dashboard
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
//       <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
//         Change Your Subscription Plan
//       </h1>

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
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
//         <div className="flex-1">
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100 max-w-md mx-auto"
//           >
//             <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <Package className="w-5 h-5 text-indigo-600" />
//               Selected Applications
//             </h3>
//             {selectedTypes.length > 0 ? (
//               <div className="flex flex-wrap gap-2">
//                 {selectedTypes.map((app) => (
//                   <span
//                     key={app}
//                     className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
//                   >
//                     {app}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-sm italic">No applications selected</p>
//             )}
//           </motion.div>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedTypes.join('-') + billingCycle}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-wrap justify-center gap-8 px-2"
//             >
//               {plans.length > 0 ? (
//                 plans.map((plan, index) => (
//                   <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
//                     <ChangePlanCard
//                       title={plan.title}
//                       price={plan.price}
//                       discountPercent={plan.discountPercent}
//                       planIds={plan.planIds}
//                       features={plan.features}
//                       color={plan.color}
//                       billingCycle={billingCycle}
//                       icon={plan.icon}
//                       selectedTypes={selectedTypes}
//                       onSelect={() => {
//                         setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
//                         setShowConfirmModal(true);
//                       }}
//                       isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="flex justify-center items-center h-full min-h-[200px] text-center"
//                 >
//                   <p className="text-purple-600 font-medium text-lg">
//                     No plans available for {selectedTypes.join(', ')} in the {billingCycle} billing cycle.
//                   </p>
//                 </motion.div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>

//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Plan Change</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to change {selectedTypes.join(', ')} to {selectedPlan.title} ({billingCycle})?
//               This will take effect at the end of the current billing period.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={() => setShowConfirmModal(false)}
//                 className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
//               >
//                 No
//               </button>
//               <button
//                 onClick={handleChangePlan}
//                 className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
//               >
//                 Yes, Change
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChangePlan;










//new
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { User, Loader2, AlertCircle, Package, RefreshCw } from 'lucide-react';
// import {  
//     FiLoader
// } from "react-icons/fi";
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import ChangePlanCard from './ChangePlanCard';

// const ChangePlan = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { selectedApps = [], subscriptionId } = location.state || {};
//   const [billingCycle, setBillingCycle] = useState('month');
//   const [selectedTypes, setSelectedTypes] = useState(selectedApps);
//   const [pricingData, setPricingData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   useEffect(() => {
//     console.log('Selected Apps from location.state:', selectedApps); // Debug log
//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please provide an email to change plans.');
//       setLoading(false);
//       return;
//     }
//     if (!selectedApps || selectedApps.length === 0) {
//       setError('No applications selected. Please select applications from the dashboard.');
//       setLoading(false);
//       return;
//     }

//     const fetchAvailablePlans = async () => {
//       setLoading(true);
//       try {
//         const query = selectedTypes.length > 0
//           ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type)}`).join('&')}`
//           : '';
//         const response = await fetch(`${API_URL}/api/subscription/subscribed-plan${query}&email=${encodeURIComponent(email)}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           if (response.status === 404) throw new Error('No alternative plans available for selected applications.');
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Backend response from /subscribed-plan:', data); // Debug log
//         setPricingData(data || []);
//       } catch (err) {
//         setError(`Failed to fetch plans: ${err.message}`);
//         toast.error(`Error: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAvailablePlans();
//   }, [selectedApps, navigate]);

//   const handleChangePlan = async () => {
//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please provide an email to change plans.');
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

//     // setLoading(true);
//     try {
//       const lowercaseAppNames = selectedTypes.map(type => type.toLowerCase());
//       console.log('Sending change plan request:', { email, appNames: lowercaseAppNames, newPlanTypeId: selectedPlan.planId, newInterval: billingCycle }); // Debug log
//       const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           appNames: lowercaseAppNames,
//           newPlanTypeId: selectedPlan.planId,
//           newInterval: billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1), // Match backend expected format (Monthly, Quarterly, Yearly)
//           activationDate: Math.floor(Date.now() / 1000), // Current timestamp
//         }),
//       });
//       const data = await response.json();
//       console.log('Change plan response:', data); // Debug log
//       if (response.ok && data.checkoutUrl) {
//         toast.success('Redirecting to checkout...');
//         window.location.href = data.checkoutUrl;
//       } else {
//         setError(data.message || 'Failed to initiate plan change.');
//         toast.error(data.message || 'Failed to change plan.');
//       }
//     } catch (err) {
//       setError(`Failed to change plan: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } 
//     // finally {
//     //   setLoading(false);
//     // }
//   };

//   const mergedPricing = {
//     Basic: { month: 0, quarter: 0, year: 0, discount: { month: 0, quarter: 0, year: 0 }, planIds: { month: null, quarter: null, year: null }, features: [] },
//   };

//   pricingData.forEach((plan) => {
//     const selectedTypesLower = selectedTypes.map(type => type.toLowerCase()).sort();
//     const applicationNamesLower = (plan.applicationNames || []).map(name => name.toLowerCase()).sort();
//     const isSelectedAppsMatch = selectedTypesLower.length === applicationNamesLower.length &&
//       selectedTypesLower.every((type, index) => type === applicationNamesLower[index]);
//     console.log(`Checking plan:`, { plan, selectedTypesLower, applicationNamesLower, isSelectedAppsMatch }); // Debug log
//     if (isSelectedAppsMatch && plan.planName.toLowerCase() === 'basic') {
//       const interval = plan.interval.toLowerCase().replace('ly', '');
//       mergedPricing.Basic[interval] = plan.discountedPrice || 0;
//       mergedPricing.Basic.discount[interval] = plan.discountPercent || 0;
//       mergedPricing.Basic.planIds[interval] = plan.planId;
//       mergedPricing.Basic.features = plan.features || ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features'];
//     }
//   });

//   console.log('Merged Pricing:', mergedPricing); // Debug log

//   const formatPrice = (price, interval) => {
//     if (price === 0 || price == null) return 'N/A';
//     if (interval === 'month') return `$${parseFloat(price).toFixed(2)} /month`;
//     if (interval === 'quarter') return `$${parseFloat(price).toFixed(2)} /quarter`;
//     return `$${parseFloat(price).toFixed(2)} /year`;
//   };

//   const plans = ['Basic']
//     .map((tier) => ({
//       title: tier,
//       price: {
//         month: formatPrice(mergedPricing[tier].month, 'month'),
//         quarter: formatPrice(mergedPricing[tier].quarter, 'quarter'),
//         year: formatPrice(mergedPricing[tier].year, 'year'),
//       },
//       discountPercent: mergedPricing[tier].discount,
//       planIds: mergedPricing[tier].planIds,
//       features: mergedPricing[tier].features,
//       buttonText: `Select ${tier} Plan`,
//       color: 'bg-purple-500',
//       icon: User,
//     }))
//     .filter((plan) => plan.price[billingCycle] !== 'N/A');

//   console.log('Filtered Plans:', plans); // Debug log

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex flex-col items-center justify-center h-64"
//         >
//           <FiLoader className="h-14 w-14 text-purple-600 animate-spin" />
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
//             <AlertCircle className="w-8 h-8 text-red-500" />
//             <p className="text-xl font-semibold text-red-500">Error</p>
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
//     <div className="min-h-screen bg-gray-100 px-6 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
//           Change Your Subscription Plan
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
//                       : 'text-gray-700 bg-transparent hover:bg-gray-100'
//                   }`}
//                   aria-label={`Select ${cycle} billing cycle`}
//                 >
//                   {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
//                 </button>
//                 {/* {(cycle === 'quarter' || cycle === 'year') && (
//                   <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 w-[max-content] text-white text-[10px] px-2 py-0.5 rounded-full shadow z-10">
//                     {cycle === 'quarter' ? '2-7% OFF' : '4-7% OFF'}
//                   </span>
//                 )} */}
//                 {/* {mergedPricing.Basic.discount[cycle] > 0 && (
//                   <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow z-10">
//                     {mergedPricing.Basic.discount[cycle]}% OFF
//                   </span>
//                 )} */}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
//           <div className="flex-1">
//             {/* <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-6 bg-white rounded shadow-sm p-4 border border-gray-100 max-w-md mx-auto"
//             >
//               <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-indigo-600" />
//                 Selected Applications
//               </h3>
//               {selectedTypes.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {selectedTypes.map((app) => (
//                     <span
//                       key={app}
//                       className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
//                     >
//                       {app}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-sm italic">No applications selected</p>
//               )}
//             </motion.div> */}

//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={selectedTypes.join('-') + billingCycle}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex flex-wrap mt-8 justify-center gap-8 px-2"
//               >
//                 {plans.length > 0 ? (
//                   plans.map((plan, index) => (
//                     <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
//                       <ChangePlanCard
//                         title={plan.title}
//                         price={plan.price}
//                         discountPercent={plan.discountPercent}
//                         planIds={plan.planIds}
//                         features={plan.features}
//                         color={plan.color}
//                         billingCycle={billingCycle}
//                         icon={plan.icon}
//                         selectedTypes={selectedTypes}
//                         onSelect={() => {
//                           setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
//                           setShowConfirmModal(true);
//                         }}
//                         isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
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
//                     <p className="text-gray-600 font-medium text-lg">
//                       No alternative plans available for {selectedTypes.join(', ')} in the {billingCycle} billing cycle.
//                     </p>
//                   </motion.div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>

//         {showConfirmModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-plan-title">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded p-8 max-w-md w-full shadow-2xl"
//             >
//               <h3 id="confirm-plan-title" className="text-2xl font-semibold text-gray-800 mb-4">Confirm Plan Change</h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to change {selectedTypes.join(', ')} to {selectedPlan.title} ({billingCycle})?
//                 This will take effect at the end of the current billing period.
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   disabled={loading} // Disable "No" during processing
//                   className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   aria-label="Cancel plan change"
//                 >
//                   No
//                 </button>
//                 <button
//                   onClick={handleChangePlan}
//                   className={`min-w-[140px] bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors flex items-center justify-center gap-2 ${
//                     loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
//                   }`}
//                   disabled={loading}
//                   aria-label="Confirm plan change"
//                 >
//                   {loading ? (
//                     <>
//                       Processing...
//                       <FiLoader className="h-5 w-5 animate-spin" />
//                     </>
//                   ) : (
//                     'Yes, Change'
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

// export default ChangePlan;










import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Loader2, AlertCircle, Package, RefreshCw } from 'lucide-react';
import { FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ChangePlanCard from './ChangePlanCard';
import { useLocation as useCountryLocation } from '../../contexts/LocationContext';

const ChangePlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedApps = [] } = location.state || {};
  const [billingCycle, setBillingCycle] = useState('month');
  const [selectedTypes] = useState(selectedApps);
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { countryCode } = useCountryLocation();

  useEffect(() => {
    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError('No email found. Please provide an email to change plans.');
      setLoading(false);
      return;
    }
    if (!selectedApps || selectedApps.length === 0) {
      setError('No applications selected. Please select applications from the dashboard.');
      setLoading(false);
      return;
    }

    const fetchAvailablePlans = async () => {
      setLoading(true);
      try {
        const query = selectedTypes.length > 0
          ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type)}`).join('&')}`
          : '';
        const response = await fetch(`${API_URL}/api/subscription/subscribed-plan${query}&email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'X-User-Location': countryCode
           },
        });
        if (!response.ok) {
          if (response.status === 404) throw new Error('No alternative plans available for selected applications.');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPricingData(data || []);
      } catch (err) {
        setError(`Failed to fetch plans: ${err.message}`);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailablePlans();
  }, [selectedApps, navigate]);

  // const handleChangePlan = async () => {
  //   const email = localStorage.getItem('CompanyEmail');
  //   if (!email || !selectedPlan || selectedTypes.length === 0) return;

  //   setModalLoading(true);
  //   try {
  //     const lowercaseAppNames = selectedTypes.map(type => type.toLowerCase());
  //     const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email,
  //         appNames: lowercaseAppNames,
  //         newPlanTypeId: selectedPlan.planId,
  //         newInterval: billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1),
  //         activationDate: Math.floor(Date.now() / 1000),
  //       }),
  //     });
  //     const data = await response.json();
  //     if (response.ok && data.checkoutUrl) {
  //       toast.success('Redirecting to checkout...');
  //       window.location.href = data.checkoutUrl;
  //     } else {
  //       setError(data.message || 'Failed to initiate plan change.');
  //       toast.error(data.message || 'Failed to change plan.');
  //     }
  //   } catch (err) {
  //     setError(`Failed to change plan: ${err.message}`);
  //     toast.error(`Error: ${err.message}`);
  //   } finally {
  //     setModalLoading(false);
  //     setShowConfirmModal(false);
  //   }
  // };

  const handleChangePlan = async () => {
    const email = localStorage.getItem('CompanyEmail');
    if (!email || !selectedPlan || selectedTypes.length === 0) return;

    setModalLoading(true);
    try {
      const lowercaseAppNames = selectedTypes.map(type => type.toLowerCase());
      const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Location': countryCode
        },
        body: JSON.stringify({
          email,
          appNames: lowercaseAppNames,
          newPlanTypeId: selectedPlan.planId,
          newInterval: billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1),
          activationDate: Math.floor(Date.now() / 1000),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Case 1: Needs checkout → redirect
        if (data.checkoutUrl) {
          toast.success('Redirecting to checkout...');
          window.location.href = data.checkoutUrl;
        } 
        // Case 2: Success without checkout → show success and go to dashboard
        else {
          const successMsg = data.message || 'Plan changed successfully. You will receive a confirmation email soon.';
          toast.success(successMsg);
          navigate('/subscription-dashboard', {
            state: { successMessage: successMsg }
          });
        }
      } else {
        const errMsg = data.message || 'Failed to change plan.';
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      setError(`Failed to change plan: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setModalLoading(false);
      setShowConfirmModal(false);
    }
  };

  // FIXED: formatPrice defined BEFORE use
  // const formatPrice = (price, interval) => {
  //   if (price === 0 || price == null) return 'N/A';
  //   if (interval === 'month') return `$${parseFloat(price).toFixed(2)} /month`;
  //   if (interval === 'quarter') return `$${parseFloat(price).toFixed(2)} /quarter`;
  //   return `$${parseFloat(price).toFixed(2)} /year`;
  // };

  // Dynamic tiers from backend
  const uniqueTiers = [...new Set(pricingData.map(plan => 
    plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase()
  ))];

  const plans = uniqueTiers
    .map((tier) => {
      const matchingPlan = pricingData.find(plan => 
        plan.planName.toLowerCase() === tier.toLowerCase() &&
        plan.interval.toLowerCase().includes(billingCycle) &&
        plan.applicationNames?.length === selectedTypes.length &&
        selectedTypes.every(app => 
          plan.applicationNames?.map(n => n.toLowerCase()).includes(app.toLowerCase())
        )
      );

      if (!matchingPlan) return null;

      const intervalKey = billingCycle;

      return {
        title: tier,
        // price: {
        //   month: formatPrice(matchingPlan.discountedPrice, 'month'),
        //   quarter: formatPrice(matchingPlan.discountedPrice, 'quarter'),
        //   year: formatPrice(matchingPlan.discountedPrice, 'year'),
        // },
        price: {
          month: matchingPlan.formattedPrice || '0.00',    // ← Use backend formatted string
          quarter: matchingPlan.formattedPrice || '0.00',
          year: matchingPlan.formattedPrice || '0.00',
        },
        discountPercent: { [intervalKey]: matchingPlan.discountPercent || 0 },
        planIds: { [intervalKey]: matchingPlan.planId },
        features: matchingPlan.features || [],
        selectedTypes,
        buttonText: `Select ${tier} Plan`,
        color: tier === 'Basic' ? 'bg-purple-500' : 
               tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 
               'bg-blue-600',
        icon: User,
      };
    })
    .filter(plan => plan !== null && plan.planIds[billingCycle] !== null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div className="flex flex-col items-center">
          <FiLoader className="h-14 w-14 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-600 text-lg">Loading plans for change application plan...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div className="bg-white rounded shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-500 mb-4">Error</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subscription-dashboard')}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a 
                href="https://www.ifaceh.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                {/* <Star className="h-5 w-5 text-violet-600 fill-violet-100" /> */}
                <span className="font-bold text-xl sm:text-2xl">
                  <span className="text-gray-900">Interface</span>
                  <span className="text-violet-600">Hub</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>
      <motion.div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Change Your Subscription Plan
        </h1>

        {/* Billing Cycle Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
            {['month', 'quarter', 'year'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingCycle === cycle
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1) + (cycle === 'year' ? 'ly' : 'ly')}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Apps */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">
            Changing plan for: <strong>{selectedTypes.join(', ')}</strong>
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={billingCycle}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ChangePlanCard
                    title={plan.title}
                    price={plan.price}
                    discountPercent={plan.discountPercent}
                    planIds={plan.planIds}
                    features={plan.features}
                    color={plan.color}
                    billingCycle={billingCycle}
                    icon={plan.icon}
                    selectedTypes={plan.selectedTypes}
                    onSelect={() => {
                      setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
                      setShowConfirmModal(true);
                    }}
                    isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">
                  No alternative plans available for {selectedTypes.join(', ')} in {billingCycle} billing.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Plan Change</h3>
              <p className="text-gray-600 mb-8">
                Change <strong>{selectedTypes.join(', ')}</strong> to <strong>{selectedPlan.title}</strong> ({billingCycle})?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={modalLoading}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePlan}
                  disabled={modalLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {modalLoading ? (
                    <>
                      Processing...
                      <FiLoader className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    'Yes, Change'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChangePlan;