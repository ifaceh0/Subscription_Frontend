// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, DollarSign, RefreshCw, Package } from "lucide-react";

// const SubscriptionDashboard = () => {
//   const navigate = useNavigate();
//   const [subscriptionDetails, setSubscriptionDetails] = useState(null);
//   const [availablePlans, setAvailablePlans] = useState([]);
//   const [error, setError] = useState("");
//   const [userName, setUserName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);

//   // New states for cancel selection
//   const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
//   const [selectedCancelApps, setSelectedCancelApps] = useState([]);
//   const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

//   // New states for change plan
//   const [showChangeSelectionModal, setShowChangeSelectionModal] = useState(false);
//   const [selectedChangeApps, setSelectedChangeApps] = useState([]);
//   const [selectedNewPlan, setSelectedNewPlan] = useState(null);
//   const [showChangeConfirmModal, setShowChangeConfirmModal] = useState(false);

//   const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

//   useEffect(() => {
//     const email = localStorage.getItem("CompanyEmail");

//     if (email) {
//       const fetchSubscriptionDetails = async () => {
//         setIsLoading(true);
//         try {
//           const response = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
//             headers: { "Content-Type": "application/json" },
//           });

//           if (!response.ok) {
//             throw new Error(await response.text());
//           }
//           const data = await response.json();
//           const subscriptionData = data.subscriptions && data.subscriptions.length > 0 ? data.subscriptions[0] : null;
//           if (subscriptionData) {
//             setSubscriptionDetails(subscriptionData);
//             localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
//           } else {
//             setError("No subscription found for this account.");
//           }
//           setAvailablePlans(data.plans || []);
//         } catch (err) {
//           console.error("Fetch error:", err);
//           setError(`Failed to load subscription details: ${err.message}`);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchSubscriptionDetails();
//     } else {
//       setError("No email found. Please sign in again.");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (error && error !== "No email found. Please sign in again.") {
//       const timer = setTimeout(() => setError(""), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatPrice = (price) => {
//     if (price == null) return "N/A";
//     return `$${price.toFixed(2)}`;
//   };

//   const formatApplications = (applications) => {
//     if (!applications || applications.length === 0) return ["None"];
//     return applications;
//   };

//   const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await fetch(url, options);
//         if (response.status === 429) {
//           const retryAfter = response.headers.get("Retry-After") || delay * Math.pow(2, i);
//           await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
//           continue;
//         }
//         if (!response.ok) {
//           throw new Error(await response.text());
//         }
//         return response;
//       } catch (err) {
//         if (i === retries - 1) throw err;
//         await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
//       }
//     }
//   };

//   const handleCancelSelection = () => {
//     if (selectedCancelApps.length === 0) {
//       setError("Please select at least one application to cancel.");
//       return;
//     }
//     setShowCancelSelectionModal(false);
//     setShowCancelConfirmModal(true);
//   };

//   const cancelSubscription = async () => {
//     const email = localStorage.getItem("CompanyEmail");
//     if (!email) {
//       setError("No email found. Please sign in again.");
//       return;
//     }

//     setShowCancelConfirmModal(false);
//     setError("");

//     try {
//       const response = await fetchWithBackoff(
//         `${API_URL}/api/subscription/cancel-plan`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ 
//             email,
//             appNames: selectedCancelApps.join(",")
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.message) {
//         setShowCancelModal(true);
//         setSelectedCancelApps([]);
//         setTimeout(async () => {
//           try {
//             const detailsResponse = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
//               headers: { "Content-Type": "application/json" },
//             });
//             if (detailsResponse.ok) {
//               const updatedData = await detailsResponse.json();
//               const subscriptionData = updatedData.subscriptions && updatedData.subscriptions.length > 0 ? updatedData.subscriptions[0] : null;
//               if (subscriptionData) {
//                 setSubscriptionDetails(subscriptionData);
//                 localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
//               } else {
//                 setError("No subscription found after cancellation.");
//               }
//             }
//           } catch (err) {
//             console.error("Failed to refresh subscription details:", err);
//             setError(`Failed to refresh subscription details: ${err.message}`);
//           }
//         }, 2000);
//       } else {
//         setError(data.error || "Failed to cancel subscription.");
//       }
//     } catch (err) {
//       setError(`Failed to cancel subscription: ${err.message}`);
//     }
//   };

//   const handleChangeSelection = () => {
//     if (selectedChangeApps.length === 0) {
//       setError("Please select at least one application to change.");
//       return;
//     }
//     if (!selectedNewPlan) {
//       setError("Please select a new plan.");
//       return;
//     }
//     setShowChangeSelectionModal(false);
//     setShowChangeConfirmModal(true);
//   };

//   const changePlan = async () => {
//     const email = localStorage.getItem("CompanyEmail");
//     if (!email) {
//       setError("No email found. Please sign in again.");
//       return;
//     }

//     setShowChangeConfirmModal(false);
//     setError("");

//     try {
//       const response = await fetchWithBackoff(
//         `${API_URL}/api/subscription/change-plan`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ 
//             email,
//             appNames: selectedChangeApps.join(","),
//             newPlanTypeId: selectedNewPlan.id // Assuming availablePlans have 'id' field
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.message) {
//         // Show success modal or message
//         setShowCancelModal(true); // Reusing cancel modal for success, but update text if needed
//         setSelectedChangeApps([]);
//         setSelectedNewPlan(null);
//         setTimeout(async () => {
//           try {
//             const detailsResponse = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
//               headers: { "Content-Type": "application/json" },
//             });
//             if (detailsResponse.ok) {
//               const updatedData = await detailsResponse.json();
//               const subscriptionData = updatedData.subscriptions && updatedData.subscriptions.length > 0 ? updatedData.subscriptions[0] : null;
//               if (subscriptionData) {
//                 setSubscriptionDetails(subscriptionData);
//                 localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
//               } else {
//                 setError("No subscription found after plan change.");
//               }
//             }
//           } catch (err) {
//             console.error("Failed to refresh subscription details:", err);
//             setError(`Failed to refresh subscription details: ${err.message}`);
//           }
//         }, 2000);
//       } else {
//         setError(data.error || "Failed to change plan.");
//       }
//     } catch (err) {
//       setError(`Failed to change plan: ${err.message}`);
//     }
//   };

//   const goToPlanSelection = () => {
//     // Removed navigation, handling in modal now
//     setShowChangeSelectionModal(true);
//   };

//   const closeCancelModal = () => {
//     setShowCancelModal(false);
//   };

//   const toggleCancelApp = (app) => {
//     setSelectedCancelApps((prev) =>
//       prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
//     );
//   };

//   const toggleChangeApp = (app) => {
//     setSelectedChangeApps((prev) =>
//       prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
//     );
//   };

//   const filteredPlans = availablePlans.filter(
//     (plan) => plan.name !== subscriptionDetails?.planName // Assuming plans have 'name' field matching planName
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
//           <h2 className="text-3xl font-bold tracking-tight">Your Subscription Dashboard</h2>
//           <p className="text-sm opacity-80 mt-1">Manage your plan and view details</p>
//         </div>

//         {/* Main Content */}
//         <div className="p-8">
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
//               <p className="mt-4 text-gray-600 text-lg">Loading subscription details...</p>
//             </div>
//           ) : (
//             <>
//               {/* Status Banner */}
//               <div className="flex items-center justify-between bg-green-100 text-green-800 p-4 rounded-lg mb-8">
//                 <div className="flex items-center space-x-3">
//                   <span className="font-semibold text-lg">Status:</span>
//                   <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
//                     {subscriptionDetails?.status || "N/A"}
//                   </span>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg flex items-center justify-between">
//                   <p className="text-sm">{error}</p>
//                   <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
//                     ✕
//                   </button>
//                 </div>
//               )}

//               {/* Current Plan Card */}
//               {subscriptionDetails && (
//                 <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Plan Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <div className="flex items-center gap-4">
//                       <DollarSign className="h-8 w-8 text-purple-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Plan</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {subscriptionDetails.planName} ({subscriptionDetails.interval})
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <DollarSign className="h-8 w-8 text-purple-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Price</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {formatPrice(subscriptionDetails.price)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <RefreshCw className="h-8 w-8 text-purple-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Auto Renew</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {subscriptionDetails.autoRenew ? "Enabled" : "Disabled"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <Calendar className="h-8 w-8 text-purple-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Start Date</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {formatDate(subscriptionDetails.startDate)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <Calendar className="h-8 w-8 text-purple-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">End Date</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {formatDate(subscriptionDetails.endDate)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <RefreshCw className="h-8 w-8 text-purple-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Cancel at Period End</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {subscriptionDetails.cancelAtPeriodEnd ? "Yes" : "No"}
//                         </p>
//                       </div>
//                     </div>
//                     {formatApplications(subscriptionDetails.applications).map((app, index) => (
//                       <div key={index} className="flex items-center gap-4">
//                         <Package className="h-8 w-8 text-purple-600" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-500">Application</p>
//                           <p className="text-lg font-semibold text-gray-900">{app}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Next Plan Card */}
//               {subscriptionDetails?.nextPlanName && (
//                 <div className="bg-blue-50 rounded-2xl shadow-md p-6 mb-8">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4">Next Plan Details</h3>
//                   <div className="flex items-center gap-4">
//                     <DollarSign className="h-8 w-8 text-blue-600" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Next Plan</p>
//                       <p className="text-lg font-semibold text-gray-900">
//                         {subscriptionDetails.nextPlanName} ({subscriptionDetails.nextInterval})
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               {subscriptionDetails && (
//                 <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
//                   <button
//                     onClick={goToPlanSelection}
//                     disabled={subscriptionDetails?.cancelAtPeriodEnd}
//                     className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
//                       subscriptionDetails?.cancelAtPeriodEnd
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700"
//                     }`}
//                   >
//                     Change Plan
//                   </button>
//                   <button
//                     onClick={() => setShowCancelSelectionModal(true)}
//                     disabled={subscriptionDetails?.cancelAtPeriodEnd}
//                     className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
//                       subscriptionDetails?.cancelAtPeriodEnd
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-red-600 hover:bg-red-700"
//                     }`}
//                   >
//                     Cancel Subscription
//                   </button>
//                 </div>
//               )}

//               {/* Cancel Success Modal */}
//               {showCancelModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-4">Operation Successful</h3>
//                     <p className="text-gray-600 mb-6">
//                       Your request has been processed. It will remain active until{" "}
//                       <span className="font-semibold">{formatDate(subscriptionDetails.endDate)}</span>.
//                       You will receive a confirmation email soon.
//                     </p>
//                     <div className="flex justify-end">
//                       <button
//                         onClick={closeCancelModal}
//                         className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Cancel Selection Modal */}
//               {showCancelSelectionModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Applications to Cancel</h3>
//                     <div className="space-y-4 mb-6">
//                       {formatApplications(subscriptionDetails.applications).map((app) => (
//                         <div key={app} className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id={`cancel-${app}`}
//                             checked={selectedCancelApps.includes(app)}
//                             onChange={() => toggleCancelApp(app)}
//                             className="mr-2"
//                           />
//                           <label htmlFor={`cancel-${app}`}>{app}</label>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="flex justify-end space-x-4">
//                       <button
//                         onClick={() => {
//                           setShowCancelSelectionModal(false);
//                           setSelectedCancelApps([]);
//                         }}
//                         className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleCancelSelection}
//                         className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Cancel Confirm Modal */}
//               {showCancelConfirmModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
//                     <p className="text-gray-600 mb-6">
//                       Are you sure you want to cancel the selected applications: {selectedCancelApps.join(", ")}?
//                     </p>
//                     <div className="flex justify-end space-x-4">
//                       <button
//                         onClick={() => setShowCancelConfirmModal(false)}
//                         className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
//                       >
//                         No
//                       </button>
//                       <button
//                         onClick={cancelSubscription}
//                         className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700"
//                       >
//                         Yes, Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Change Selection Modal */}
//               {showChangeSelectionModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-4">Change Plan</h3>
//                     <div className="mb-6">
//                       <h4 className="text-lg font-medium mb-2">Select Applications to Change</h4>
//                       <div className="space-y-2">
//                         {formatApplications(subscriptionDetails.applications).map((app) => (
//                           <div key={app} className="flex items-center">
//                             <input
//                               type="checkbox"
//                               id={`change-${app}`}
//                               checked={selectedChangeApps.includes(app)}
//                               onChange={() => toggleChangeApp(app)}
//                               className="mr-2"
//                             />
//                             <label htmlFor={`change-${app}`}>{app}</label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="mb-6">
//                       <h4 className="text-lg font-medium mb-2">Select New Plan</h4>
//                       <div className="space-y-2">
//                         {filteredPlans.map((plan) => (
//                           <div key={plan.id} className="flex items-center">
//                             <input
//                               type="radio"
//                               id={`plan-${plan.id}`}
//                               checked={selectedNewPlan?.id === plan.id}
//                               onChange={() => setSelectedNewPlan(plan)}
//                               className="mr-2"
//                             />
//                             <label htmlFor={`plan-${plan.id}`}>
//                               {plan.name} - {formatPrice(plan.price)} /{plan.interval}
//                             </label>
//                           </div>
//                         ))}
//                         {filteredPlans.length === 0 && <p>No other plans available.</p>}
//                       </div>
//                     </div>
//                     <div className="flex justify-end space-x-4">
//                       <button
//                         onClick={() => {
//                           setShowChangeSelectionModal(false);
//                           setSelectedChangeApps([]);
//                           setSelectedNewPlan(null);
//                         }}
//                         className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleChangeSelection}
//                         className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Change Confirm Modal */}
//               {showChangeConfirmModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Plan Change</h3>
//                     <p className="text-gray-600 mb-6">
//                       Are you sure you want to change the plan for {selectedChangeApps.join(", ")} to {selectedNewPlan.name}?
//                     </p>
//                     <div className="flex justify-end space-x-4">
//                       <button
//                         onClick={() => setShowChangeConfirmModal(false)}
//                         className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
//                       >
//                         No
//                       </button>
//                       <button
//                         onClick={changePlan}
//                         className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
//                       >
//                         Yes, Change
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* No Subscription Message */}
//               {!subscriptionDetails && !error && (
//                 <div className="text-center text-gray-600 text-lg py-12">
//                   No subscription details available.
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionDashboard;






















import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, DollarSign, RefreshCw, Package } from "lucide-react";

const SubscriptionDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [error, setError] = useState(location.state?.successMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
  const [selectedCancelApps, setSelectedCancelApps] = useState([]);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.successMessage);

  const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

  useEffect(() => {
    const email = localStorage.getItem("CompanyEmail");

    if (email) {
      const fetchSubscriptionDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }
          const data = await response.json();
          const subscriptionData = data.subscriptions && data.subscriptions.length > 0 ? data.subscriptions[0] : null;
          if (subscriptionData) {
            setSubscriptionDetails(subscriptionData);
            localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
          } else {
            setError("No subscription found for this account.");
          }
          setAvailablePlans(data.plans || []);
        } catch (err) {
          console.error("Fetch error:", err);
          setError(`Failed to load subscription details: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSubscriptionDetails();
    } else {
      setError("No email found. Please sign in again.");
    }
  }, [navigate]);

  useEffect(() => {
    if (error && error !== "No email found. Please sign in again.") {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price, interval = "monthly") => {
    if (price == null) return "N/A";
    if (interval === "monthly") return `$${parseFloat(price).toFixed(2)} /month`;
    if (interval === "quarterly") return `$${parseFloat(price).toFixed(2)} /quarter`;
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatApplications = (applications) => {
    if (!applications || applications.length === 0) return ["None"];
    return applications;
  };

  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After") || delay * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  const handleCancelSelection = () => {
    if (selectedCancelApps.length === 0) {
      setError("Please select at least one application to cancel.");
      return;
    }
    setShowCancelSelectionModal(false);
    setShowCancelConfirmModal(true);
  };

  const cancelSubscription = async () => {
    const email = localStorage.getItem("CompanyEmail");
    if (!email) {
      setError("No email found. Please sign in again.");
      return;
    }

    setShowCancelConfirmModal(false);
    setError("");

    try {
      const response = await fetchWithBackoff(
        `${API_URL}/api/subscription/cancel-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email,
            appNames: selectedCancelApps.join(",")
          }),
        }
      );
      const data = await response.json();
      if (data.message) {
        setShowSuccessModal(true);
        setSelectedCancelApps([]);
        setTimeout(async () => {
          try {
            const detailsResponse = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
              headers: { "Content-Type": "application/json" },
            });
            if (detailsResponse.ok) {
              const updatedData = await detailsResponse.json();
              const subscriptionData = updatedData.subscriptions && updatedData.subscriptions.length > 0 ? updatedData.subscriptions[0] : null;
              if (subscriptionData) {
                setSubscriptionDetails(subscriptionData);
                localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
              } else {
                setError("No subscription found after cancellation.");
              }
            }
          } catch (err) {
            console.error("Failed to refresh subscription details:", err);
            setError(`Failed to refresh subscription details: ${err.message}`);
          }
        }, 2000);
      } else {
        setError(data.error || "Failed to cancel subscription.");
      }
    } catch (err) {
      setError(`Failed to cancel subscription: ${err.message}`);
    }
  };

  const goToChangePlan = () => {
    navigate("/subscription-dashboard/change-plan", { state: { subscriptionDetails } });
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/subscription-dashboard", { replace: true }); // Clear success message from state
  };

  const toggleCancelApp = (app) => {
    setSelectedCancelApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <h2 className="text-3xl font-bold tracking-tight">Your Subscription Dashboard</h2>
          <p className="text-sm opacity-80 mt-1">Manage your plan and view details</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading subscription details...</p>
            </div>
          ) : (
            <>
              {/* Status Banner */}
              <div className="flex items-center justify-between bg-green-100 text-green-800 p-4 rounded-lg mb-8">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">Status:</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {subscriptionDetails?.status || "N/A"}
                  </span>
                </div>
              </div>

              {/* Error/Success Message */}
              {error && (
                <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg flex items-center justify-between">
                  <p className="text-sm">{error}</p>
                  <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
                    ✕
                  </button>
                </div>
              )}

              {/* Current Plan Card */}
              {subscriptionDetails && (
                <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Plan Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Plan</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionDetails.planName} ({subscriptionDetails.interval})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(subscriptionDetails.price, subscriptionDetails.interval)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RefreshCw className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Auto Renew</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionDetails.autoRenew ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Start Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(subscriptionDetails.startDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">End Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(subscriptionDetails.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RefreshCw className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cancel at Period End</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionDetails.cancelAtPeriodEnd ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    {formatApplications(subscriptionDetails.applications).map((app, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Package className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Application</p>
                          <p className="text-lg font-semibold text-gray-900">{app}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Plan Card */}
              {subscriptionDetails?.nextPlanName && (
                <div className="bg-blue-50 rounded-2xl shadow-md p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Next Plan Details</h3>
                  <div className="flex items-center gap-4">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Next Plan</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscriptionDetails.nextPlanName} ({subscriptionDetails.nextInterval})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {subscriptionDetails && (
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                  <button
                    onClick={goToChangePlan}
                    disabled={subscriptionDetails?.cancelAtPeriodEnd}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                      subscriptionDetails?.cancelAtPeriodEnd
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Change Plan
                  </button>
                  <button
                    onClick={() => setShowCancelSelectionModal(true)}
                    disabled={subscriptionDetails?.cancelAtPeriodEnd}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                      subscriptionDetails?.cancelAtPeriodEnd
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}

              {/* Success Modal */}
              {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Operation Successful</h3>
                    <p className="text-gray-600 mb-6">
                      Your request has been processed. It will remain active until{" "}
                      <span className="font-semibold">{formatDate(subscriptionDetails.endDate)}</span>.
                      You will receive a confirmation email soon.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={closeSuccessModal}
                        className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel Selection Modal */}
              {showCancelSelectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Applications to Cancel</h3>
                    <div className="space-y-4 mb-6">
                      {formatApplications(subscriptionDetails.applications).map((app) => (
                        <div key={app} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cancel-${app}`}
                            checked={selectedCancelApps.includes(app)}
                            onChange={() => toggleCancelApp(app)}
                            className="mr-2"
                          />
                          <label htmlFor={`cancel-${app}`}>{app}</label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setShowCancelSelectionModal(false);
                          setSelectedCancelApps([]);
                        }}
                        className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCancelSelection}
                        className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel Confirm Modal */}
              {showCancelConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to cancel the selected applications: {selectedCancelApps.join(", ")}?
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowCancelConfirmModal(false)}
                        className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
                      >
                        No
                      </button>
                      <button
                        onClick={cancelSubscription}
                        className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700"
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* No Subscription Message */}
              {!subscriptionDetails && !error && (
                <div className="text-center text-gray-600 text-lg py-12">
                  No subscription details available.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDashboard;