// import { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Package, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, CreditCard, FileText } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const SubscriptionDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dashboardData, setDashboardData] = useState({ subscriptions: [], appHistory: [], plans: [], subscriptionHistory: [] });
//   const [error, setError] = useState(location.state?.successMessage || '');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
//   const [selectedCancelApps, setSelectedCancelApps] = useState([]);
//   const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.successMessage);
//   const [showChangePlanSelectionModal, setShowChangePlanSelectionModal] = useState(false);
//   const [selectedChangePlanApps, setSelectedChangePlanApps] = useState([]);
//   const [showAddProductSelectionModal, setShowAddProductSelectionModal] = useState(false);
//   const [selectedAddProductApps, setSelectedAddProductApps] = useState([]);
//   const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);
//   const modalRef = useRef(null);
//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape' && (showCancelSelectionModal || showCancelConfirmModal || showChangePlanSelectionModal || showAddProductSelectionModal || showSuccessModal)) {
//         closeAllModals();
//       }
//     };
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [showCancelSelectionModal, showCancelConfirmModal, showChangePlanSelectionModal, showAddProductSelectionModal, showSuccessModal]);

//   useEffect(() => {
//     if (modalRef.current) {
//       const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
//       const firstElement = focusableElements[0];
//       const lastElement = focusableElements[focusableElements.length - 1];

//       const trapFocus = (e) => {
//         if (e.key === 'Tab') {
//           if (e.shiftKey && document.activeElement === firstElement) {
//             e.preventDefault();
//             lastElement.focus();
//           } else if (!e.shiftKey && document.activeElement === lastElement) {
//             e.preventDefault();
//             firstElement.focus();
//           }
//         }
//       };

//       document.addEventListener('keydown', trapFocus);
//       firstElement?.focus();
//       return () => document.removeEventListener('keydown', trapFocus);
//     }
//   }, [showCancelSelectionModal, showCancelConfirmModal, showChangePlanSelectionModal, showAddProductSelectionModal, showSuccessModal]);

//   const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await fetch(url, {
//           ...options,
//           headers: {
//             ...options.headers,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (response.status === 429) {
//           const retryAfter = response.headers.get('Retry-After') || delay * Math.pow(2, i);
//           await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//           continue;
//         }
//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error('Resource not found.');
//           }
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response;
//       } catch (err) {
//         if (i === retries - 1) throw err;
//         await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
//       }
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatAddress = (address) => {
//     if (!address || Object.values(address).every(val => !val)) return 'N/A';
//     const { line1, city, state, country, postalCode } = address;
//     return [line1, city, state, country, postalCode].filter(Boolean).join(', ');
//   };

//   const fetchDashboardData = async (email) => {
//     setIsLoading(true);
//     try {
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
//         method: 'GET',
//       });
//       const data = await response.json();
//       if (data.subscriptions && data.subscriptions.length > 0) {
//         const transformedSubscriptions = data.subscriptions.map(sub => ({
//           ...sub,
//           id: sub.stripeSubscriptionId,
//           applicationNames: sub.applications.map(app => app.name),
//           applicationIds: sub.applications.map(app => app.id),
//           billingCycle: sub.interval,
//           nextBillingDate: sub.endDate,
//         }));
//         setDashboardData({
//           subscriptions: transformedSubscriptions,
//           appHistory: data.appHistory || [],
//           plans: data.plans || [],
//           subscriptionHistory: data.subscriptionHistory || [],
//         });
//         localStorage.setItem('subscriptions', JSON.stringify(transformedSubscriptions));
//       } else {
//         setError('No active subscriptions found for this account.');
//         toast.error('No active subscriptions found.');
//       }
//     } catch (err) {
//       setError(`Failed to load dashboard data: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Extract email from URL query parameter
//     const searchParams = new URLSearchParams(location.search);
//     const emailFromUrl = searchParams.get('email');
    
//     // If email is found in URL, store it in localStorage
//     if (emailFromUrl) {
//       localStorage.setItem('CompanyEmail', emailFromUrl);
//     }

//     // Get email from localStorage
//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please provide an email to view dashboard.');
//       setIsLoading(false);
//       return;
//     }
//     fetchDashboardData(email);
//   }, [navigate, location.search]);

//   const handleCancelSubscription = async () => {
//     if (!subscriptionToCancel || selectedCancelApps.length === 0) {
//       toast.error('Please select at least one application to cancel.');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const email = localStorage.getItem('CompanyEmail');
//       const selectedAppNames = dashboardData.subscriptions
//         .find(sub => sub.id === subscriptionToCancel.id)
//         ?.applications.filter(app => selectedCancelApps.includes(app.id))
//         .map(app => app.name);
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/cancel-plan`, {
//         method: 'POST',
//         body: JSON.stringify({
//           email,
//           selectedAppNames,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success('Subscription cancellation initiated.');
//         setDashboardData(prev => ({
//           ...prev,
//           subscriptions: prev.subscriptions.filter(sub => sub.id !== subscriptionToCancel.id),
//         }));
//         closeAllModals();
//         fetchDashboardData(email);
//       } else {
//         setError(data.error || 'Failed to cancel subscription.');
//         toast.error(data.error || 'Cancellation failed.');
//       }
//     } catch (err) {
//       setError(`Failed to cancel subscription: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChangePlanSelection = (sub) => {
//     setSelectedChangePlanApps(sub.applicationNames || []);
//     setShowChangePlanSelectionModal(true);
//     setSubscriptionToCancel(sub);
//   };

//   const handleAddProductSelection = () => {
//     setSelectedAddProductApps([]);
//     setShowAddProductSelectionModal(true);
//   };

//   const handleChangePlan = () => {
//     if (selectedChangePlanApps.length === 0) {
//       toast.error('Please select at least one application.');
//       return;
//     }
//     navigate('/subscription-dashboard/change-plan', {
//       state: { selectedApps: selectedChangePlanApps, subscriptionId: subscriptionToCancel?.id },
//     });
//   };

//   const handleAddProduct = () => {
//     if (selectedAddProductApps.length === 0) {
//       toast.error('Please select at least one application.');
//       return;
//     }
//     navigate('/subscription-dashboard/add-product', {
//       state: { selectedApps: selectedAddProductApps },
//     });
//   };

//   const handleUpdatePaymentMethod = async () => {
//     try {
//       const email = localStorage.getItem('CompanyEmail');
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/customer-portal`, {
//         method: 'POST',
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (response.ok && data.url) {
//         window.location.href = data.url; // Redirect to Stripe Customer Portal
//       } else {
//         toast.error('Failed to load payment method update page.');
//       }
//     } catch (err) {
//       toast.error(`Error: ${err.message}`);
//     }
//   };

//   const closeAllModals = () => {
//     setShowCancelSelectionModal(false);
//     setShowCancelConfirmModal(false);
//     setShowChangePlanSelectionModal(false);
//     setShowAddProductSelectionModal(false);
//     setShowSuccessModal(false);
//     setSelectedCancelApps([]);
//     setSelectedChangePlanApps([]);
//     setSelectedAddProductApps([]);
//     setSubscriptionToCancel(null);
//   };

//   const getNewProducts = () => {
//     if (!dashboardData) return [];
//     const subscribedApps = new Set(
//       dashboardData.subscriptions.flatMap(sub => sub.applications.map(app => app.name.toLowerCase()))
//     );
//     const allPlanApps = new Set(
//       dashboardData.plans.flatMap(plan => plan.applicationNames.map(name => name.toLowerCase()))
//     );
//     return [...allPlanApps]
//       .filter(app => !subscribedApps.has(app))
//       .map(app => ({ id: app, name: app.charAt(0).toUpperCase() + app.slice(1) }));
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex flex-col items-center justify-center h-64"
//         >
//           <Clock className="h-16 w-16 text-purple-600 animate-spin" />
//           <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
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
//             <AlertCircle className="w-8 h-8 text-red-500" />
//             <p className="text-xl font-semibold text-red-500">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
//             aria-label="Retry loading dashboard"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Retry
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   const { subscriptions, appHistory, plans, subscriptionHistory } = dashboardData;
//   const newProducts = getNewProducts();
//   // const customerName = subscriptions[0]?.customerName || 'User';
//   const customerName = localStorage.getItem('CompanyEmail') || 'User';

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto"
//       >
//         <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
//           Welcome, {customerName}!
//         </h1>

//         {/* Active Subscriptions */}
//         <section className="mb-12">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//             <Package className="w-6 h-6 text-indigo-600" />
//             Active Subscriptions ({subscriptions.length})
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <AnimatePresence>
//               {subscriptions.map((sub, index) => (
//                 <motion.div
//                   key={sub.stripeSubscriptionId}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl font-bold text-gray-800">{sub.planName} Plan</h3>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         sub.status === 'ACTIVE'
//                           ? 'bg-green-100 text-green-800'
//                           : sub.paymentStatus === 'past_due' || sub.paymentStatus === 'unpaid'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       {/* {sub.paymentStatus.toUpperCase()} */}
//                       {sub.paymentStatus}
//                     </span>
//                   </div>
//                   <div className="space-y-3">
//                     <p className="text-gray-600">
//                       {/* <span className="font-semibold">Price:</span> ${sub.price.toFixed(2)}/{sub.billingCycle.toLowerCase()} */}
//                       <span className="font-semibold">Price:</span> ${sub.price}/{sub.billingCycle.toLowerCase()}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Start Date:</span> {formatDate(sub.startDate)}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Next Billing:</span> {formatDate(sub.endDate)}
//                     </p>
//                     {sub.trialEndDate && (
//                       <p className="text-gray-600">
//                         <span className="font-semibold">Trial Ends:</span> {formatDate(sub.trialEndDate)}
//                       </p>
//                     )}
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Trial Status:</span> {sub.trialUsed ? 'Used' : 'Not Used'}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Auto-Renew:</span> {sub.autoRenew ? 'Enabled' : 'Disabled'}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Cancel at Period End:</span> {sub.cancelAtPeriodEnd ? 'Yes' : 'No'}
//                     </p>
//                     <div>
//                       <p className="text-gray-600 font-semibold">Applications:</p>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {sub.applications.map(app => (
//                           <span
//                             key={app.id}
//                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                               sub.applicationStatuses[app.name].active
//                                 ? 'bg-indigo-100 text-indigo-800'
//                                 : 'bg-gray-100 text-gray-600'
//                             } ${sub.applicationStatuses[app.name].changed ? 'ring-2 ring-blue-500' : ''}`}
//                           >
//                             <Package className="w-3 h-3 text-indigo-600 mr-2" />
//                             {app.name}
//                             {sub.applicationStatuses[app.name].changed && (
//                               <span className="ml-1 text-blue-500 font-semibold"> (Changed)</span>
//                             )}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     {sub.canceledApplications.length > 0 && (
//                       <div>
//                         <p className="text-gray-600 font-semibold">Canceled Applications:</p>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {sub.canceledApplications.map(app => (
//                             <span
//                               key={app.id}
//                               className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
//                             >
//                               <Package className="w-3 h-3 text-indigo-600 mr-2" />
//                               {app.name} (Canceled)
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {sub.nextPlanName && (
//                       <div>
//                         <p className="text-gray-600 font-semibold">Next Plan Details:</p>
//                         <div className="mt-2 space-y-2">
//                           <p className="text-gray-600">
//                             <span className="font-semibold">Plan:</span> {sub.nextPlanName} (${sub.nextPlanPrice.toFixed(2)}/{sub.nextInterval})
//                             {/* <span className="font-semibold">Plan:</span> {sub.nextPlanName} (${sub.nextPlanPrice}/{sub.nextInterval}) */}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold">Active Date:</span> {formatDate(sub.nextPlanActiveDate)}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold">Applications:</span>{' '}
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               <Package className="w-3 h-3 text-indigo-600 mr-2" />
//                               {sub.nextPlanApplications.map(app => app.name).join(', ')}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* <div>
//                       <p className="text-gray-600 font-semibold">Payment Method:</p>
//                       // {/* {sub.paymentMethods.length > 0 ? ( 
//                       {sub.paymentMethods.length? (
//                         <div className="mt-2 space-y-2">
//                           {sub.paymentMethods.map(pm => (
//                             <p key={pm.id} className="text-gray-600">
//                               {pm.cardType} ending in {pm.last4}, expires {pm.expMonth}/{pm.expYear}
//                             </p>
//                           ))}
//                           <button
//                             onClick={handleUpdatePaymentMethod}
//                             className="mt-2 inline-flex items-center gap-2 py-1 px-3 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-100 transition-all duration-200"
//                             aria-label="Update payment method"
//                           >
//                             <CreditCard className="w-4 h-4" />
//                             Update Payment Method
//                           </button>
//                         </div>
//                       ) : (
//                         <p className="text-gray-600">No payment method on file.</p>
//                       )}
//                     </div> */}

//                     <div>
//                       <p className="text-gray-600 font-semibold">Payment Method:</p>
//                       {sub.paymentMethods && sub.paymentMethods.length ? (
//                         <div className="mt-2 space-y-2">
//                           {(() => {
//                             const lastPm = sub.paymentMethods[sub.paymentMethods.length - 1];
//                             return (
//                               <p key={lastPm.id} className="text-gray-600">
//                                 {lastPm.cardType} ending in {lastPm.last4}, expires {lastPm.expMonth}/{lastPm.expYear}
//                               </p>
//                             );
//                           })()}
//                           <button
//                             onClick={handleUpdatePaymentMethod}
//                             className="mt-2 inline-flex items-center gap-2 py-1 px-3 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-100 transition-all duration-200"
//                             aria-label="Update payment method"
//                           >
//                             <CreditCard className="w-4 h-4" />
//                             Update Payment Method
//                           </button>
//                         </div>
//                       ) : (
//                         <p className="text-gray-600">No payment method on file.</p>
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-gray-600 font-semibold">Billing Address:</p>
//                       <p className="text-gray-600">{formatAddress(sub.billingAddress)}</p>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2 mt-4">
//                     {sub.canChangePlan && (
//                       <button
//                         onClick={() => handleChangePlanSelection(sub)}
//                         className="flex-1 py-2 rounded-3xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
//                         disabled={isLoading}
//                         aria-label={`Change plan for ${sub.planName}`}
//                       >
//                         Change Plan
//                       </button>
//                     )}
//                     {sub.canCancel && (
//                       <button
//                         onClick={() => {
//                           setSubscriptionToCancel(sub);
//                           setSelectedCancelApps(sub.applicationIds || []);
//                           setShowCancelSelectionModal(true);
//                         }}
//                         className={`flex-1 py-2 rounded-3xl font-semibold text-white ${
//                           isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                         } transition-all duration-200`}
//                         disabled={isLoading}
//                         aria-label={`Cancel subscription for ${sub.planName}`}
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     {sub.canRenew && (
//                       <button
//                         onClick={() => handleRenewSubscription(sub)}
//                         className="flex-1 py-2 rounded-3xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
//                         disabled={isLoading}
//                         aria-label={`Renew subscription for ${sub.planName}`}
//                       >
//                         Renew
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </section>

//         {/* New Products */}
//         {newProducts.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//               New Products Available
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <p className="text-gray-600 mb-4">Explore our new offerings to enhance your subscription:</p>
//               <div className="flex flex-wrap gap-2">
//                 {newProducts.map((product, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
//                   >
//                     {product.name}
//                   </span>
//                 ))}
//               </div>
//               <button
//                 onClick={handleAddProductSelection}
//                 className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-3xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
//                 aria-label="Explore new products"
//               >
//                 <PlusCircle className="w-5 h-5" />
//                 Explore New Products
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Billing History */}
//         {subscriptions.some(sub => sub.invoices?.length > 0) && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               Billing History
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Date</th>
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Amount</th>
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Status</th>
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subscriptions
//                       .flatMap(sub => sub.invoices || [])
//                       .sort((a, b) => new Date(b.date) - new Date(a.date))
//                       .slice(0, 5)
//                       .map((invoice, index) => (
//                         <tr key={index} className="border-b">
//                           <td className="py-2 px-4 text-gray-600">{formatDate(invoice.date)}</td>
//                           <td className="py-2 px-4 text-gray-600">${invoice.amount.toFixed(2)}</td>
//                           <td className="py-2 px-4 text-gray-600">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 invoice.status === 'paid'
//                                   ? 'bg-green-100 text-green-800'
//                                   : 'bg-red-100 text-red-800'
//                               }`}
//                             >
//                               {invoice.status.toUpperCase()}
//                             </span>
//                           </td>
//                           <td className="py-2 px-4">
//                             <a
//                               href={invoice.invoiceUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-purple-600 hover:underline"
//                               aria-label={`Download invoice ${invoice.id}`}
//                             >
//                               Download
//                             </a>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Subscription History */}
//         {subscriptionHistory.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               Subscription History
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <div className="space-y-3">
//                 {subscriptionHistory.map((history, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <FileText className="w-5 h-5 text-blue-600" />
//                     <p className="text-gray-600">
//                       <span className="font-semibold">{history.planName}</span> was {history.status.toLowerCase()} from{' '}
//                       {formatDate(history.startDate)} to {formatDate(history.endDate)}
//                       {history.archivedOn && `, archived on ${formatDate(history.archivedOn)}`}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Cancellation History */}
//         {appHistory.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <XCircle className="w-6 h-6 text-red-600" />
//               Cancellation History
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <div className="space-y-3">
//                 {appHistory.map((history, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <XCircle className="w-5 h-5 text-red-600" />
//                     <p className="text-gray-600">
//                       <span className="font-semibold">{history.appName}</span> was canceled on{' '}
//                       {formatDate(history.actionDate)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Cancel Selection Modal */}
//         {showCancelSelectionModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="cancel-selection-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="cancel-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications to Cancel</h3>
//               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                 {subscriptionToCancel?.applications?.map(app => (
//                   <div key={app.id} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id={`cancel-app-${app.id}`}
//                       value={app.id}
//                       checked={selectedCancelApps.includes(app.id)}
//                       onChange={() => {
//                         setSelectedCancelApps(prev =>
//                           prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id]
//                         );
//                       }}
//                       className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                       aria-checked={selectedCancelApps.includes(app.id)}
//                       aria-label={`Select ${app.name} for cancellation`}
//                     />
//                     <label htmlFor={`cancel-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                   </div>
//                 ))}
//               </div>
//               {selectedCancelApps.length === 0 && (
//                 <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
//               )}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading || selectedCancelApps.length === 0
//                       ? 'bg-red-400 cursor-not-allowed'
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                   onClick={() => {
//                     if (selectedCancelApps.length > 0) {
//                       setShowCancelSelectionModal(false);
//                       setShowCancelConfirmModal(true);
//                     }
//                   }}
//                   disabled={isLoading || selectedCancelApps.length === 0}
//                   aria-label="Confirm application selection"
//                 >
//                   Next
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Cancel Confirmation Modal */}
//         {showCancelConfirmModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="cancel-confirm-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="cancel-confirm-title" className="text-lg font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to cancel the subscription for{' '}
//                 {subscriptionToCancel?.applications
//                   .filter(app => selectedCancelApps.includes(app.id))
//                   .map(app => app.name)
//                   .join(', ')}? This action cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel cancellation"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                   onClick={handleCancelSubscription}
//                   disabled={isLoading}
//                   aria-label="Confirm cancellation"
//                 >
//                   {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Change Plan Selection Modal */}
//         {showChangePlanSelectionModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="change-plan-selection-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="change-plan-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications for Plan Change</h3>
//               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                 {subscriptionToCancel?.applications?.map(app => (
//                   <div key={app.id} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id={`change-app-${app.id}`}
//                       value={app.name}
//                       checked={selectedChangePlanApps.includes(app.name)}
//                       onChange={() => {
//                         setSelectedChangePlanApps(prev =>
//                           prev.includes(app.name) ? prev.filter(name => name !== app.name) : [...prev, app.name]
//                         );
//                       }}
//                       className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                       aria-checked={selectedChangePlanApps.includes(app.name)}
//                       aria-label={`Select ${app.name} for plan change`}
//                     />
//                     <label htmlFor={`change-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                   </div>
//                 ))}
//               </div>
//               {selectedChangePlanApps.length === 0 && (
//                 <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
//               )}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading || selectedChangePlanApps.length === 0
//                       ? 'bg-purple-400 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700'
//                   }`}
//                   onClick={handleChangePlan}
//                   disabled={isLoading || selectedChangePlanApps.length === 0}
//                   aria-label="Proceed to change plan"
//                 >
//                   Next
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Add Product Selection Modal */}
//         {showAddProductSelectionModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-product-selection-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="add-product-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications to Add</h3>
//               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                 {newProducts.map(app => (
//                   <div key={app.id} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id={`add-app-${app.id}`}
//                       value={app.name}
//                       checked={selectedAddProductApps.includes(app.name)}
//                       onChange={() => {
//                         setSelectedAddProductApps(prev =>
//                           prev.includes(app.name) ? prev.filter(name => name !== app.name) : [...prev, app.name]
//                         );
//                       }}
//                       className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                       aria-checked={selectedAddProductApps.includes(app.name)}
//                       aria-label={`Select ${app.name} to add`}
//                     />
//                     <label htmlFor={`add-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                   </div>
//                 ))}
//               </div>
//               {newProducts.length === 0 && (
//                 <p className="text-gray-600 text-sm mt-2">No unsubscribed applications available.</p>
//               )}
//               {selectedAddProductApps.length === 0 && newProducts.length > 0 && (
//                 <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
//               )}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0
//                       ? 'bg-purple-400 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700'
//                   }`}
//                   onClick={handleAddProduct}
//                   disabled={isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0}
//                   aria-label="Proceed to add product"
//                 >
//                   Next
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Success Modal */}
//         {showSuccessModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="success-modal-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="success-modal-title" className="text-lg font-semibold text-gray-800 mb-4">Success</h3>
//               <p className="text-sm text-gray-600 mb-6">{location.state?.successMessage}</p>
//               <div className="flex justify-end">
//                 <button
//                   className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Close success message"
//                 >
//                   OK
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default SubscriptionDashboard;




















// import { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Package, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, CreditCard, FileText } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const SubscriptionDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dashboardData, setDashboardData] = useState({ subscriptions: [], appHistory: [], plans: [], subscriptionHistory: [] });
//   const [error, setError] = useState(location.state?.successMessage || '');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
//   const [selectedCancelApps, setSelectedCancelApps] = useState([]);
//   const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.successMessage);
//   const [showChangePlanSelectionModal, setShowChangePlanSelectionModal] = useState(false);
//   const [selectedChangePlanApps, setSelectedChangePlanApps] = useState([]);
//   const [showAddProductSelectionModal, setShowAddProductSelectionModal] = useState(false);
//   const [selectedAddProductApps, setSelectedAddProductApps] = useState([]);
//   const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);
//   const modalRef = useRef(null);
//   const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape' && (showCancelSelectionModal || showCancelConfirmModal || showChangePlanSelectionModal || showAddProductSelectionModal || showSuccessModal)) {
//         closeAllModals();
//       }
//     };
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [showCancelSelectionModal, showCancelConfirmModal, showChangePlanSelectionModal, showAddProductSelectionModal, showSuccessModal]);

//   useEffect(() => {
//     if (modalRef.current) {
//       const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
//       const firstElement = focusableElements[0];
//       const lastElement = focusableElements[focusableElements.length - 1];

//       const trapFocus = (e) => {
//         if (e.key === 'Tab') {
//           if (e.shiftKey && document.activeElement === firstElement) {
//             e.preventDefault();
//             lastElement.focus();
//           } else if (!e.shiftKey && document.activeElement === lastElement) {
//             e.preventDefault();
//             firstElement.focus();
//           }
//         }
//       };

//       document.addEventListener('keydown', trapFocus);
//       firstElement?.focus();
//       return () => document.removeEventListener('keydown', trapFocus);
//     }
//   }, [showCancelSelectionModal, showCancelConfirmModal, showChangePlanSelectionModal, showAddProductSelectionModal, showSuccessModal]);

//   const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await fetch(url, {
//           ...options,
//           headers: {
//             ...options.headers,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (response.status === 429) {
//           const retryAfter = response.headers.get('Retry-After') || delay * Math.pow(2, i);
//           await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//           continue;
//         }
//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error('Resource not found.');
//           }
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response;
//       } catch (err) {
//         if (i === retries - 1) throw err;
//         await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
//       }
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatAddress = (address) => {
//     if (!address || Object.values(address).every(val => !val)) return 'N/A';
//     const { line1, city, state, country, postalCode } = address;
//     return [line1, city, state, country, postalCode].filter(Boolean).join(', ');
//   };

//   const fetchDashboardData = async (email) => {
//     setIsLoading(true);
//     try {
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
//         method: 'GET',
//       });
//       const data = await response.json();
//       if (data.subscriptions && data.subscriptions.length > 0) {
//         const transformedSubscriptions = data.subscriptions.map(sub => ({
//           ...sub,
//           id: sub.stripeSubscriptionId,
//           applicationNames: sub.applications.map(app => app.name),
//           applicationIds: sub.applications.map(app => app.id),
//           billingCycle: sub.interval,
//           nextBillingDate: sub.endDate,
//           currentPrice: sub.currentPrice, 
//           oldPrice: sub.oldPrice 
//         }));
//         setDashboardData({
//           subscriptions: transformedSubscriptions,
//           appHistory: data.appHistory || [],
//           plans: data.plans || [],
//           subscriptionHistory: data.subscriptionHistory || [],
//         });
//         localStorage.setItem('subscriptions', JSON.stringify(transformedSubscriptions));
//       } else {
//         setError('No active subscriptions found for this account.');
//         toast.error('No active subscriptions found.');
//       }
//     } catch (err) {
//       setError(`Failed to load dashboard data: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const emailFromUrl = searchParams.get('email');
    
//     if (emailFromUrl) {
//       localStorage.setItem('CompanyEmail', emailFromUrl);
//     }

//     const email = localStorage.getItem('CompanyEmail');
//     if (!email) {
//       setError('No email found. Please provide an email to view dashboard.');
//       setIsLoading(false);
//       return;
//     }
//     fetchDashboardData(email);
//   }, [navigate, location.search]);

//   const handleCancelSubscription = async () => {
//     if (!subscriptionToCancel || selectedCancelApps.length === 0) {
//       toast.error('Please select at least one application to cancel.');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const email = localStorage.getItem('CompanyEmail');
//       const selectedAppNames = dashboardData.subscriptions
//         .find(sub => sub.id === subscriptionToCancel.id)
//         ?.applications.filter(app => selectedCancelApps.includes(app.id))
//         .map(app => app.name);
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/cancel-plan`, {
//         method: 'POST',
//         body: JSON.stringify({
//           email,
//           selectedAppNames,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success('Subscription cancellation initiated.');
//         setDashboardData(prev => ({
//           ...prev,
//           subscriptions: prev.subscriptions.filter(sub => sub.id !== subscriptionToCancel.id),
//         }));
//         closeAllModals();
//         fetchDashboardData(email);
//       } else {
//         setError(data.error || 'Failed to cancel subscription.');
//         toast.error(data.error || 'Cancellation failed.');
//       }
//     } catch (err) {
//       setError(`Failed to cancel subscription: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChangePlanSelection = (sub) => {
//     setSelectedChangePlanApps(sub.applicationNames || []);
//     setShowChangePlanSelectionModal(true);
//     setSubscriptionToCancel(sub);
//   };

//   const handleAddProductSelection = () => {
//     setSelectedAddProductApps([]);
//     setShowAddProductSelectionModal(true);
//   };

//   const handleChangePlan = () => {
//     if (selectedChangePlanApps.length === 0) {
//       toast.error('Please select at least one application.');
//       return;
//     }
//     navigate('/subscription-dashboard/change-plan', {
//       state: { selectedApps: selectedChangePlanApps, subscriptionId: subscriptionToCancel?.id },
//     });
//   };

//   const handleAddProduct = () => {
//     if (selectedAddProductApps.length === 0) {
//       toast.error('Please select at least one application.');
//       return;
//     }
//     navigate('/subscription-dashboard/add-product', {
//       state: { selectedApps: selectedAddProductApps },
//     });
//   };

//   const handleUpdatePaymentMethod = async () => {
//     try {
//       const email = localStorage.getItem('CompanyEmail');
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/customer-portal`, {
//         method: 'POST',
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (response.ok && data.url) {
//         window.location.href = data.url; // Redirect to Stripe Customer Portal
//       } else {
//         toast.error('Failed to load payment method update page.');
//       }
//     } catch (err) {
//       toast.error(`Error: ${err.message}`);
//     }
//   };

//   const closeAllModals = () => {
//     setShowCancelSelectionModal(false);
//     setShowCancelConfirmModal(false);
//     setShowChangePlanSelectionModal(false);
//     setShowAddProductSelectionModal(false);
//     setShowSuccessModal(false);
//     setSelectedCancelApps([]);
//     setSelectedChangePlanApps([]);
//     setSelectedAddProductApps([]);
//     setSubscriptionToCancel(null);
//   };

//   const getNewProducts = () => {
//     if (!dashboardData) return [];
//     const subscribedApps = new Set(
//       dashboardData.subscriptions.flatMap(sub => sub.applications.map(app => app.name.toLowerCase()))
//     );
//     const allPlanApps = new Set(
//       dashboardData.plans.flatMap(plan => plan.applicationNames.map(name => name.toLowerCase()))
//     );
//     return [...allPlanApps]
//       .filter(app => !subscribedApps.has(app))
//       .map(app => ({ id: app, name: app.charAt(0).toUpperCase() + app.slice(1) }));
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex flex-col items-center justify-center h-64"
//         >
//           <Clock className="h-16 w-16 text-purple-600 animate-spin" />
//           <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
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
//             <AlertCircle className="w-8 h-8 text-red-500" />
//             <p className="text-xl font-semibold text-red-500">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
//             aria-label="Retry loading dashboard"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Retry
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   const { subscriptions, appHistory, plans, subscriptionHistory } = dashboardData;
//   const newProducts = getNewProducts();
//   // const customerName = subscriptions[0]?.customerName || 'User';
//   const customerName = localStorage.getItem('CompanyEmail') || 'User';

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto"
//       >
//         <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
//           Welcome, {customerName}!
//         </h1>

//         {/* Active Subscriptions */}
//         <section className="mb-12">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//             <Package className="w-6 h-6 text-indigo-600" />
//             Active Subscriptions ({subscriptions.length})
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <AnimatePresence>
//               {subscriptions.map((sub, index) => (
//                 <motion.div
//                   key={sub.stripeSubscriptionId}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl font-bold text-gray-800">{sub.planName} Plan</h3>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         sub.status === 'ACTIVE'
//                           ? 'bg-green-100 text-green-800'
//                           : sub.paymentStatus === 'past_due' || sub.paymentStatus === 'unpaid'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       {sub.paymentStatus.toUpperCase()}
//                       {/* {sub.paymentStatus} */}
//                     </span>
//                   </div>
//                   <div className="space-y-3">
//                     {/* <div>
//                       <p className="text-green-600 mb-1">
//                         <span className="font-semibold">Current Price:</span> ${sub.currentPrice.toFixed(2)}/{sub.billingCycle.toLowerCase()}
//                       </p>
//                       {sub.oldPrice !== null && sub.oldPrice !== sub.currentPrice && (
//                         <p className="text-red-500 text-sm">
//                           <span className="font-semibold">Previous Price:</span> ${sub.oldPrice.toFixed(2)}/{sub.billingCycle.toLowerCase()}
//                         </p>
//                       )}
//                     </div> */}
//                     <div>
//                       <p className={`mb-1 ${sub.oldPrice !== null && sub.oldPrice !== sub.currentPrice ? 'text-green-600' : 'text-gray-600'}`}>
//                         <span className="font-semibold">Current Price:</span> ${sub.currentPrice.toFixed(2)}/{sub.billingCycle.toLowerCase()}
//                       </p>
//                       {sub.oldPrice !== null && sub.oldPrice !== sub.currentPrice && (
//                         <p className="text-red-500 text-sm">
//                           <span className="font-semibold">Previous Price:</span> ${sub.oldPrice.toFixed(2)}/{sub.billingCycle.toLowerCase()}
//                         </p>
//                       )}
//                     </div>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Start Date:</span> {formatDate(sub.startDate)}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Next Billing:</span> {formatDate(sub.endDate)}
//                     </p>
//                     {sub.trialEndDate && (
//                       <p className="text-gray-600">
//                         <span className="font-semibold">Trial Ends:</span> {formatDate(sub.trialEndDate)}
//                       </p>
//                     )}
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Trial Status:</span> {sub.trialUsed ? 'Used' : 'Not Used'}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Auto-Renew:</span> {sub.autoRenew ? 'Enabled' : 'Disabled'}
//                     </p>
//                     <p className="text-gray-600">
//                       <span className="font-semibold">Cancel at Period End:</span> {sub.cancelAtPeriodEnd ? 'Yes' : 'No'}
//                     </p>
//                     <div>
//                       <p className="text-gray-600 font-semibold">Applications:</p>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {sub.applications.map(app => (
//                           <span
//                             key={app.id}
//                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                               sub.applicationStatuses[app.name].active
//                                 ? 'bg-indigo-100 text-indigo-800'
//                                 : 'bg-gray-100 text-gray-600'
//                             } ${sub.applicationStatuses[app.name].changed ? 'ring-2 ring-blue-500' : ''}`}
//                           >
//                             <Package className="w-3 h-3 text-indigo-600 mr-2" />
//                             {app.name}
//                             {sub.applicationStatuses[app.name].changed && (
//                               <span className="ml-1 text-blue-500 font-semibold"> (Changed)</span>
//                             )}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     {sub.canceledApplications.length > 0 && (
//                       <div>
//                         <p className="text-gray-600 font-semibold">Canceled Applications:</p>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {sub.canceledApplications.map(app => (
//                             <span
//                               key={app.id}
//                               className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
//                             >
//                               <Package className="w-3 h-3 text-indigo-600 mr-2" />
//                               {app.name} (Canceled)
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {sub.nextPlanName && (
//                       <div>
//                         <p className="text-gray-600 font-semibold">Next Plan Details:</p>
//                         <div className="mt-2 space-y-2">
//                           <p className="text-gray-600">
//                             <span className="font-semibold">Plan:</span> {sub.nextPlanName} (${sub.nextPlanPrice.toFixed(2)}/{sub.nextInterval})
//                             {/* <span className="font-semibold">Plan:</span> {sub.nextPlanName} (${sub.nextPlanPrice}/{sub.nextInterval}) */}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold">Active Date:</span> {formatDate(sub.nextPlanActiveDate)}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold">Applications:</span>{' '}
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               <Package className="w-3 h-3 text-indigo-600 mr-2" />
//                               {sub.nextPlanApplications.map(app => app.name).join(', ')}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* <div>
//                       <p className="text-gray-600 font-semibold">Payment Method:</p>
//                       // {/* {sub.paymentMethods.length > 0 ? ( 
//                       {sub.paymentMethods.length? (
//                         <div className="mt-2 space-y-2">
//                           {sub.paymentMethods.map(pm => (
//                             <p key={pm.id} className="text-gray-600">
//                               {pm.cardType} ending in {pm.last4}, expires {pm.expMonth}/{pm.expYear}
//                             </p>
//                           ))}
//                           <button
//                             onClick={handleUpdatePaymentMethod}
//                             className="mt-2 inline-flex items-center gap-2 py-1 px-3 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-100 transition-all duration-200"
//                             aria-label="Update payment method"
//                           >
//                             <CreditCard className="w-4 h-4" />
//                             Update Payment Method
//                           </button>
//                         </div>
//                       ) : (
//                         <p className="text-gray-600">No payment method on file.</p>
//                       )}
//                     </div> */}

//                     <div>
//                       <p className="text-gray-600 font-semibold">Payment Method:</p>
//                       {sub.paymentMethods && sub.paymentMethods.length ? (
//                         <div className="mt-2 space-y-2">
//                           {(() => {
//                             const lastPm = sub.paymentMethods[sub.paymentMethods.length - 1];
//                             return (
//                               <p key={lastPm.id} className="text-gray-600">
//                                 {lastPm.cardType} ending in {lastPm.last4}, expires {lastPm.expMonth}/{lastPm.expYear}
//                               </p>
//                             );
//                           })()}
//                           <button
//                             onClick={handleUpdatePaymentMethod}
//                             className="mt-2 inline-flex items-center gap-2 py-1 px-3 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-100 transition-all duration-200"
//                             aria-label="Update payment method"
//                           >
//                             <CreditCard className="w-4 h-4" />
//                             Update Payment Method
//                           </button>
//                         </div>
//                       ) : (
//                         <p className="text-gray-600">No payment method on file.</p>
//                       )}
//                     </div>
//                     <div>
//                       <p className="text-gray-600 font-semibold">Billing Address:</p>
//                       <p className="text-gray-600">{formatAddress(sub.billingAddress)}</p>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2 mt-4">
//                     {sub.canChangePlan && (
//                       <button
//                         onClick={() => handleChangePlanSelection(sub)}
//                         className="flex-1 py-2 rounded-3xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
//                         disabled={isLoading}
//                         aria-label={`Change plan for ${sub.planName}`}
//                       >
//                         Change Plan
//                       </button>
//                     )}
//                     {sub.canCancel && (
//                       <button
//                         onClick={() => {
//                           setSubscriptionToCancel(sub);
//                           setSelectedCancelApps(sub.applicationIds || []);
//                           setShowCancelSelectionModal(true);
//                         }}
//                         className={`flex-1 py-2 rounded-3xl font-semibold text-white ${
//                           isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                         } transition-all duration-200`}
//                         disabled={isLoading}
//                         aria-label={`Cancel subscription for ${sub.planName}`}
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     {sub.canRenew && (
//                       <button
//                         onClick={() => handleRenewSubscription(sub)}
//                         className="flex-1 py-2 rounded-3xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
//                         disabled={isLoading}
//                         aria-label={`Renew subscription for ${sub.planName}`}
//                       >
//                         Renew
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </section>

//         {/* New Products */}
//         {newProducts.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//               New Products Available
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <p className="text-gray-600 mb-4">Explore our new offerings to enhance your subscription:</p>
//               <div className="flex flex-wrap gap-2">
//                 {newProducts.map((product, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
//                   >
//                     {product.name}
//                   </span>
//                 ))}
//               </div>
//               <button
//                 onClick={handleAddProductSelection}
//                 className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-3xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
//                 aria-label="Explore new products"
//               >
//                 <PlusCircle className="w-5 h-5" />
//                 Explore New Products
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Billing History */}
//         {subscriptions.some(sub => sub.invoices?.length > 0) && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               Billing History
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Date</th>
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Amount</th>
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Status</th>
//                       <th className="py-2 px-4 text-gray-600 font-semibold">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subscriptions
//                       .flatMap(sub => sub.invoices || [])
//                       .sort((a, b) => new Date(b.date) - new Date(a.date))
//                       .slice(0, 5)
//                       .map((invoice, index) => (
//                         <tr key={index} className="border-b">
//                           <td className="py-2 px-4 text-gray-600">{formatDate(invoice.date)}</td>
//                           <td className="py-2 px-4 text-gray-600">${invoice.amount.toFixed(2)}</td>
//                           <td className="py-2 px-4 text-gray-600">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 invoice.status === 'paid'
//                                   ? 'bg-green-100 text-green-800'
//                                   : 'bg-red-100 text-red-800'
//                               }`}
//                             >
//                               {invoice.status.toUpperCase()}
//                             </span>
//                           </td>
//                           <td className="py-2 px-4">
//                             <a
//                               href={invoice.invoiceUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-purple-600 hover:underline"
//                               aria-label={`Download invoice ${invoice.id}`}
//                             >
//                               Download
//                             </a>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Subscription History */}
//         {subscriptionHistory.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               Subscription History
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <div className="space-y-3">
//                 {subscriptionHistory.map((history, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <FileText className="w-5 h-5 text-blue-600" />
//                     <p className="text-gray-600">
//                       <span className="font-semibold">{history.planName}</span> was {history.status.toLowerCase()} from{' '}
//                       {formatDate(history.startDate)} to {formatDate(history.endDate)}
//                       {history.archivedOn && `, archived on ${formatDate(history.archivedOn)}`}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Cancellation History */}
//         {appHistory.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
//               <XCircle className="w-6 h-6 text-red-600" />
//               Cancellation History
//             </h2>
//             <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
//               <div className="space-y-3">
//                 {appHistory.map((history, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <XCircle className="w-5 h-5 text-red-600" />
//                     <p className="text-gray-600">
//                       <span className="font-semibold">{history.appName}</span> was canceled on{' '}
//                       {formatDate(history.actionDate)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Cancel Selection Modal */}
//         {showCancelSelectionModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="cancel-selection-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="cancel-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications to Cancel</h3>
//               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                 {subscriptionToCancel?.applications?.map(app => (
//                   <div key={app.id} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id={`cancel-app-${app.id}`}
//                       value={app.id}
//                       checked={selectedCancelApps.includes(app.id)}
//                       onChange={() => {
//                         setSelectedCancelApps(prev =>
//                           prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id]
//                         );
//                       }}
//                       className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                       aria-checked={selectedCancelApps.includes(app.id)}
//                       aria-label={`Select ${app.name} for cancellation`}
//                     />
//                     <label htmlFor={`cancel-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                   </div>
//                 ))}
//               </div>
//               {selectedCancelApps.length === 0 && (
//                 <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
//               )}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading || selectedCancelApps.length === 0
//                       ? 'bg-red-400 cursor-not-allowed'
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                   onClick={() => {
//                     if (selectedCancelApps.length > 0) {
//                       setShowCancelSelectionModal(false);
//                       setShowCancelConfirmModal(true);
//                     }
//                   }}
//                   disabled={isLoading || selectedCancelApps.length === 0}
//                   aria-label="Confirm application selection"
//                 >
//                   Next
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Cancel Confirmation Modal */}
//         {showCancelConfirmModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="cancel-confirm-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="cancel-confirm-title" className="text-lg font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to cancel the subscription for{' '}
//                 {subscriptionToCancel?.applications
//                   .filter(app => selectedCancelApps.includes(app.id))
//                   .map(app => app.name)
//                   .join(', ')}? This action cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel cancellation"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                   onClick={handleCancelSubscription}
//                   disabled={isLoading}
//                   aria-label="Confirm cancellation"
//                 >
//                   {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Change Plan Selection Modal */}
//         {showChangePlanSelectionModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="change-plan-selection-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="change-plan-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications for Plan Change</h3>
//               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                 {subscriptionToCancel?.applications?.map(app => (
//                   <div key={app.id} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id={`change-app-${app.id}`}
//                       value={app.name}
//                       checked={selectedChangePlanApps.includes(app.name)}
//                       onChange={() => {
//                         setSelectedChangePlanApps(prev =>
//                           prev.includes(app.name) ? prev.filter(name => name !== app.name) : [...prev, app.name]
//                         );
//                       }}
//                       className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                       aria-checked={selectedChangePlanApps.includes(app.name)}
//                       aria-label={`Select ${app.name} for plan change`}
//                     />
//                     <label htmlFor={`change-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                   </div>
//                 ))}
//               </div>
//               {selectedChangePlanApps.length === 0 && (
//                 <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
//               )}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading || selectedChangePlanApps.length === 0
//                       ? 'bg-purple-400 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700'
//                   }`}
//                   onClick={handleChangePlan}
//                   disabled={isLoading || selectedChangePlanApps.length === 0}
//                   aria-label="Proceed to change plan"
//                 >
//                   Next
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Add Product Selection Modal */}
//         {showAddProductSelectionModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-product-selection-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="add-product-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications to Add</h3>
//               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                 {newProducts.map(app => (
//                   <div key={app.id} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id={`add-app-${app.id}`}
//                       value={app.name}
//                       checked={selectedAddProductApps.includes(app.name)}
//                       onChange={() => {
//                         setSelectedAddProductApps(prev =>
//                           prev.includes(app.name) ? prev.filter(name => name !== app.name) : [...prev, app.name]
//                         );
//                       }}
//                       className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                       aria-checked={selectedAddProductApps.includes(app.name)}
//                       aria-label={`Select ${app.name} to add`}
//                     />
//                     <label htmlFor={`add-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                   </div>
//                 ))}
//               </div>
//               {newProducts.length === 0 && (
//                 <p className="text-gray-600 text-sm mt-2">No unsubscribed applications available.</p>
//               )}
//               {selectedAddProductApps.length === 0 && newProducts.length > 0 && (
//                 <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
//               )}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-md transition-colors ${
//                     isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0
//                       ? 'bg-purple-400 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700'
//                   }`}
//                   onClick={handleAddProduct}
//                   disabled={isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0}
//                   aria-label="Proceed to add product"
//                 >
//                   Next
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Success Modal */}
//         {showSuccessModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="success-modal-title" ref={modalRef}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-lg p-6 max-w-md w-full"
//             >
//               <h3 id="success-modal-title" className="text-lg font-semibold text-gray-800 mb-4">Success</h3>
//               <p className="text-sm text-gray-600 mb-6">{location.state?.successMessage}</p>
//               <div className="flex justify-end">
//                 <button
//                   className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Close success message"
//                 >
//                   OK
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default SubscriptionDashboard;




















import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Package, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, CreditCard, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubscriptionDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState({ subscriptions: [], appHistory: [], plans: [], subscriptionHistory: [] });
  const [error, setError] = useState(location.state?.successMessage || '');
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
  const [selectedCancelApps, setSelectedCancelApps] = useState([]);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.successMessage);
  const [showChangePlanSelectionModal, setShowChangePlanSelectionModal] = useState(false);
  const [selectedChangePlanApps, setSelectedChangePlanApps] = useState([]);
  const [showAddProductSelectionModal, setShowAddProductSelectionModal] = useState(false);
  const [selectedAddProductApps, setSelectedAddProductApps] = useState([]);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);
  const modalRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://subscription-backend-e8gq.onrender.com';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (showCancelSelectionModal || showCancelConfirmModal || showChangePlanSelectionModal || showAddProductSelectionModal || showSuccessModal)) {
        closeAllModals();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCancelSelectionModal, showCancelConfirmModal, showChangePlanSelectionModal, showAddProductSelectionModal, showSuccessModal]);

  useEffect(() => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const trapFocus = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', trapFocus);
      firstElement?.focus();
      return () => document.removeEventListener('keydown', trapFocus);
    }
  }, [showCancelSelectionModal, showCancelConfirmModal, showChangePlanSelectionModal, showAddProductSelectionModal, showSuccessModal]);

  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || delay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Resource not found.');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAddress = (address) => {
    if (!address || Object.values(address).every(val => !val)) return 'N/A';
    const { line1, city, state, country, postalCode } = address;
    return [line1, city, state, country, postalCode].filter(Boolean).join(', ');
  };

  const fetchDashboardData = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetchWithBackoff(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.subscriptions && data.subscriptions.length > 0) {
        const transformedSubscriptions = data.subscriptions.map(sub => ({
          ...sub,
          id: sub.stripeSubscriptionId,
          applicationNames: sub.applications.map(app => app.name),
          applicationIds: sub.applications.map(app => app.id),
          billingCycle: sub.interval,
          nextBillingDate: sub.endDate,
          currentPrice: sub.currentPrice,
          oldPrice: sub.oldPrice
        }));
        setDashboardData({
          subscriptions: transformedSubscriptions,
          appHistory: data.appHistory || [],
          plans: data.plans || [],
          subscriptionHistory: data.subscriptionHistory || [],
        });
        localStorage.setItem('subscriptions', JSON.stringify(transformedSubscriptions));
      } else {
        setError('No active subscriptions found for this account.');
        toast.error('No active subscriptions found.');
      }
    } catch (err) {
      setError(`Failed to load dashboard data: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get('email');
    
    if (emailFromUrl) {
      localStorage.setItem('CompanyEmail', emailFromUrl);
    }

    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError('No email found. Please provide an email to view dashboard.');
      setIsLoading(false);
      return;
    }
    fetchDashboardData(email);
  }, [navigate, location.search]);

  const handleCancelSubscription = async () => {
    if (!subscriptionToCancel || selectedCancelApps.length === 0) {
      toast.error('Please select at least one application to cancel.');
      return;
    }
    setIsLoading(true);
    try {
      const email = localStorage.getItem('CompanyEmail');
      const selectedAppNames = dashboardData.subscriptions
        .find(sub => sub.id === subscriptionToCancel.id)
        ?.applications.filter(app => selectedCancelApps.includes(app.id))
        .map(app => app.name);
      const response = await fetchWithBackoff(`${API_URL}/api/subscription/cancel-plan`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          selectedAppNames,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Subscription cancellation initiated.');
        setDashboardData(prev => ({
          ...prev,
          subscriptions: prev.subscriptions.filter(sub => sub.id !== subscriptionToCancel.id),
        }));
        closeAllModals();
        fetchDashboardData(email);
      } else {
        setError(data.error || 'Failed to cancel subscription.');
        toast.error(data.error || 'Cancellation failed.');
      }
    } catch (err) {
      setError(`Failed to cancel subscription: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlanSelection = (sub) => {
    setSelectedChangePlanApps(sub.applicationNames || []);
    setShowChangePlanSelectionModal(true);
    setSubscriptionToCancel(sub);
  };

  const handleAddProductSelection = () => {
    setSelectedAddProductApps([]);
    setShowAddProductSelectionModal(true);
  };

  const handleChangePlan = () => {
    if (selectedChangePlanApps.length === 0) {
      toast.error('Please select at least one application.');
      return;
    }
    navigate('/subscription-dashboard/change-plan', {
      state: { selectedApps: selectedChangePlanApps, subscriptionId: subscriptionToCancel?.id },
    });
  };

  const handleAddProduct = () => {
    if (selectedAddProductApps.length === 0) {
      toast.error('Please select at least one application.');
      return;
    }
    navigate('/subscription-dashboard/add-product', {
      state: { selectedApps: selectedAddProductApps },
    });
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      const email = localStorage.getItem('CompanyEmail');
      const response = await fetchWithBackoff(`${API_URL}/api/subscription/customer-portal`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Customer Portal
      } else {
        toast.error('Failed to load payment method update page.');
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleRenewSubscription = (sub) => {
    console.log('Renew subscription for', sub.planName);
    toast.info(`Renewal initiated for ${sub.planName}`);
  };

  const closeAllModals = () => {
    setShowCancelSelectionModal(false);
    setShowCancelConfirmModal(false);
    setShowChangePlanSelectionModal(false);
    setShowAddProductSelectionModal(false);
    setShowSuccessModal(false);
    setSelectedCancelApps([]);
    setSelectedChangePlanApps([]);
    setSelectedAddProductApps([]);
    setSubscriptionToCancel(null);
  };

  const getNewProducts = () => {
    if (!dashboardData) return [];
    const subscribedApps = new Set(
      dashboardData.subscriptions.flatMap(sub => sub.applications.map(app => app.name.toLowerCase()))
    );
    const allPlanApps = new Set(
      dashboardData.plans.flatMap(plan => plan.applicationNames.map(name => name.toLowerCase()))
    );
    return [...allPlanApps]
      .filter(app => !subscribedApps.has(app))
      .map(app => ({ id: app, name: app.charAt(0).toUpperCase() + app.slice(1) }));
  };

  const SubscriptionCardRedesign = ({
    subscriptions,
    isLoading,
    setSubscriptionToCancel,
    setSelectedCancelApps,
    setShowCancelSelectionModal
  }) => {
    const getStatusColor = (status, paymentStatus) => {
      if (paymentStatus === 'past_due' || paymentStatus === 'unpaid') {
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500', label: paymentStatus.replace('_', ' ').toUpperCase() };
      }
      switch (status) {
        case 'ACTIVE':
          return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500', label: 'Active' };
        case 'TRIALING':
          return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500', label: 'Trialing' };
        case 'CANCELED':
          return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500', label: 'Canceled' };
        default:
          return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-300', label: status };
      }
    };

    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" />
          Active Subscriptions ({subscriptions.length})
        </h2>
        
        {subscriptions.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">You don't have any active subscriptions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {subscriptions.map((sub, index) => {
                const statusColors = getStatusColor(sub.status, sub.paymentStatus);
                const isPriceChange = sub.oldPrice !== null && sub.oldPrice !== sub.currentPrice;

                return (
                  <motion.div
                    key={sub.stripeSubscriptionId}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-t-8 ${statusColors.border}`}
                  >
                    <div className="p-6">
                      {/* Header: Plan Name & Status */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-extrabold text-gray-900">{sub.planName} Plan</h3>
                        <div className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors.bg} ${statusColors.text}`}>
                          {statusColors.label}
                        </div>
                      </div>

                      {/* Price Block */}
                      <div className="border-b pb-4 mb-4">
                        <p className={`text-4xl font-black ${isPriceChange ? 'text-green-600' : 'text-gray-600'}`}>
                          ${sub.currentPrice.toFixed(2)}
                          <span className="text-lg font-medium text-gray-500">/{sub.billingCycle.toLowerCase()}</span>
                        </p>
                        {isPriceChange && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <span className="line-through mr-1">${sub.oldPrice.toFixed(2)}</span>
                            <span className="font-semibold">Price change applied next cycle</span>
                          </p>
                        )}
                      </div>

                      {/* Core Details Grid */}
                      <div className="space-y-3 text-gray-700 text-sm">
                        <DetailRow icon={Calendar} label="Next Billing" value={formatDate(sub.endDate)} highlight={true} />
                        <DetailRow icon={Calendar} label="Start Date" value={formatDate(sub.startDate)} />
                        <DetailRow label="Auto-Renew" value={sub.autoRenew ? 'Enabled' : 'Disabled'} valueColor={sub.autoRenew ? 'text-green-600' : 'text-red-600'} />
                        <DetailRow label="Cancel at Period End" value={sub.cancelAtPeriodEnd ? 'Yes' : 'No'} valueColor={sub.cancelAtPeriodEnd ? 'text-red-600' : 'text-green-600'} />
                        {sub.trialEndDate && (
                          <DetailRow icon={Calendar} label="Trial Ends" value={formatDate(sub.trialEndDate)} valueColor="text-blue-600" />
                        )}
                      </div>

                      {/* Applications Section */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="font-semibold text-gray-800 mb-2">Included Applications:</p>
                        <div className="flex flex-wrap gap-2">
                          {sub.applications.map(app => (
                            <AppPill
                              key={app.id}
                              name={app.name}
                              active={sub.applicationStatuses[app.name].active}
                              changed={sub.applicationStatuses[app.name].changed}
                            />
                          ))}
                          {sub.canceledApplications.length > 0 && (
                            sub.canceledApplications.map(app => (
                              <AppPill
                                key={app.id}
                                name={app.name}
                                canceled={true}
                              />
                            ))
                          )}
                        </div>
                      </div>

                      {/* Next Plan Details */}
                      {sub.nextPlanName && (
                        <div className="mt-5 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <p className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Upcoming Plan Change
                          </p>
                          <p className="text-sm text-indigo-800">
                            <span className="font-semibold">{sub.nextPlanName}</span> (${sub.nextPlanPrice.toFixed(2)}/{sub.nextInterval}) starting on <strong>{formatDate(sub.nextPlanActiveDate)}</strong>.
                          </p>
                        </div>
                      )}

                      {/* Payment Info */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="font-semibold text-gray-800 mb-2">Payment & Billing:</p>
                        {sub.paymentMethods && sub.paymentMethods.length ? (
                          <div className="space-y-2">
                            {(() => {
                              const lastPm = sub.paymentMethods[sub.paymentMethods.length - 1];
                              return (
                                <p key={lastPm.id} className="text-sm text-gray-600 flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-gray-500" />
                                  {lastPm.cardType} ending in <strong>{lastPm.last4}</strong>, expires {lastPm.expMonth}/{lastPm.expYear}
                                </p>
                              );
                            })()}
                            <p className="text-sm text-gray-600">
                              <strong>Billing Address:</strong> {formatAddress(sub.billingAddress)}
                            </p>
                            <button
                              onClick={handleUpdatePaymentMethod}
                              className="inline-flex items-center gap-1.5 py-1 px-3 mt-1 rounded-md text-xs font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 transition-all duration-200"
                              aria-label="Update payment method"
                            >
                              <CreditCard className="w-4 h-4" />
                              Update Payment
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">No payment method on file.</p>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-6 pt-0 flex space-x-3">
                      {sub.canChangePlan && (
                        <button
                          onClick={() => handleChangePlanSelection(sub)}
                          className="flex-1 py-2 rounded-3xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md disabled:bg-indigo-400"
                          disabled={isLoading}
                          aria-label={`Change plan for ${sub.planName}`}
                        >
                          Change Plan
                        </button>
                      )}
                      {sub.canCancel && (
                        <button
                          onClick={() => {
                            setSubscriptionToCancel(sub);
                            setSelectedCancelApps(sub.applicationIds || []);
                            setShowCancelSelectionModal(true);
                          }}
                          className={`flex-1 py-2 rounded-3xl font-bold text-sm text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-all duration-200 shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isLoading}
                          aria-label={`Cancel subscription for ${sub.planName}`}
                        >
                          Cancel
                        </button>
                      )}
                      {sub.canRenew && (
                        <button
                          onClick={() => handleRenewSubscription(sub)}
                          className="flex-1 py-2 rounded-3xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md disabled:bg-green-400"
                          disabled={isLoading}
                          aria-label={`Renew subscription for ${sub.planName}`}
                        >
                          Renew
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>
    );
  };

  const DetailRow = ({ icon: Icon, label, value, highlight = false, valueColor = 'text-gray-700' }) => (
    <p className={`flex justify-between items-center text-sm ${highlight ? 'font-semibold' : ''}`}>
      <span className="flex items-center gap-2 text-gray-500">
        {Icon && <Icon className="w-4 h-4" />}
        {label}:
      </span>
      <span className={`${valueColor} ${highlight ? 'text-base font-bold text-indigo-600' : ''}`}>
        {value}
      </span>
    </p>
  );

  const AppPill = ({ name, active = true, changed = false, canceled = false }) => {
    let classes = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200';
    let IconComponent = Package; 
    let iconClass = 'w-3 h-3 mr-1.5';
    let label = name;

    if (canceled) {
      classes += ' bg-red-100 text-red-800';
      IconComponent = XCircle;
      iconClass += ' text-red-600';
      label += ' (Canceled)';
    } else if (active) {
      classes += ' bg-indigo-100 text-indigo-800';
      iconClass += ' text-indigo-600';
    } else {
      classes += ' bg-gray-100 text-gray-600';
      iconClass += ' text-gray-500';
    }

    if (changed) {
      classes += ' ring-2 ring-offset-2 ring-blue-500';
      label += ' (Changed)';
    }

    return (
      <span className={classes}>
        <IconComponent className={iconClass} />
        {label}
      </span>
    );
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <Clock className="h-16 w-16 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
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
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-xl font-semibold text-red-500">Error</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
            aria-label="Retry loading dashboard"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const { subscriptions, appHistory, plans, subscriptionHistory } = dashboardData;
  const newProducts = getNewProducts();
  const customerName = localStorage.getItem('CompanyEmail') || 'User';

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Welcome, {customerName}!
        </h1>

        {/* Active Subscriptions */}
        <SubscriptionCardRedesign
          subscriptions={subscriptions}
          isLoading={isLoading}
          setSubscriptionToCancel={setSubscriptionToCancel}
          setSelectedCancelApps={setSelectedCancelApps}
          setShowCancelSelectionModal={setShowCancelSelectionModal}
        />

        {/* New Products */}
        {newProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              New Products Available
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <p className="text-gray-600 mb-4">Explore our new offerings to enhance your subscription:</p>
              <div className="flex flex-wrap gap-2">
                {newProducts.map((product, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {product.name}
                  </span>
                ))}
              </div>
              <button
                onClick={handleAddProductSelection}
                className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-3xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                aria-label="Explore new products"
              >
                <PlusCircle className="w-5 h-5" />
                Explore New Products
              </button>
            </div>
          </section>
        )}

        {/* Billing History */}
        {subscriptions.some(sub => sub.invoices?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Billing History
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-gray-600 font-semibold">Date</th>
                      <th className="py-2 px-4 text-gray-600 font-semibold">Amount</th>
                      <th className="py-2 px-4 text-gray-600 font-semibold">Status</th>
                      <th className="py-2 px-4 text-gray-600 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions
                      .flatMap(sub => sub.invoices || [])
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 5)
                      .map((invoice, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4 text-gray-600">{formatDate(invoice.date)}</td>
                          <td className="py-2 px-4 text-gray-600">${invoice.amount.toFixed(2)}</td>
                          <td className="py-2 px-4 text-gray-600">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                invoice.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            <a
                              href={invoice.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline"
                              aria-label={`Download invoice ${invoice.id}`}
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Subscription History */}
        {subscriptionHistory.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Subscription History
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="space-y-3">
                {subscriptionHistory.map((history, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <p className="text-gray-600">
                      <span className="font-semibold">{history.planName}</span> was {history.status.toLowerCase()} from{' '}
                      {formatDate(history.startDate)} to {formatDate(history.endDate)}
                      {history.archivedOn && `, archived on ${formatDate(history.archivedOn)}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cancellation History */}
        {appHistory.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Cancellation History
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="space-y-3">
                {appHistory.map((history, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-gray-600">
                      <span className="font-semibold">{history.appName}</span> was canceled on{' '}
                      {formatDate(history.actionDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cancel Selection Modal */}
        {showCancelSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="cancel-selection-title" ref={modalRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 id="cancel-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications to Cancel</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                {subscriptionToCancel?.applications?.map(app => (
                  <div key={app.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`cancel-app-${app.id}`}
                      value={app.id}
                      checked={selectedCancelApps.includes(app.id)}
                      onChange={() => {
                        setSelectedCancelApps(prev =>
                          prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id]
                        );
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      aria-checked={selectedCancelApps.includes(app.id)}
                      aria-label={`Select ${app.name} for cancellation`}
                    />
                    <label htmlFor={`cancel-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {selectedCancelApps.length === 0 && (
                <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Cancel selection"
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    isLoading || selectedCancelApps.length === 0
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={() => {
                    if (selectedCancelApps.length > 0) {
                      setShowCancelSelectionModal(false);
                      setShowCancelConfirmModal(true);
                    }
                  }}
                  disabled={isLoading || selectedCancelApps.length === 0}
                  aria-label="Confirm application selection"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="cancel-confirm-title" ref={modalRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 id="cancel-confirm-title" className="text-lg font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to cancel the subscription for{' '}
                {subscriptionToCancel?.applications
                  .filter(app => selectedCancelApps.includes(app.id))
                  .map(app => app.name)
                  .join(', ')}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Cancel cancellation"
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  aria-label="Confirm cancellation"
                >
                  {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Change Plan Selection Modal */}
        {showChangePlanSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="change-plan-selection-title" ref={modalRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 id="change-plan-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications for Plan Change</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                {subscriptionToCancel?.applications?.map(app => (
                  <div key={app.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`change-app-${app.id}`}
                      value={app.name}
                      checked={selectedChangePlanApps.includes(app.name)}
                      onChange={() => {
                        setSelectedChangePlanApps(prev =>
                          prev.includes(app.name) ? prev.filter(name => name !== app.name) : [...prev, app.name]
                        );
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      aria-checked={selectedChangePlanApps.includes(app.name)}
                      aria-label={`Select ${app.name} for plan change`}
                    />
                    <label htmlFor={`change-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {selectedChangePlanApps.length === 0 && (
                <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  aria-label="Cancel selection"
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    isLoading || selectedChangePlanApps.length === 0
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  onClick={handleChangePlan}
                  disabled={isLoading || selectedChangePlanApps.length === 0}
                  aria-label="Proceed to change plan"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Product Selection Modal */}
        {showAddProductSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-product-selection-title" ref={modalRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 id="add-product-selection-title" className="text-lg font-semibold text-gray-800 mb-4">Select Applications to Add</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                {newProducts.map(app => (
                  <div key={app.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`add-app-${app.id}`}
                      value={app.name}
                      checked={selectedAddProductApps.includes(app.name)}
                      onChange={() => {
                        setSelectedAddProductApps(prev =>
                          prev.includes(app.name) ? prev.filter(name => name !== app.name) : [...prev, app.name]
                        );
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      aria-checked={selectedAddProductApps.includes(app.name)}
                      aria-label={`Select ${app.name} to add`}
                    />
                    <label htmlFor={`add-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {newProducts.length === 0 && (
                <p className="text-gray-600 text-sm mt-2">No unsubscribed applications available.</p>
              )}
              {selectedAddProductApps.length === 0 && newProducts.length > 0 && (
                <p className="text-red-500 text-sm mt-2" role="alert">At least one application must be selected.</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Cancel selection"
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  onClick={handleAddProduct}
                  disabled={isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0}
                  aria-label="Proceed to add product"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="success-modal-title" ref={modalRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 id="success-modal-title" className="text-lg font-semibold text-gray-800 mb-4">Success</h3>
              <p className="text-sm text-gray-600 mb-6">{location.state?.successMessage}</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Close success message"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SubscriptionDashboard;