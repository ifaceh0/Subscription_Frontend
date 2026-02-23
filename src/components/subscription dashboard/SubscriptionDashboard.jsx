// import { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Calendar, Package, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, CreditCard, FileText, ArrowRight } from 'lucide-react';
// import {  
//     FiLoader
// } from "react-icons/fi";
// import { Star } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useLocation as useCountryLocation } from '../../contexts/LocationContext';

// const SubscriptionDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dashboardData, setDashboardData] = useState({ subscriptions: [], appHistory: [], plans: [], subscriptionHistory: [] });
//   const [error, setError] = useState(location.state?.successMessage || '');
//   const [isLoading, setIsLoading] = useState(true);
//   const [cancelling, setCancelling] = useState(false);
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
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const { countryCode } = useCountryLocation();

//   const formatPriceDynamic = (rawFormatted, currencySymbol, currencyPosition) => {
//     if (!rawFormatted) return '0.00';
    
//     if (rawFormatted.includes('₹') || rawFormatted.includes('$') || rawFormatted.includes('€')) {
//       return rawFormatted;
//     }

//     const amount = parseFloat(rawFormatted) || 0;
//     const formattedAmount = amount.toFixed(2);
    
//     return currencyPosition === 'prefix'
//       ? `${currencySymbol}${formattedAmount}`
//       : `${formattedAmount}${currencySymbol}`;
//   };

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
//             'X-User-Location': countryCode,
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
//           // currentPriceFormatted: sub.currentPriceFormatted || `$${sub.currentPrice?.toFixed(2) || '0.00'}`,
//           currentPriceFormatted: sub.currentPriceFormatted || '0.00',
//           oldPrice: sub.oldPrice || null,
//           // oldPriceFormatted: sub.oldPriceFormatted || `$${sub.oldPrice?.toFixed(2) || '0.00'}`,
//           oldPriceFormatted: sub.oldPriceFormatted || null,
//           nextPlanPriceFormatted: sub.nextPlanPriceFormatted || null,
//           currencySymbol: data.currencySymbol || '$',
//           currencyPosition: data.currencyPosition || 'prefix',
//         }));
//         setDashboardData({
//           subscriptions: transformedSubscriptions,
//           appHistory: data.appHistory || [],
//           plans: data.plans || [],
//           subscriptionHistory: data.subscriptionHistory || [],
//           currencySymbol: data.currencySymbol || '$',
//         currencyPosition: data.currencyPosition || 'prefix',
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
//     setCancelling(true);
//     try {
//       const email = localStorage.getItem('CompanyEmail');
//       const selectedAppNames = dashboardData.subscriptions
//         .find(sub => sub.id === subscriptionToCancel.id)
//         ?.applications.filter(app => selectedCancelApps.includes(app.id))
//         .map(app => app.name);
//       const response = await fetchWithBackoff(`${API_URL}/api/subscription/cancel-plan`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-User-Location': countryCode
//         },
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
//       setCancelling(false);
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

//   const handleRenewSubscription = (sub) => {
//     console.log('Renew subscription for', sub.planName);
//     toast.info(`Renewal initiated for ${sub.planName}`);
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

//   const SubscriptionCardRedesign = ({
//     subscriptions,
//     isLoading,
//     setSubscriptionToCancel,
//     setSelectedCancelApps,
//     setShowCancelSelectionModal
//   }) => {
//     const getStatusColor = (status, paymentStatus) => {
//       if (paymentStatus === 'past_due' || paymentStatus === 'unpaid') {
//         return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500', label: paymentStatus.replace('_', ' ').toUpperCase() };
//       }
//       switch (status) {
//         case 'ACTIVE':
//           return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500', label: 'Active' };
//         case 'TRIALING':
//           return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500', label: 'Trialing' };
//         case 'CANCELED':
//           return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500', label: 'Canceled' };
//         default:
//           return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-300', label: status };
//       }
//     };

//     return (
//       <section className="mb-12">
//         <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
//           <Package className="w-8 h-8 text-indigo-600" />
//           Active Subscriptions ({subscriptions.length})
//         </h2>
        
//         {subscriptions.length === 0 ? (
//           <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
//             <p className="text-gray-500">You don't have any active subscriptions.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
//             <AnimatePresence>
//               {subscriptions.map((sub, index) => {
//                 const statusColors = getStatusColor(sub.status, sub.paymentStatus);
//                 const isPriceChange = sub.oldPrice !== null && sub.oldPrice !== sub.currentPrice;

//                 return (
//                   <motion.div
//                     key={sub.stripeSubscriptionId}
//                     initial={{ opacity: 0, y: 30, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -30, scale: 0.95 }}
//                     transition={{ duration: 0.4, delay: index * 0.08 }}
//                     className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-t-8 ${statusColors.border}`}
//                   >
//                     <div className="p-6">
//                       {/* Header: Plan Name & Status */}
//                       <div className="flex justify-between items-start mb-4">
//                         <h3 className="text-2xl font-extrabold text-gray-900">{sub.planName} Plan</h3>
//                         <div className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors.bg} ${statusColors.text}`}>
//                           {statusColors.label}
//                         </div>
//                       </div>

//                       {/* Price Block */}
//                       <div className="border-b pb-4 mb-4">
//                         {/* <p className={`text-4xl font-black ${isPriceChange ? 'text-green-600' : 'text-gray-600'}`}>
//                           ${sub.currentPrice.toFixed(2)}
//                           <span className="text-lg font-medium text-gray-500">/{sub.billingCycle.toLowerCase()}</span>
//                         </p>
//                         {isPriceChange && (
//                           <p className="text-sm text-red-500 mt-1 flex items-center">
//                             <span className="line-through mr-1">${sub.oldPrice.toFixed(2)}</span>
//                             <span className="font-semibold">Price change applied next cycle</span>
//                           </p>
//                         )} */}
//                         <p className={`text-4xl font-black ${isPriceChange ? 'text-green-600' : 'text-gray-600'}`}>
//                           {formatPriceDynamic(sub.currentPriceFormatted, sub.currencySymbol, sub.currencyPosition)}
//                           <span className="text-lg font-medium text-gray-500">/{sub.billingCycle.toLowerCase()}</span>
//                         </p>
//                         {isPriceChange && sub.oldPriceFormatted && (
//                           <p className="text-sm text-red-500 mt-1 flex items-center">
//                             <span className="line-through mr-1">
//                               {formatPriceDynamic(sub.oldPriceFormatted, sub.currencySymbol, sub.currencyPosition)}
//                             </span>
//                             <span className="font-semibold">Price change applied next cycle</span>
//                           </p>
//                         )}
//                       </div>

//                       {/* Core Details Grid */}
//                       <div className="space-y-3 text-gray-700 text-sm">
//                         <DetailRow icon={Calendar} label="Next Billing" value={formatDate(sub.endDate)} highlight={true} />
//                         <DetailRow icon={Calendar} label="Start Date" value={formatDate(sub.startDate)} />
//                         <DetailRow label="Auto-Renew" value={sub.autoRenew ? 'Enabled' : 'Disabled'} valueColor={sub.autoRenew ? 'text-green-600' : 'text-red-600'} />
//                         <DetailRow label="Cancel at Period End" value={sub.cancelAtPeriodEnd ? 'Yes' : 'No'} valueColor={sub.cancelAtPeriodEnd ? 'text-red-600' : 'text-green-600'} />
//                         {sub.trialEndDate && (
//                           <DetailRow icon={Calendar} label="Trial Ends" value={formatDate(sub.trialEndDate)} valueColor="text-blue-600" />
//                         )}
//                       </div>

//                       {/* Applications Section */}
//                       <div className="mt-5 pt-4 border-t border-gray-100">
//                         <p className="font-semibold text-gray-800 mb-2">Included Applications:</p>
//                         <div className="flex flex-wrap gap-2">
//                           {sub.applications.map(app => (
//                             <AppPill
//                               key={app.id}
//                               name={app.name}
//                               active={sub.applicationStatuses[app.name].active}
//                               changed={sub.applicationStatuses[app.name].changed}
//                             />
//                           ))}
//                           {sub.canceledApplications.length > 0 && (
//                             sub.canceledApplications.map(app => (
//                               <AppPill
//                                 key={app.id}
//                                 name={app.name}
//                                 canceled={true}
//                               />
//                             ))
//                           )}
//                         </div>
//                       </div>

//                       {/* Next Plan Details */}
//                       {sub.nextPlanName && (
//                         <div className="mt-5 p-4 bg-indigo-50 rounded border border-indigo-200">
//                           <p className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
//                             <ArrowRight className="w-4 h-4" />
//                             Upcoming Plan Change
//                           </p>
//                           <p className="text-sm text-indigo-800">
//                             <span className="font-semibold">{sub.nextPlanName}</span>
//                             {/* (${sub.nextPlanPrice.toFixed(2)}/{sub.nextInterval}) starting on <strong>{formatDate(sub.nextPlanActiveDate)}</strong>. */}
//                             ({formatPriceDynamic(sub.nextPlanPriceFormatted, sub.currencySymbol, sub.currencyPosition)}/{sub.nextInterval}) 
//                               starting on <strong>{formatDate(sub.nextPlanActiveDate)}</strong>.
//                           </p>
//                         </div>
//                       )}

//                       {/* Payment Info */}
//                       <div className="mt-5 pt-4 border-t border-gray-100">
//                         <p className="font-semibold text-gray-800 mb-2">Payment & Billing:</p>
//                         {sub.paymentMethods && sub.paymentMethods.length ? (
//                           <div className="space-y-2">
//                             {(() => {
//                               const lastPm = sub.paymentMethods[sub.paymentMethods.length - 1];
//                               return (
//                                 <p key={lastPm.id} className="text-sm text-gray-600 flex items-center gap-2">
//                                   <CreditCard className="w-4 h-4 text-gray-500" />
//                                   {lastPm.cardType} ending in <strong>{lastPm.last4}</strong>, expires {lastPm.expMonth}/{lastPm.expYear}
//                                 </p>
//                               );
//                             })()}
//                             {/* <p className="text-sm text-gray-600">
//                               <strong>Billing Address:</strong> {formatAddress(sub.billingAddress)}
//                             </p>
//                             <button
//                               onClick={handleUpdatePaymentMethod}
//                               className="inline-flex items-center gap-1.5 py-1 px-3 mt-1 rounded-md text-xs font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 transition-all duration-200"
//                               aria-label="Update payment method"
//                             >
//                               <CreditCard className="w-4 h-4" />
//                               Update Payment
//                             </button> */}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-600">No payment method on file.</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions Bar */}
//                     <div className="p-6 pt-0 flex space-x-3">
//                       {sub.canChangePlan && (
//                         <button
//                           onClick={() => handleChangePlanSelection(sub)}
//                           className="flex-1 py-2 rounded-full font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md disabled:bg-indigo-400"
//                           disabled={isLoading}
//                           aria-label={`Change plan for ${sub.planName}`}
//                         >
//                           Change Plan
//                         </button>
//                       )}
//                       {sub.canCancel && (
//                         <button
//                           onClick={() => {
//                             setSubscriptionToCancel(sub);
//                             setSelectedCancelApps(sub.applicationIds || []);
//                             setShowCancelSelectionModal(true);
//                           }}
//                           className={`flex-1 py-2 rounded-full font-bold text-sm text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-all duration-200 shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                           disabled={isLoading}
//                           aria-label={`Cancel subscription for ${sub.planName}`}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       {sub.canRenew && (
//                         <button
//                           onClick={() => handleRenewSubscription(sub)}
//                           className="flex-1 py-2 rounded-full font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md disabled:bg-green-400"
//                           disabled={isLoading}
//                           aria-label={`Renew subscription for ${sub.planName}`}
//                         >
//                           Renew
//                         </button>
//                       )}
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         )}
//       </section>
//     );
//   };

//   const DetailRow = ({ icon: Icon, label, value, highlight = false, valueColor = 'text-gray-700' }) => (
//     <p className={`flex justify-between items-center text-sm ${highlight ? 'font-semibold' : ''}`}>
//       <span className="flex items-center gap-2 text-gray-500">
//         {Icon && <Icon className="w-4 h-4" />}
//         {label}:
//       </span>
//       <span className={`${valueColor} ${highlight ? 'text-base font-bold text-indigo-600' : ''}`}>
//         {value}
//       </span>
//     </p>
//   );

//   const AppPill = ({ name, active = true, changed = false, canceled = false }) => {
//     let classes = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200';
//     let IconComponent = Package; 
//     let iconClass = 'w-3 h-3 mr-1.5';
//     let label = name;

//     if (canceled) {
//       classes += ' bg-red-100 text-red-800';
//       IconComponent = XCircle;
//       iconClass += ' text-red-600';
//       label += ' (Canceled)';
//     } else if (active) {
//       classes += ' bg-indigo-100 text-indigo-800';
//       iconClass += ' text-indigo-600';
//     } else {
//       classes += ' bg-gray-100 text-gray-600';
//       iconClass += ' text-gray-500';
//     }

//     if (changed) {
//       classes += ' ring-2 ring-offset-2 ring-blue-500';
//       label += ' (Changed)';
//     }

//     return (
//       <span className={classes}>
//         <IconComponent className={iconClass} />
//         {label}
//       </span>
//     );
//   };

//   if (isLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6" role="alert" aria-live="polite">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex flex-col items-center justify-center h-64"
//           >
//             <div className="flex space-x-2">
              
//               <motion.div
//                 animate={{ 
//                   scale: [1, 1.3, 1], 
//                   opacity: [0.8, 1, 0.8],
//                 }}
//                 transition={{ 
//                   duration: 1.2, 
//                   repeat: Infinity, 
//                   ease: "easeInOut",
//                   delay: 0 // Start first
//                 }}
//                 className="w-4 h-4 rounded-full bg-red-800 shadow-md"
//               />
              
//               <motion.div
//                 animate={{ 
//                   scale: [1, 1.3, 1],
//                   opacity: [0.8, 1, 0.8],
//                 }}
//                 transition={{ 
//                   duration: 1.2, 
//                   repeat: Infinity, 
//                   ease: "easeInOut",
//                   delay: 0.2 // Delayed start
//                 }}
//                 className="w-4 h-4 rounded-full bg-yellow-600 shadow-md"
//               />
              
//               <motion.div
//                 animate={{ 
//                   scale: [1, 1.3, 1],
//                   opacity: [0.8, 1, 0.8],
//                 }}
//                 transition={{ 
//                   duration: 1.2, 
//                   repeat: Infinity, 
//                   ease: "easeInOut",
//                   delay: 0.4 // Delayed start
//                 }}
//                 className="w-4 h-4 rounded-full bg-gray-900 shadow-md"
//               />
//             </div>
  
//             <p className="text-gray-600 mt-6 text-lg">Loading Your Subscription dashboard...</p>
//           </motion.div>
//         </div>
//       );
//     }

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
//             <AlertCircle className="w-8 h-8 text-red-500" />
//             <p className="text-xl font-semibold text-red-500">Error</p>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all duration-200 font-medium"
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
//   const customerName = localStorage.getItem('CompanyEmail') || 'User';

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

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto p-4"
//       >
//         <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
//           Welcome, {customerName}!
//         </h1>

//         {/* Active Subscriptions */}
//         <SubscriptionCardRedesign
//           subscriptions={subscriptions}
//           isLoading={isLoading}
//           setSubscriptionToCancel={setSubscriptionToCancel}
//           setSelectedCancelApps={setSelectedCancelApps}
//           setShowCancelSelectionModal={setShowCancelSelectionModal}
//         />

//         {/* New Products */}
//         {newProducts.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//               New Products Available
//             </h2>
//             <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
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
//                 className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
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
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               Billing History
//             </h2>
//             <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
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
//                           {/* <td className="py-2 px-4 text-gray-600">${invoice.amount.toFixed(2)}</td> */}
//                           <td className="py-2 px-4 text-gray-600">{formatPriceDynamic(invoice.amount.toFixed(2), dashboardData.currencySymbol, dashboardData.currencyPosition)}</td>
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
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-blue-600" />
//               Subscription History
//             </h2>
//             <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
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
//             <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
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
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-full transition-colors ${
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
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   disabled={cancelling} // Disable Cancel button during loading
//                   aria-label="Cancel cancellation"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-full transition-colors min-w-[140px] ${
//                     cancelling 
//                       ? 'bg-red-400 cursor-not-allowed' 
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                   onClick={handleCancelSubscription}
//                   disabled={cancelling} // Disable Confirm button during loading
//                   aria-label="Confirm cancellation"
//                 >
//                   {cancelling ? (
//                     <span className="flex items-center justify-center gap-2">
//                       Cancelling...
//                       <FiLoader className="h-4 w-4 animate-spin" />
//                     </span>
//                   ) : (
//                     'Confirm Cancellation'
//                   )}
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
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-full transition-colors ${
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
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
//                   onClick={closeAllModals}
//                   aria-label="Cancel selection"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 text-white rounded-full transition-colors ${
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
//                   className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
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











// updated code for language support using i18next
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Package, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, CreditCard, FileText, ArrowRight } from 'lucide-react';
import { FiLoader } from "react-icons/fi";
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation as useCountryLocation } from '../../contexts/LocationContext';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';

const SubscriptionDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState({ subscriptions: [], appHistory: [], plans: [], subscriptionHistory: [] });
  const [error, setError] = useState(location.state?.successMessage || '');
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
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
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const { countryCode } = useCountryLocation();

  const formatPriceDynamic = (rawFormatted, currencySymbol, currencyPosition) => {
    if (!rawFormatted) return '0.00';
    
    if (rawFormatted.includes('₹') || rawFormatted.includes('$') || rawFormatted.includes('€')) {
      return rawFormatted;
    }

    const amount = parseFloat(rawFormatted) || 0;
    const formattedAmount = amount.toFixed(2);
    
    return currencyPosition === 'prefix'
      ? `${currencySymbol}${formattedAmount}`
      : `${formattedAmount}${currencySymbol}`;
  };

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
            'X-User-Location': countryCode,
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
          currentPriceFormatted: sub.currentPriceFormatted || '0.00',
          oldPrice: sub.oldPrice || null,
          oldPriceFormatted: sub.oldPriceFormatted || null,
          nextPlanPriceFormatted: sub.nextPlanPriceFormatted || null,
          currencySymbol: data.currencySymbol || '$',
          currencyPosition: data.currencyPosition || 'prefix',
        }));
        setDashboardData({
          subscriptions: transformedSubscriptions,
          appHistory: data.appHistory || [],
          plans: data.plans || [],
          subscriptionHistory: data.subscriptionHistory || [],
          currencySymbol: data.currencySymbol || '$',
          currencyPosition: data.currencyPosition || 'prefix',
        });
        localStorage.setItem('subscriptions', JSON.stringify(transformedSubscriptions));
      } else {
        setError(t('dashboard.noActiveSubscriptions'));
        toast.error(t('dashboard.noActiveSubscriptions'));
      }
    } catch (err) {
      setError(`${t('dashboard.failedToLoad')}: ${err.message}`);
      toast.error(`${t('dashboard.error')}: ${err.message}`);
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
      setError(t('dashboard.noEmailFound'));
      setIsLoading(false);
      return;
    }
    fetchDashboardData(email);
  }, [navigate, location.search]);

  const handleCancelSubscription = async () => {
    if (!subscriptionToCancel || selectedCancelApps.length === 0) {
      toast.error(t('dashboard.selectAtLeastOneAppToCancel'));
      return;
    }
    setCancelling(true);
    try {
      const email = localStorage.getItem('CompanyEmail');
      const selectedAppNames = dashboardData.subscriptions
        .find(sub => sub.id === subscriptionToCancel.id)
        ?.applications.filter(app => selectedCancelApps.includes(app.id))
        .map(app => app.name);
      const response = await fetchWithBackoff(`${API_URL}/api/subscription/cancel-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Location': countryCode
        },
        body: JSON.stringify({
          email,
          selectedAppNames,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(t('dashboard.cancellationInitiated'));
        setDashboardData(prev => ({
          ...prev,
          subscriptions: prev.subscriptions.filter(sub => sub.id !== subscriptionToCancel.id),
        }));
        closeAllModals();
        fetchDashboardData(email);
      } else {
        setError(data.error || t('dashboard.failedToCancel'));
        toast.error(data.error || t('dashboard.cancellationFailed'));
      }
    } catch (err) {
      setError(`${t('dashboard.failedToCancel')}: ${err.message}`);
      toast.error(`${t('dashboard.error')}: ${err.message}`);
    } finally {
      setCancelling(false);
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
      toast.error(t('dashboard.selectAtLeastOneApp'));
      return;
    }
    navigate('/subscription-dashboard/change-plan', {
      state: { selectedApps: selectedChangePlanApps, subscriptionId: subscriptionToCancel?.id },
    });
  };

  const handleAddProduct = () => {
    if (selectedAddProductApps.length === 0) {
      toast.error(t('dashboard.selectAtLeastOneApp'));
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
        window.location.href = data.url;
      } else {
        toast.error(t('dashboard.failedToLoadPaymentPage'));
      }
    } catch (err) {
      toast.error(`${t('dashboard.error')}: ${err.message}`);
    }
  };

  const handleRenewSubscription = (sub) => {
    console.log('Renew subscription for', sub.planName);
    toast.info(t('dashboard.renewalInitiated', { planName: sub.planName }));
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
    const { t } = useTranslation();

    const getStatusColor = (status, paymentStatus) => {
      if (paymentStatus === 'past_due' || paymentStatus === 'unpaid') {
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500', label: paymentStatus.replace('_', ' ').toUpperCase() };
      }
      switch (status) {
        case 'ACTIVE':
          return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500', label: t('dashboard.status.active') };
        case 'TRIALING':
          return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500', label: t('dashboard.status.trialing') };
        case 'CANCELLED':
          return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500', label: t('dashboard.status.canceled') };
        default:
          return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-300', label: status };
      }
    };

    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" />
          {t('dashboard.activeSubscriptions', { count: subscriptions.length })}
        </h2>
        
        {subscriptions.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500">{t('dashboard.noActiveSubscriptions')}</p>
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
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-extrabold text-gray-900">{sub.planName} {t('dashboard.plan')}</h3>
                        <div className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors.bg} ${statusColors.text}`}>
                          {statusColors.label}
                        </div>
                      </div>

                      <div className="border-b pb-4 mb-4">
                        <p className={`text-4xl font-black ${isPriceChange ? 'text-green-600' : 'text-gray-600'}`}>
                          {formatPriceDynamic(sub.currentPriceFormatted, sub.currencySymbol, sub.currencyPosition)}
                          <span className="text-lg font-medium text-gray-500">/{sub.billingCycle.toLowerCase()}</span>
                        </p>
                        {isPriceChange && sub.oldPriceFormatted && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <span className="line-through mr-1">
                              {formatPriceDynamic(sub.oldPriceFormatted, sub.currencySymbol, sub.currencyPosition)}
                            </span>
                            <span className="font-semibold">{t('dashboard.priceChangeNextCycle')}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 text-gray-700 text-sm">
                        <DetailRow icon={Calendar} label={t('dashboard.nextBilling')} value={formatDate(sub.endDate)} highlight={true} />
                        <DetailRow icon={Calendar} label={t('dashboard.startDate')} value={formatDate(sub.startDate)} />
                        <DetailRow label={t('dashboard.autoRenew')} value={sub.autoRenew ? t('dashboard.enabled') : t('dashboard.disabled')} valueColor={sub.autoRenew ? 'text-green-600' : 'text-red-600'} />
                        <DetailRow label={t('dashboard.cancelAtPeriodEnd')} value={sub.cancelAtPeriodEnd ? t('dashboard.yes') : t('dashboard.no')} valueColor={sub.cancelAtPeriodEnd ? 'text-red-600' : 'text-green-600'} />
                        {sub.trialEndDate && (
                          <DetailRow icon={Calendar} label={t('dashboard.trialEnds')} value={formatDate(sub.trialEndDate)} valueColor="text-blue-600" />
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="font-semibold text-gray-800 mb-2">{t('dashboard.includedApplications')}:</p>
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

                      {sub.nextPlanName && (
                        <div className="mt-5 p-4 bg-indigo-50 rounded border border-indigo-200">
                          <p className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            {t('dashboard.upcomingPlanChange')}
                          </p>
                          <p className="text-sm text-indigo-800">
                            <span className="font-semibold">{sub.nextPlanName}</span>
                            ({formatPriceDynamic(sub.nextPlanPriceFormatted, sub.currencySymbol, sub.currencyPosition)}/{sub.nextInterval}) 
                            {t('dashboard.startingOn')} <strong>{formatDate(sub.nextPlanActiveDate)}</strong>.
                          </p>
                        </div>
                      )}

                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="font-semibold text-gray-800 mb-2">{t('dashboard.paymentAndBilling')}:</p>
                        {sub.paymentMethods && sub.paymentMethods.length ? (
                          <div className="space-y-2">
                            {(() => {
                              const lastPm = sub.paymentMethods[sub.paymentMethods.length - 1];
                              return (
                                <p key={lastPm.id} className="text-sm text-gray-600 flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-gray-500" />
                                  {lastPm.cardType} {t('dashboard.endingIn')} <strong>{lastPm.last4}</strong>, {t('dashboard.expires')} {lastPm.expMonth}/{lastPm.expYear}
                                </p>
                              );
                            })()}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">{t('dashboard.noPaymentMethod')}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex space-x-3">
                      {sub.canChangePlan && (
                        <button
                          onClick={() => handleChangePlanSelection(sub)}
                          className="flex-1 py-2 rounded-full font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md disabled:bg-indigo-400"
                          disabled={isLoading}
                          aria-label={t('dashboard.aria.changePlan', { planName: sub.planName })}
                        >
                          {t('dashboard.changePlan')}
                        </button>
                      )}
                      {sub.canCancel && (
                        <button
                          onClick={() => {
                            setSubscriptionToCancel(sub);
                            setSelectedCancelApps(sub.applicationIds || []);
                            setShowCancelSelectionModal(true);
                          }}
                          className={`flex-1 py-2 rounded-full font-bold text-sm text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-all duration-200 shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isLoading}
                          aria-label={t('dashboard.aria.cancelSubscription', { planName: sub.planName })}
                        >
                          {t('dashboard.cancel')}
                        </button>
                      )}
                      {sub.canRenew && (
                        <button
                          onClick={() => handleRenewSubscription(sub)}
                          className="flex-1 py-2 rounded-full font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md disabled:bg-green-400"
                          disabled={isLoading}
                          aria-label={t('dashboard.aria.renewSubscription', { planName: sub.planName })}
                        >
                          {t('dashboard.renew')}
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
    const { t } = useTranslation();
    let classes = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200';
    let IconComponent = Package; 
    let iconClass = 'w-3 h-3 mr-1.5';
    let label = name;

    if (canceled) {
      classes += ' bg-red-100 text-red-800';
      IconComponent = XCircle;
      iconClass += ' text-red-600';
      label += ` (${t('dashboard.canceled')})`;
    } else if (active) {
      classes += ' bg-indigo-100 text-indigo-800';
      iconClass += ' text-indigo-600';
    } else {
      classes += ' bg-gray-100 text-gray-600';
      iconClass += ' text-gray-500';
    }

    if (changed) {
      classes += ' ring-2 ring-offset-2 ring-blue-500';
      label += ` (${t('dashboard.changed')})`;
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <div className="flex space-x-2">
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0
              }}
              className="w-4 h-4 rounded-full bg-red-800 shadow-md"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.2
              }}
              className="w-4 h-4 rounded-full bg-yellow-600 shadow-md"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.4
              }}
              className="w-4 h-4 rounded-full bg-gray-900 shadow-md"
            />
          </div>
  
          <p className="text-gray-600 mt-6 text-lg">{t('dashboard.loadingDashboard')}</p>
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
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-xl font-semibold text-red-500">{t('dashboard.error')}</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all duration-200 font-medium"
            aria-label="Retry loading dashboard"
          >
            <RefreshCw className="w-5 h-5" />
            {t('dashboard.retry')}
          </button>
        </motion.div>
      </div>
    );
  }

  const { subscriptions, appHistory, plans, subscriptionHistory } = dashboardData;
  const newProducts = getNewProducts();
  const customerName = localStorage.getItem('CompanyEmail') || t('dashboard.user');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a 
                href="https://www.ifaceh.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <span className="font-bold text-xl sm:text-2xl">
                  <span className="text-gray-900">{t('dashboard.interface')}</span>
                  <span className="text-violet-600">{t('dashboard.hub')}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </header> */}
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-4"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
          {t('dashboard.welcome', { name: customerName })}
        </h1>

        <SubscriptionCardRedesign
          subscriptions={subscriptions}
          isLoading={isLoading}
          setSubscriptionToCancel={setSubscriptionToCancel}
          setSelectedCancelApps={setSelectedCancelApps}
          setShowCancelSelectionModal={setShowCancelSelectionModal}
        />

        {newProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              {t('dashboard.newProductsAvailable')}
            </h2>
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <p className="text-gray-600 mb-4">{t('dashboard.exploreNewOfferings')}</p>
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
                className="mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                aria-label="Explore new products"
              >
                <PlusCircle className="w-5 h-5" />
                {t('dashboard.exploreNewProducts')}
              </button>
            </div>
          </section>
        )}

        {subscriptions.some(sub => sub.invoices?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {t('dashboard.billingHistory')}
            </h2>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-gray-600 font-semibold">{t('dashboard.date')}</th>
                      <th className="py-2 px-4 text-gray-600 font-semibold">{t('dashboard.amount')}</th>
                      <th className="py-2 px-4 text-gray-600 font-semibold">{t('dashboard.status')}</th>
                      <th className="py-2 px-4 text-gray-600 font-semibold">{t('dashboard.action')}</th>
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
                          <td className="py-2 px-4 text-gray-600">{formatPriceDynamic(invoice.amount.toFixed(2), dashboardData.currencySymbol, dashboardData.currencyPosition)}</td>
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
                              aria-label={`${t('dashboard.downloadInvoice')} ${invoice.id}`}
                            >
                              {t('dashboard.download')}
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

        {subscriptionHistory.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {t('dashboard.subscriptionHistory')}
            </h2>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="space-y-3">
                {subscriptionHistory.map((history, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <p className="text-gray-600">
                      <span className="font-semibold">{history.planName}</span> {t('dashboard.was')} {history.status.toLowerCase()} {t('dashboard.from')} {' '}
                      {formatDate(history.startDate)} {t('dashboard.to')} {formatDate(history.endDate)}
                      {history.archivedOn && `, ${t('dashboard.archivedOn')} ${formatDate(history.archivedOn)}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {appHistory.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              {t('dashboard.cancellationHistory')}
            </h2>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="space-y-3">
                {appHistory.map((history, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-gray-600">
                      <span className="font-semibold">{history.appName}</span> {t('dashboard.wasCanceledOn')} {' '}
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
              <h3 id="cancel-selection-title" className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.selectAppsToCancel')}</h3>
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
                      aria-label={t('dashboard.aria.selectAppForCancel', { appName: app.name })}
                    />
                    <label htmlFor={`cancel-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {selectedCancelApps.length === 0 && (
                <p className="text-red-500 text-sm mt-2" role="alert">{t('dashboard.atLeastOneAppRequired')}</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Cancel selection"
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-full transition-colors ${
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
                  {t('dashboard.next')}
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
              <h3 id="cancel-confirm-title" className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.confirmCancellation')}</h3>
              <p className="text-sm text-gray-600 mb-6">
                {t('dashboard.confirmCancelMessage', {
                  apps: subscriptionToCancel?.applications
                    .filter(app => selectedCancelApps.includes(app.id))
                    .map(app => app.name)
                    .join(', ')
                })}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  disabled={cancelling}
                  aria-label="Cancel cancellation"
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-full transition-colors min-w-[140px] ${
                    cancelling 
                      ? 'bg-red-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  aria-label="Confirm cancellation"
                >
                  {cancelling ? (
                    <span className="flex items-center justify-center gap-2">
                      {t('dashboard.cancelling')}
                      <FiLoader className="h-4 w-4 animate-spin" />
                    </span>
                  ) : (
                    t('dashboard.confirmCancellationButton')
                  )}
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
              <h3 id="change-plan-selection-title" className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.selectAppsForPlanChange')}</h3>
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
                      aria-label={t('dashboard.aria.selectAppForChange', { appName: app.name })}
                    />
                    <label htmlFor={`change-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {selectedChangePlanApps.length === 0 && (
                <p className="text-red-500 text-sm mt-2" role="alert">{t('dashboard.atLeastOneAppRequired')}</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Cancel selection"
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-full transition-colors ${
                    isLoading || selectedChangePlanApps.length === 0
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  onClick={handleChangePlan}
                  disabled={isLoading || selectedChangePlanApps.length === 0}
                  aria-label="Proceed to change plan"
                >
                  {t('dashboard.next')}
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
              <h3 id="add-product-selection-title" className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.selectAppsToAdd')}</h3>
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
                      aria-label={t('dashboard.aria.selectAppToAdd', { appName: app.name })}
                    />
                    <label htmlFor={`add-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {newProducts.length === 0 && (
                <p className="text-gray-600 text-sm mt-2">{t('dashboard.noUnsubscribedApps')}</p>
              )}
              {selectedAddProductApps.length === 0 && newProducts.length > 0 && (
                <p className="text-red-500 text-sm mt-2" role="alert">{t('dashboard.atLeastOneAppRequired')}</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Cancel selection"
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-full transition-colors ${
                    isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  onClick={handleAddProduct}
                  disabled={isLoading || selectedAddProductApps.length === 0 || newProducts.length === 0}
                  aria-label="Proceed to add product"
                >
                  {t('dashboard.next')}
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
              <h3 id="success-modal-title" className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.success')}</h3>
              <p className="text-sm text-gray-600 mb-6">{location.state?.successMessage}</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                  onClick={closeAllModals}
                  aria-label="Close success message"
                >
                  {t('dashboard.ok')}
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