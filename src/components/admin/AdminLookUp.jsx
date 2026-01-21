// import React, { useEffect, useState } from 'react';
// import { X, Loader2, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('ErrorBoundary caught:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-6 text-center">
//           <h3 className="text-lg font-semibold text-red-600">Something went wrong.</h3>
//           <p className="text-gray-600">Please try refreshing the page or contact support.</p>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// function AdminPlanManager() {
//   const [applications, setApplications] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [planTypes, setPlanTypes] = useState([]);
//   const [selectedApps, setSelectedApps] = useState([]);
//   const [form, setForm] = useState({
//     id: '',
//     applicationIds: [],
//     planTypeMappingId: '',
//     monthlyBasePrice: '',
//     discountPercent: '',
//     stripePriceId: '',
//   });
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [planToDelete, setPlanToDelete] = useState(null);
//   const [planToSync, setPlanToSync] = useState(null);
//   const [planToEdit, setPlanToEdit] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const convertDTOToPlan = (dto) => {
//     const planType = planTypes.find(pt => pt.id === (dto.planTypeMappingId || (dto.plan && dto.plan.id)));
//     const applicationIds = Array.isArray(dto.applicationIds)
//       ? dto.applicationIds
//       : dto.applications
//       ? dto.applications.map(app => app.id)
//       : [];
//     return {
//       id: dto.id || null,
//       plan: planType || { id: dto.planTypeMappingId || (dto.plan && dto.plan.id) || 0, planName: 'Unknown', interval: 'Unknown' },
//       applications: applicationIds.map(id => applications.find(app => app.id === id) || { id, name: 'Unknown' }),
//       planTypeMappingId: dto.planTypeMappingId || (dto.plan && dto.plan.id) || '',
//       monthlyBasePrice: dto.monthlyBasePrice || null,
//       discountPercent: dto.discountPercent || 0,
//       stripePriceId: dto.stripePriceId || '',
//       calculatedPrice: dto.calculatedPrice || 0,
//       discountedPrice: dto.discountedPrice || 0,
//       deleted: dto.deleted || false,
//     };
//   };

//   useEffect(() => {
//     fetchApplications();
//     fetchPlanTypes();
//   }, []);

//   useEffect(() => {
//     if (selectedApps.length > 0) {
//       fetchPlans(selectedApps);
//     } else {
//       setPlans([]);
//     }
//   }, [selectedApps]);

//   const fetchApplications = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/applications');
//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }
//       const data = await res.json();
//       setApplications(data);
//     } catch (error) {
//       console.error('Fetch Applications Error:', error);
//       toast.error('Failed to fetch applications: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchPlanTypes = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/plan-types');
//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }
//       const data = await res.json();
//       setPlanTypes(data);
//     } catch (error) {
//       console.error('Fetch Plan Types Error:', error);
//       toast.error('Failed to fetch plan types: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchPlans = async (appNames) => {
//     setIsLoading(true);
//     try {
//       const query = appNames.map(name => `appNames=${encodeURIComponent(name)}`).join('&');
//       const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/plansByApp?${query}`);
//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }
//       const data = await res.json();
//       const filteredPlans = data
//         .map(convertDTOToPlan)
//         .filter(plan => !plan.deleted && plan.applications.length === appNames.length &&
//           plan.applications.every(app => appNames.includes(app.name)))
//         .sort((a, b) => {
//           const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
//           const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
//           const nameA = planTypeA ? planTypeA.planName : '';
//           const nameB = planTypeB ? planTypeB.planName : '';
//           const intervalA = planTypeA ? planTypeA.interval : '';
//           const intervalB = planTypeB ? planTypeB.interval : '';
//           return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
//         });
//       setPlans(filteredPlans);
//     } catch (error) {
//       console.error('Fetch Plans Error:', error);
//       toast.error('Failed to fetch plans: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStripeSync = async (planId) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/sync-stripe-price/${planId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const responseData = await res.json();
//       if (res.ok && responseData.status === 'success' && responseData.data) {
//         const updatedPlan = convertDTOToPlan(responseData.data);
//         if (!updatedPlan.id || !updatedPlan.stripePriceId) {
//           throw new Error('Invalid or incomplete plan data received');
//         }
//         toast.success('Stripe sync successful');
//         setPlans(prev => prev
//           .map(p => (p.id === updatedPlan.id ? updatedPlan : p))
//           .sort((a, b) => {
//             const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
//             const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
//             const nameA = planTypeA ? planTypeA.planName : '';
//             const nameB = planTypeB ? planTypeB.planName : '';
//             const intervalA = planTypeA ? planTypeA.interval : '';
//             const intervalB = planTypeB ? planTypeB.interval : '';
//             return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
//           }));
//       } else {
//         throw new Error(responseData.error || 'Failed to sync with Stripe');
//       }
//     } catch (error) {
//       console.error('Sync Error:', error);
//       toast.error(`Error syncing with Stripe: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//       setIsSyncModalOpen(false);
//       setPlanToSync(null);
//     }
//   };

//   const handleDeletePlan = async (planId) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/deletePlans/${planId}`, {
//         method: 'DELETE',
//       });
//       const responseData = await res.json();
//       if (res.ok) {
//         toast.success(responseData.message || 'Plan deleted successfully');
//         setPlans(prev => prev.filter(p => p.id !== planId));
//       } else {
//         throw new Error(responseData.error || `HTTP error! Status: ${res.status}`);
//       }
//     } catch (error) {
//       console.error('Delete Plan Error:', error);
//       toast.error(`Error deleting plan: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//       setIsDeleteModalOpen(false);
//       setPlanToDelete(null);
//     }
//   };

//   const handleUpdatePlan = async () => {
//     if (!form.applicationIds.length || !form.planTypeMappingId) {
//       toast.error('Applications and plan type are required');
//       return;
//     }
//     if (selectedApps.length === 1 && isMonthlyPlan() && (!form.monthlyBasePrice || parseFloat(form.monthlyBasePrice) < 0)) {
//       toast.error('Valid monthly base price is required for single-app monthly plans');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/updatePlans/${planToEdit.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...form,
//           monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) || null : null,
//           discountPercent: parseFloat(form.discountPercent) || 0,
//         }),
//       });
//       const responseData = await res.json();
//       if (res.ok && responseData.plan) {
//         toast.success(responseData.message || 'Plan updated successfully');
//         const updatedPlan = convertDTOToPlan(responseData.plan);
//         setPlans(prev => prev
//           .map(p => (p.id === planToEdit.id ? updatedPlan : p))
//           .sort((a, b) => {
//             const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
//             const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
//             const nameA = planTypeA ? planTypeA.planName : '';
//             const nameB = planTypeB ? planTypeB.planName : '';
//             const intervalA = planTypeA ? planTypeA.interval : '';
//             const intervalB = planTypeB ? planTypeB.interval : '';
//             return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
//           }));
//         closeModal();
//       } else {
//         throw new Error(responseData.error || `HTTP error! Status: ${res.status}`);
//       }
//     } catch (error) {
//       console.error('Update Plan Error:', error);
//       toast.error(`Error updating plan: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openDeleteModal = (planId) => {
//     setPlanToDelete(planId);
//     setIsDeleteModalOpen(true);
//   };

//   const openSyncModal = (planId) => {
//     setPlanToSync(planId);
//     setIsSyncModalOpen(true);
//   };

//   const openEditModal = (plan) => {
//     setPlanToEdit(plan);
//     setForm({
//       id: plan.id,
//       applicationIds: plan.applications.map(app => app.id),
//       planTypeMappingId: plan.plan ? plan.plan.id : plan.planTypeMappingId || '',
//       monthlyBasePrice: plan.monthlyBasePrice || '',
//       discountPercent: plan.discountPercent !== undefined ? String(plan.discountPercent) : '0',
//       stripePriceId: plan.stripePriceId || '',
//     });
//     setSelectedApps(plan.applications.map(app => app.name));
//     setIsEditModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsDeleteModalOpen(false);
//     setIsSyncModalOpen(false);
//     setIsEditModalOpen(false);
//     setPlanToDelete(null);
//     setPlanToSync(null);
//     setPlanToEdit(null);
//     setForm({
//       id: '',
//       applicationIds: [],
//       planTypeMappingId: '',
//       monthlyBasePrice: '',
//       discountPercent: '',
//       stripePriceId: '',
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'monthlyBasePrice' && value !== '' && parseFloat(value) < 0) {
//       toast.error('Monthly base price cannot be negative');
//       return;
//     }
//     if (name === 'discountPercent' && value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
//       toast.error('Discount percentage must be between 0 and 100');
//       return;
//     }
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAppChange = (appName) => {
//     const updatedApps = selectedApps.includes(appName)
//       ? selectedApps.filter(name => name !== appName)
//       : [...selectedApps, appName];
//     setSelectedApps(updatedApps);
//     setForm(prev => ({
//       ...prev,
//       applicationIds: updatedApps.map(name => applications.find(app => app.name === name)?.id).filter(id => id),
//     }));
//   };

//   const isMonthlyPlan = () => {
//     if (!form.planTypeMappingId) return false;
//     const selectedPlan = planTypes.find(pt => pt.id === Number(form.planTypeMappingId));
//     return selectedPlan && selectedPlan.interval.toLowerCase() === 'monthly';
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!form.applicationIds.length || !form.planTypeMappingId) {
//       toast.error('Applications and plan type are required');
//       return;
//     }
//     if (selectedApps.length === 1 && isMonthlyPlan() && (!form.monthlyBasePrice || parseFloat(form.monthlyBasePrice) < 0)) {
//       toast.error('Valid monthly base price is required for single-app monthly plans');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...form,
//           monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) || null : null,
//           discountPercent: parseFloat(form.discountPercent) || 0,
//         }),
//       });
//       const responseData = await res.json();
//       if (res.ok) {
//         if (responseData.message === 'Plan already exists') {
//           toast.error(`Plan already exists for applications: ${responseData.data.applications.map(app => app.name).join(', ')} and plan type: ${formatPlanType(responseData.data.plan)}`);
//           return;
//         }
//         const newPlan = convertDTOToPlan(responseData.data || responseData);
//         toast.success('Plan created successfully');
//         setPlans(prev => [...prev, newPlan].sort((a, b) => {
//           const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
//           const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
//           const nameA = planTypeA ? planTypeA.planName : '';
//           const nameB = planTypeB ? planTypeB.planName : '';
//           const intervalA = planTypeA ? planTypeA.interval : '';
//           const intervalB = planTypeB ? planTypeB.interval : '';
//           return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
//         }));
//         closeModal();
//         if (selectedApps.length) {
//           fetchPlans(selectedApps);
//         }
//       } else {
//         throw new Error(responseData.error || `HTTP error! Status: ${res.status}`);
//       }
//     } catch (error) {
//       console.error('Create Plan Error:', error);
//       toast.error(`Error creating plan: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatPlanType = (planType) => {
//     return planType && planType.planName && planType.interval
//       ? `${planType.planName} (${planType.interval})`
//       : planType && planType.planName
//       ? planType.planName
//       : `Plan ${planType ? planType.id : 'Unknown'}`;
//   };

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
//         {/* Loading Overlay */}
//         {isLoading && (
//           <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
//             <div className="flex items-center space-x-2">
//               <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span className="text-xl font-semibold text-gray-600">Loading...</span>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <header className="mb-8 border-b pb-4">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-3xl font-extrabold text-gray-900">Subscription Plan Manager</h1>
//           </div>
//           <p className="text-gray-500 mt-1">Configure pricing plans for applications and multi-app bundles.</p>
//         </header>
//         <div className="mb-8 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => navigate('/admin/add-application')}
//               className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center active:scale-95"
//             >
//               <Plus className="w-5 h-5 mr-2" />
//               Add New Application
//             </button>
//             <button
//               onClick={() => navigate('/admin/plan-type')}
//               className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center active:scale-95"
//             >
//               <Plus className="w-5 h-5 mr-2" />
//               Add New Plan Type
//             </button>
//           </div>
//         </div>
//         {/* Application Selection (Filter) */}
//         <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Select Applications to Manage</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {applications
//               .sort((a, b) => a.name.localeCompare(b.name))
//               .map(app => (
//                 <label key={app.id} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors select-none">
//                   <input
//                     type="checkbox"
//                     id={`app-${app.id}`}
//                     value={app.name}
//                     checked={selectedApps.includes(app.name)}
//                     onChange={() => handleAppChange(app.name)}
//                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   />
//                   <span className={`text-sm font-medium ${selectedApps.includes(app.name) ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
//                     {app.name}
//                   </span>
//                 </label>
//               ))}
//           </div>
//           {selectedApps.length > 0 && (
//             <p className="mt-4 text-sm text-gray-600">
//               Viewing plans for: <span className="font-medium text-indigo-600">{selectedApps.join(', ')}</span>
//             </p>
//           )}
//           {selectedApps.length === 0 && (
//             <p className="mt-4 text-sm text-red-500">At least one application is required to view or create plans.</p>
//           )}
//         </div>

//         {/* Plan Management Table */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Current Plans ({plans.length})</h2>
//             {selectedApps.length > 0 && (
//               <button
//                 onClick={() => {
//                   setForm({
//                     id: '',
//                     applicationIds: selectedApps.map(name => applications.find(app => app.name === name)?.id).filter(id => id),
//                     planTypeMappingId: '',
//                     monthlyBasePrice: '',
//                     discountPercent: '0',
//                     stripePriceId: '',
//                   });
//                   setPlanToEdit(null);
//                   setIsEditModalOpen(true);
//                 }}
//                 disabled={selectedApps.length === 0}
//                 className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center active:scale-95"
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add New Plan
//               </button>
//             )}
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center h-48">
//               <Loader2 className="w-8 h-8 text-indigo-600" />
//               <span className="ml-3 text-lg text-gray-600">Loading Plans...</span>
//             </div>
//           ) : selectedApps.length === 0 ? (
//             <p className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
//               Please select one or more applications above to view or create plans.
//             </p>
//           ) : plans.length === 0 ? (
//             <p className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
//               No plans found for the selected combination of applications. Click "Add New Plan" to create one.
//             </p>
//           ) : (
//             <div className="overflow-y-auto max-h-[500px] rounded-xl border border-gray-200">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe ID</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {plans.map((plan) => (
//                     <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{plan.applications.map(a => a.name).join(', ')}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <span className="font-semibold text-indigo-600">{formatPlanType(plan.plan)}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
//                         {plan.monthlyBasePrice !== null ? `$${plan.monthlyBasePrice.toFixed(2)}` : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.discountPercent}%</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
//                         ${plan.discountedPrice.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 truncate max-w-[150px] font-mono">
//                         {plan.stripePriceId ? (
//                           <span>{plan.stripePriceId}</span>
//                         ) : (
//                           <button
//                             className="p-2 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-yellow-50 transition-colors active:scale-95"
//                             onClick={() => openSyncModal(plan.id)}
//                             disabled={isLoading}
//                             title="Sync with Stripe"
//                           >
//                             <RefreshCw className="w-5 h-5" />
//                           </button>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                         <button
//                           className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50 transition-colors active:scale-95"
//                           onClick={() => openEditModal(plan)}
//                           disabled={isLoading}
//                           title="Edit Plan"
//                         >
//                           <Edit className="w-5 h-5" />
//                         </button>
//                         <button
//                           className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors active:scale-95"
//                           onClick={() => openDeleteModal(plan.id)}
//                           disabled={isLoading}
//                           title="Delete Plan"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Delete Confirmation Modal */}
//         <div
//           className={`fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ${
//             isDeleteModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//           }`}
//           aria-modal="true"
//           role="dialog"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//               <h3 className="text-2xl font-extrabold text-gray-800">Confirm Deletion</h3>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="py-6">
//               <p className="text-gray-700">
//                 Are you sure you want to delete Plan ID <span className="font-mono font-semibold">{planToDelete}</span>? This action will mark the plan as deleted and may affect active subscriptions.
//               </p>
//             </div>
//             <div className="pt-4 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDeletePlan(planToDelete)}
//                 className="px-6 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center"
//                 disabled={isLoading}
//               >
//                 {isLoading ? <Loader2 className="w-5 h-5 mr-2" /> : null}
//                 {isLoading ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stripe Sync Modal */}
//         <div
//           className={`fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ${
//             isSyncModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//           }`}
//           aria-modal="true"
//           role="dialog"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//               <h3 className="text-2xl font-extrabold text-gray-800">Confirm Stripe Sync</h3>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="py-6">
//               <p className="text-gray-700">
//                 Are you sure you want to sync Plan ID <span className="font-mono font-semibold">{planToSync}</span> with Stripe? This will create or update the plan in Stripe.
//               </p>
//             </div>
//             <div className="pt-4 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleStripeSync(planToSync)}
//                 className="px-6 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center"
//                 disabled={isLoading}
//               >
//                 {isLoading ? <Loader2 className="w-5 h-5 mr-2" /> : null}
//                 {isLoading ? 'Syncing...' : 'Sync'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Create/Edit Plan Modal */}
//         <div
//           className={`fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ${
//             isEditModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//           }`}
//           aria-modal="true"
//           role="dialog"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all p-6 md:p-8"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//               <h3 className="text-2xl font-extrabold text-gray-800">{planToEdit ? `Edit Plan ID: ${planToEdit.id}` : 'Create New Plan'}</h3>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="py-6">
//               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); planToEdit ? handleUpdatePlan() : handleSubmit(e); }}>
//                 <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
//                   <label className="block text-sm font-medium text-indigo-700">Selected Applications</label>
//                   <p className="text-sm text-indigo-800 mt-1 font-semibold">
//                     {selectedApps.length > 0 ? selectedApps.join(', ') : 'No applications selected.'}
//                   </p>
//                   <input type="hidden" name="applicationIds" value={form.applicationIds.join(',')} />
//                   {selectedApps.length === 0 && (
//                     <p className="text-sm text-red-500 mt-1">At least one application must be selected.</p>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="planTypeMappingId" className="block text-sm font-medium text-gray-700">Plan Type *</label>
//                   <select
//                     id="planTypeMappingId"
//                     name="planTypeMappingId"
//                     value={form.planTypeMappingId}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
//                     disabled={planTypes.length === 0}
//                   >
//                     <option value="" disabled>Select a Plan Type</option>
//                     {planTypes
//                       .sort((a, b) => {
//                         const nameA = a.planName || '';
//                         const nameB = b.planName || '';
//                         const intervalA = a.interval || '';
//                         const intervalB = b.interval || '';
//                         return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
//                       })
//                       .map(planType => (
//                         <option key={planType.id} value={planType.id}>
//                           {formatPlanType(planType)}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//                 {selectedApps.length === 1 && isMonthlyPlan() && (
//                   <div>
//                     <label htmlFor="monthlyBasePrice" className="block text-sm font-medium text-gray-700">Monthly Base Price ($) *</label>
//                     <input
//                       type="number"
//                       id="monthlyBasePrice"
//                       name="monthlyBasePrice"
//                       value={form.monthlyBasePrice}
//                       onChange={handleChange}
//                       step="0.01"
//                       min="0"
//                       placeholder="e.g., 49.99"
//                       required
//                       className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Required for single-app monthly plans (e.g., Basic Monthly, Pro Monthly, Enterprise Monthly).</p>
//                   </div>
//                 )}
//                 <div>
//                   <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700">Discount Percent (%)</label>
//                   <input
//                     type="number"
//                     id="discountPercent"
//                     name="discountPercent"
//                     value={form.discountPercent}
//                     onChange={handleChange}
//                     min="0"
//                     max="100"
//                     placeholder="0"
//                     className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="stripePriceId" className="block text-sm font-medium text-gray-700">Stripe Price ID (Optional)</label>
//                   <input
//                     type="text"
//                     id="stripePriceId"
//                     name="stripePriceId"
//                     value={form.stripePriceId}
//                     onChange={handleChange}
//                     placeholder="price_123xyz..."
//                     className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 font-mono text-xs focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <p className="mt-1 text-xs text-gray-500">If manually setting a Stripe Price ID, otherwise leave blank to sync later.</p>
//                 </div>
//               </form>
//             </div>
//             <div className="pt-4 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => (planToEdit ? handleUpdatePlan() : handleSubmit())}
//                 className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center"
//                 disabled={isLoading}
//               >
//                 {isLoading ? <Loader2 className="w-5 h-5 mr-2" /> : null}
//                 {isLoading ? (planToEdit ? 'Updating...' : 'Creating...') : (planToEdit ? 'Update Plan' : 'Create Plan')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// }

// export default AdminPlanManager;













import React, { useEffect, useState } from 'react';
import { X, Loader2, Plus, Edit, Trash2, RefreshCw, Check, Settings } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function AdminPlanManager() {
  const [applications, setApplications] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [form, setForm] = useState({
    id: '',
    applicationIds: [],
    planTypeMappingId: '',
    monthlyBasePrice: '',
    discountPercent: '',
    stripePriceId: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [planToSync, setPlanToSync] = useState(null);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;


  const convertDTOToPlan = (dto) => {
    const planType = planTypes.find(pt => pt.id === (dto.planTypeMappingId || (dto.plan && dto.plan.id)));
    const applicationIds = Array.isArray(dto.applicationIds)
      ? dto.applicationIds
      : dto.applications
      ? dto.applications.map(app => app.id)
      : [];
    return {
      id: dto.id || null,
      plan: planType || { id: dto.planTypeMappingId || (dto.plan && dto.plan.id) || 0, planName: 'Unknown', interval: 'Unknown' },
      applications: applicationIds.map(id => applications.find(app => app.id === id) || { id, name: 'Unknown' }),
      planTypeMappingId: dto.planTypeMappingId || (dto.plan && dto.plan.id) || '',
      monthlyBasePrice: dto.monthlyBasePrice || null,
      discountPercent: dto.discountPercent || 0,
      stripePriceId: dto.stripePriceId || '',
      calculatedPrice: dto.calculatedPrice || 0,
      discountedPrice: dto.discountedPrice || 0,
      deleted: dto.deleted || false,
    };
  };

  useEffect(() => {
    fetchApplications();
    fetchPlanTypes();
  }, []);

  useEffect(() => {
    if (selectedApps.length > 0) {
      fetchPlans(selectedApps);
    } else {
      setPlans([]);
    }
  }, [selectedApps]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/applications`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error('Fetch Applications Error:', error);
      toast.error('Failed to fetch applications: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlanTypes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/plan-types`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setPlanTypes(data);
    } catch (error) {
      console.error('Fetch Plan Types Error:', error);
      toast.error('Failed to fetch plan types: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlans = async (appNames) => {
    setIsLoading(true);
    try {
      const query = appNames.map(name => `appNames=${encodeURIComponent(name)}`).join('&');
      const res = await fetch(`${API_BASE}/api/admin/plansByApp?${query}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      const filteredPlans = data
        .map(convertDTOToPlan)
        .filter(plan => !plan.deleted && plan.applications.length === appNames.length &&
          plan.applications.every(app => appNames.includes(app.name)))
        .sort((a, b) => {
          const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
          const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
          const nameA = planTypeA ? planTypeA.planName : '';
          const nameB = planTypeB ? planTypeB.planName : '';
          const intervalA = planTypeA ? planTypeA.interval : '';
          const intervalB = planTypeB ? planTypeB.interval : '';
          return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
        });
      setPlans(filteredPlans);
    } catch (error) {
      console.error('Fetch Plans Error:', error);
      toast.error('Failed to fetch plans: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeSync = async (planId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/sync-stripe-price/${planId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await res.json();
      if (res.ok && responseData.status === 'success' && responseData.data) {
        const updatedPlan = convertDTOToPlan(responseData.data);
        if (!updatedPlan.id || !updatedPlan.stripePriceId) {
          throw new Error('Invalid or incomplete plan data received');
        }
        toast.success('Stripe sync successful');
        setPlans(prev => prev
          .map(p => (p.id === updatedPlan.id ? updatedPlan : p))
          .sort((a, b) => {
            const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
            const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
            const nameA = planTypeA ? planTypeA.planName : '';
            const nameB = planTypeB ? planTypeB.planName : '';
            const intervalA = planTypeA ? planTypeA.interval : '';
            const intervalB = planTypeB ? planTypeB.interval : '';
            return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
          }));
      } else {
        throw new Error(responseData.error || 'Failed to sync with Stripe');
      }
    } catch (error) {
      console.error('Sync Error:', error);
      toast.error(`Error syncing with Stripe: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsSyncModalOpen(false);
      setPlanToSync(null);
    }
  };

  const handleDeletePlan = async (planId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/deletePlans/${planId}`, {
        method: 'DELETE',
      });
      const responseData = await res.json();
      if (res.ok) {
        toast.success(responseData.message || 'Plan deleted successfully');
        setPlans(prev => prev.filter(p => p.id !== planId));
      } else {
        throw new Error(responseData.error || `HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error('Delete Plan Error:', error);
      toast.error(`Error deleting plan: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleUpdatePlan = async () => {
    if (!form.applicationIds.length || !form.planTypeMappingId) {
      toast.error('Applications and plan type are required');
      return;
    }
    if (selectedApps.length === 1 && isMonthlyPlan() && (!form.monthlyBasePrice || parseFloat(form.monthlyBasePrice) < 0)) {
      toast.error('Valid monthly base price is required for single-app monthly plans');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/updatePlans/${planToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) || null : null,
          discountPercent: parseFloat(form.discountPercent) || 0,
        }),
      });
      const responseData = await res.json();
      if (res.ok && responseData.plan) {
        toast.success(responseData.message || 'Plan updated successfully');
        const updatedPlan = convertDTOToPlan(responseData.plan);
        setPlans(prev => prev
          .map(p => (p.id === planToEdit.id ? updatedPlan : p))
          .sort((a, b) => {
            const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
            const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
            const nameA = planTypeA ? planTypeA.planName : '';
            const nameB = planTypeB ? planTypeB.planName : '';
            const intervalA = planTypeA ? planTypeA.interval : '';
            const intervalB = planTypeB ? planTypeB.interval : '';
            return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
          }));
        closeModal();
      } else {
        throw new Error(responseData.error || `HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error('Update Plan Error:', error);
      toast.error(`Error updating plan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (planId) => {
    setPlanToDelete(planId);
    setIsDeleteModalOpen(true);
  };

  const openSyncModal = (planId) => {
    setPlanToSync(planId);
    setIsSyncModalOpen(true);
  };

  const openEditModal = (plan) => {
    setPlanToEdit(plan);
    setForm({
      id: plan.id,
      applicationIds: plan.applications.map(app => app.id),
      planTypeMappingId: plan.plan ? plan.plan.id : plan.planTypeMappingId || '',
      monthlyBasePrice: plan.monthlyBasePrice || '',
      discountPercent: plan.discountPercent !== undefined ? String(plan.discountPercent) : '0',
      stripePriceId: plan.stripePriceId || '',
    });
    setSelectedApps(plan.applications.map(app => app.name));
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsSyncModalOpen(false);
    setIsEditModalOpen(false);
    setPlanToDelete(null);
    setPlanToSync(null);
    setPlanToEdit(null);
    setForm({
      id: '',
      applicationIds: [],
      planTypeMappingId: '',
      monthlyBasePrice: '',
      discountPercent: '',
      stripePriceId: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'monthlyBasePrice' && value !== '' && parseFloat(value) < 0) {
      toast.error('Monthly base price cannot be negative');
      return;
    }
    if (name === 'discountPercent' && value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
      toast.error('Discount percentage must be between 0 and 100');
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAppChange = (appName) => {
    const updatedApps = selectedApps.includes(appName)
      ? selectedApps.filter(name => name !== appName)
      : [...selectedApps, appName];
    setSelectedApps(updatedApps);
    setForm(prev => ({
      ...prev,
      applicationIds: updatedApps.map(name => applications.find(app => app.name === name)?.id).filter(id => id),
    }));
  };

  const isMonthlyPlan = () => {
    if (!form.planTypeMappingId) return false;
    const selectedPlan = planTypes.find(pt => pt.id === Number(form.planTypeMappingId));
    return selectedPlan && selectedPlan.interval.toLowerCase() === 'monthly';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.applicationIds.length || !form.planTypeMappingId) {
      toast.error('Applications and plan type are required');
      return;
    }
    if (selectedApps.length === 1 && isMonthlyPlan() && (!form.monthlyBasePrice || parseFloat(form.monthlyBasePrice) < 0)) {
      toast.error('Valid monthly base price is required for single-app monthly plans');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) || null : null,
          discountPercent: parseFloat(form.discountPercent) || 0,
        }),
      });
      const responseData = await res.json();
      if (res.ok) {
        if (responseData.message === 'Plan already exists') {
          toast.error(`Plan already exists for applications: ${responseData.data.applications.map(app => app.name).join(', ')} and plan type: ${formatPlanType(responseData.data.plan)}`);
          return;
        }
        const newPlan = convertDTOToPlan(responseData.data || responseData);
        toast.success('Plan created successfully');
        setPlans(prev => [...prev, newPlan].sort((a, b) => {
          const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
          const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
          const nameA = planTypeA ? planTypeA.planName : '';
          const nameB = planTypeB ? planTypeB.planName : '';
          const intervalA = planTypeA ? planTypeA.interval : '';
          const intervalB = planTypeB ? planTypeB.interval : '';
          return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
        }));
        closeModal();
        if (selectedApps.length) {
          fetchPlans(selectedApps);
        }
      } else {
        throw new Error(responseData.error || `HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error('Create Plan Error:', error);
      toast.error(`Error creating plan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPlanType = (planType) => {
    return planType && planType.planName && planType.interval
      ? `${planType.planName} (${planType.interval})`
      : planType && planType.planName
      ? planType.planName
      : `Plan ${planType ? planType.id : 'Unknown'}`;
  };

  return (
    <>
      <ToastContainer position="bottom-right" theme="light" autoClose={3000} />

      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-10 pb-32">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900">Plan Manager</h1>
            <p className="text-xl text-gray-600 mt-3">Create, edit, and sync pricing plans</p>
          </motion.div>

          {/* Application Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded shadow-xl border border-gray-200 p-5 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Applications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {applications
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(app => (
                  <label
                    key={app.id}
                    className={`flex items-center gap-4 p-2 rounded border-2 cursor-pointer transition-all
                      ${selectedApps.includes(app.name)
                        ? 'border-violet-500 bg-violet-50 shadow-md'
                        : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedApps.includes(app.name)}
                      onChange={() => handleAppChange(app.name)}
                      className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                    />
                    <span className={`font-medium ${selectedApps.includes(app.name) ? 'text-violet-700' : 'text-gray-700'}`}>
                      {app.name}
                    </span>
                  </label>
                ))}
            </div>

            {selectedApps.length > 0 && (
              <div className="mt-6 p-2 bg-violet-50 rounded border border-violet-200">
                <p className="text-violet-800 font-medium">
                  Selected: <span className="font-bold">{selectedApps.join(' + ')}</span>
                </p>
              </div>
            )}
          </motion.div>

          {/* Plans Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Pricing Plans ({plans.length})</h2>
                  <p className="text-violet-100 mt-1">Click card to edit • Sync to push to Stripe</p>
                </div>
                {selectedApps.length > 0 && (
                  <button
                    onClick={() => {
                      setForm({
                        id: '',
                        applicationIds: selectedApps.map(n => applications.find(a => a.name === n)?.id).filter(Boolean),
                        planTypeMappingId: '',
                        monthlyBasePrice: '',
                        discountPercent: '0',
                        stripePriceId: '',
                      });
                      setPlanToEdit(null);
                      setIsEditModalOpen(true);
                    }}
                    className="px-7 py-2 bg-white text-violet-700 font-bold rounded shadow-xl hover:shadow-2xl transition flex items-center gap-3"
                  >
                    <Plus className="w-6 h-6" /> New Plan
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              {isLoading ? (
                <div className="text-center py-20">
                  <Loader2 className="w-8 h-8 text-violet-600 mx-auto animate-spin mb-4" />
                  <p className="text-gray-600 text-lg">Loading plans...</p>
                </div>
              ) : selectedApps.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="bg-gray-100 border-2 border-dashed rounded w-12 h-12 mx-auto mb-6" />
                  <p className="text-xl">Select applications above to view plans</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl">No plans found for this combination</p>
                  <button onClick={() => setIsEditModalOpen(true)} className="mt-4 text-violet-600 font-bold hover:underline">
                    Create the first one
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {plans.map(plan => (
                      <motion.div
                        key={plan.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group bg-gradient-to-br from-violet-50 to-purple-50 rounded p-4 border-2 border-violet-200 hover:border-violet-400 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{formatPlanType(plan.plan)}</h3>
                            <p className="text-sm text-gray-600 mt-1">{plan.applications.map(a => a.name).join(' + ')}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => openEditModal(plan)} className="p-2.5 bg-white rounded shadow hover:shadow-md">
                              <Edit className="w-5 h-5 text-gray-600" />
                            </button>
                            <button onClick={() => openDeleteModal(plan.id)} className="p-2.5 bg-red-100 rounded hover:bg-red-200">
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base Price</span>
                            <span className="font-mono font-bold">
                              {plan.monthlyBasePrice !== null ? `$${plan.monthlyBasePrice.toFixed(2)}` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-bold text-violet-700">{plan.discountPercent}%</span>
                          </div>
                          <div className="flex justify-between text-xl font-bold">
                            <span>Final Price</span>
                            <span className="text-green-600">${plan.discountedPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-5 border-t border-violet-200 flex items-center justify-between">
                          {plan.stripePriceId ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <Check className="w-5 h-5" />
                              <span className="text-sm font-medium">Synced</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => openSyncModal(plan.id)}
                              className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-2"
                            >
                              <RefreshCw className="w-5 h-5" /> Sync
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-8 right-8 z-50">
          <AnimatePresence>
            {isFabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-20 right-0 mb-4 space-y-3 text-right"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { navigate('/admin/add-application'); setIsFabOpen(false); }}
                  className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" /> Add Application
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { navigate('/admin/plan-type'); setIsFabOpen(false); }}
                  className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
                >
                  <Settings className="w-5 h-5" /> Add Plan Type
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { navigate('/admin/trial-days-settings'); setIsFabOpen(false); }}
                  className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
                >
                  <Settings className="w-5 h-5" /> Trail Days Setting
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-14 h-14 bg-violet-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isFabOpen ? (
                <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
                  <X className="w-8 h-8" />
                </motion.div>
              ) : (
                <motion.div key="plus" initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
                  <Plus className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Modals (Delete, Sync, Edit/Create) */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Plan?</h3>
                <p className="text-gray-600 mb-8">This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Cancel</button>
                  <button onClick={() => handleDeletePlan(planToDelete)} disabled={isLoading} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:opacity-70 flex items-center gap-2">
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isSyncModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sync with Stripe?</h3>
                <p className="text-gray-600 mb-8">This will create/update the price in Stripe.</p>
                <div className="flex justify-end gap-4">
                  <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Cancel</button>
                  <button onClick={() => handleStripeSync(planToSync)} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-70 flex items-center gap-2">
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Sync
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isEditModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{planToEdit ? `Edit Plan #${planToEdit.id}` : 'Create New Plan'}</h3>
                    <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded transition"><X className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="p-3 bg-violet-50 rounded border border-violet-200">
                    <p className="font-medium text-violet-800">Applications: <span className="font-bold">{selectedApps.join(' + ')}</span></p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Plan Type</label>
                    <select name="planTypeMappingId" value={form.planTypeMappingId} onChange={handleChange} required className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none">
                      <option value="">Select plan type</option>
                      {planTypes.map(pt => (
                        <option key={pt.id} value={pt.id}>{formatPlanType(pt)}</option>
                      ))}
                    </select>
                  </div>
                  {selectedApps.length === 1 && isMonthlyPlan() && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Base Price ($)</label>
                      <input type="number" name="monthlyBasePrice" value={form.monthlyBasePrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
                    <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleChange} min="0" max="100" className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Stripe Price ID (optional)</label>
                    <input type="text" name="stripePriceId" value={form.stripePriceId} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded font-mono text-sm focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 p-6 bg-gray-50 rounded-b-3xl">
                  <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition">Cancel</button>
                  <button
                    onClick={() => planToEdit ? handleUpdatePlan() : handleSubmit()}
                    disabled={isLoading}
                    className="px-8 py-2 bg-violet-600 text-white font-bold rounded hover:bg-violet-700 disabled:opacity-70 flex items-center gap-3 shadow-lg transition"
                  >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {planToEdit ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default AdminPlanManager;