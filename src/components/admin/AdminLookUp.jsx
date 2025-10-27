// import React, { useEffect, useState } from 'react';
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
//   const [itemsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   // Convert SubscriptionPlanDTO or SubscriptionPlan to SubscriptionPlan-like object
//   const convertDTOToPlan = (dto) => {
//     console.log('Converting DTO:', dto);
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
//       setCurrentPage(1);
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
//       console.log('Fetched Plans:', data);
//       const filteredPlans = data
//         .map(convertDTOToPlan)
//         .filter(plan => !plan.deleted && plan.applications.length === appNames.length &&
//           plan.applications.every(app => appNames.includes(app.name)));
//       setPlans(filteredPlans);
//       setCurrentPage(1);
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
//       console.log('Stripe Sync Response:', responseData);
//       if (res.ok && responseData.status === 'success' && responseData.data) {
//         const updatedPlan = convertDTOToPlan(responseData.data);
//         if (!updatedPlan.id || !updatedPlan.stripePriceId) {
//           throw new Error('Invalid or incomplete plan data received');
//         }
//         toast.success('Stripe sync successful');
//         setPlans(prev => prev.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
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
//         setCurrentPage(1);
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
//       console.log('Update Plan Response:', responseData);
//       if (res.ok && responseData.plan) {
//         toast.success(responseData.message || 'Plan updated successfully');
//         const updatedPlan = convertDTOToPlan(responseData.plan);
//         setPlans(prev => prev.map(p => (p.id === planToEdit.id ? updatedPlan : p)));
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
//     setSelectedApps([]);
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
//     setForm({ ...form, [name]: value });
//   };

//   const handleAppChange = (appName) => {
//     const updatedApps = selectedApps.includes(appName)
//       ? selectedApps.filter(name => name !== appName)
//       : [...selectedApps, appName];
//     setSelectedApps(updatedApps);
//     setForm({
//       ...form,
//       applicationIds: updatedApps.map(name => applications.find(app => app.name === name)?.id).filter(id => id),
//     });
//   };

//   const isMonthlyPlan = () => {
//     const selectedPlan = planTypes.find(pt => pt.id === parseInt(form.planTypeMappingId));
//     return selectedPlan && selectedPlan.interval.toLowerCase() === 'month';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
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
//       console.log('Create Plan Response:', responseData);
//       if (res.ok) {
//         if (responseData.message === 'Plan already exists') {
//           toast.error(`Plan already exists for applications: ${responseData.data.applications.map(app => app.name).join(', ')} and plan type: ${formatPlanType(responseData.data.plan)}`);
//           return;
//         }
//         const newPlan = convertDTOToPlan(responseData.data || responseData);
//         toast.success('Plan created successfully');
//         setPlans([...plans, newPlan]);
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

//   const indexOfLastPlan = currentPage * itemsPerPage;
//   const indexOfFirstPlan = indexOfLastPlan - itemsPerPage;
//   const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
//   const totalPages = Math.ceil(plans.length / itemsPerPage);

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <ErrorBoundary>
//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="flex items-center space-x-2">
//             <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             <span className="text-xl font-semibold text-gray-600">Loading...</span>
//           </div>
//         </div>
//       )}
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
//             <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl">
//                 <nav className="bg-blue-600 text-white p-4 mb-6 w-full rounded-t-xl">
//                     <h2 className="text-2xl font-bold text-center">Manage Subscription Plans</h2>
//                 </nav>
//                 <div className="p-6">
//                     <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Applications</label>
//                         <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                         {applications
//                             .sort((a, b) => a.name.localeCompare(b.name))
//                             .map(app => (
//                             <div key={app.id} className="flex items-center mb-2">
//                                 <input
//                                 type="checkbox"
//                                 id={`app-${app.id}`}
//                                 value={app.name}
//                                 checked={selectedApps.includes(app.name)}
//                                 onChange={() => handleAppChange(app.name)}
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                 />
//                                 <label htmlFor={`app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                             </div>
//                             ))}
//                         </div>
//                         {selectedApps.length === 0 && (
//                         <p className="text-red-500 text-sm mt-2">At least one application is required.</p>
//                         )}
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
//                         <select
//                         name="planTypeMappingId"
//                         value={form.planTypeMappingId}
//                         onChange={handleChange}
//                         className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//                         required
//                         >
//                         <option value="">Select Plan Type</option>
//                         {planTypes
//                             .sort((a, b) => formatPlanType(a).localeCompare(formatPlanType(b)))
//                             .map(planType => (
//                             <option key={planType.id} value={planType.id}>
//                                 {formatPlanType(planType)}
//                             </option>
//                             ))}
//                         </select>
//                     </div>
//                     {selectedApps.length === 1 && isMonthlyPlan() && (
//                         <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Base Price (USD)</label>
//                         <input
//                             type="number"
//                             name="monthlyBasePrice"
//                             value={form.monthlyBasePrice}
//                             step="0.01"
//                             placeholder="Enter monthly base price"
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//                             required
//                         />
//                         </div>
//                     )}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
//                         <input
//                         type="number"
//                         name="discountPercent"
//                         value={form.discountPercent}
//                         step="0.1"
//                         placeholder="Enter discount percentage"
//                         onChange={handleChange}
//                         className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//                         />
//                     </div>
//                     <div className="md:col-span-2">
//                         <button
//                         type="submit"
//                         disabled={isLoading}
//                         className={`w-full md:w-auto px-6 py-3 text-white rounded-md ${
//                             isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                         } transition-colors`}
//                         >
//                         {isLoading ? 'Creating...' : 'Create Plan'}
//                         </button>
//                     </div>
//                     </form>

//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Subscription Plans</h3>
//                     <div className="overflow-x-auto">
//                     <table className="w-full border-collapse bg-white shadow-md rounded-lg">
//                         <thead>
//                         <tr className="bg-blue-50 text-gray-700">
//                             <th className="p-4 text-left text-sm font-medium">Applications</th>
//                             <th className="p-4 text-left text-sm font-medium">Plan Type</th>
//                             <th className="p-4 text-left text-sm font-medium">Monthly Base Price</th>
//                             <th className="p-4 text-left text-sm font-medium">Calculated Price</th>
//                             <th className="p-4 text-left text-sm font-medium">Discount</th>
//                             <th className="p-4 text-left text-sm font-medium">Final Price</th>
//                             <th className="p-4 text-left text-sm font-medium">Stripe Price ID</th>
//                             <th className="p-4 text-left text-sm font-medium">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {currentPlans
//                             .sort((a, b) => {
//                             const planTypeA = a.plan ? planTypes.find(pt => pt.id === a.plan.id) : planTypes.find(pt => pt.id === a.planTypeMappingId);
//                             const planTypeB = b.plan ? planTypes.find(pt => pt.id === b.plan.id) : planTypes.find(pt => pt.id === b.planTypeMappingId);
//                             const nameA = planTypeA ? formatPlanType(planTypeA) : '';
//                             const nameB = planTypeB ? formatPlanType(planTypeB) : '';
//                             return nameA.localeCompare(nameB);
//                             })
//                             .map((plan, index) => (
//                             <tr key={plan.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
//                                 <td className="p-4 text-sm text-gray-600">{plan.applications.map(a => a.name).join(', ')}</td>
//                                 <td className="p-4 text-sm text-gray-600">{formatPlanType(plan.plan)}</td>
//                                 <td className="p-4 text-sm text-gray-600">${(plan.monthlyBasePrice || 0).toFixed(2)}</td>
//                                 <td className="p-4 text-sm text-gray-600">${(plan.calculatedPrice || 0).toFixed(2)}</td>
//                                 <td className="p-4 text-sm text-gray-600">{plan.discountPercent ? `${plan.discountPercent}%` : '0%'}</td>
//                                 <td className="p-4 text-sm font-semibold text-gray-800">${(plan.discountedPrice || 0).toFixed(2)}</td>
//                                 <td className="p-4 text-sm text-gray-600">
//                                 {plan.syncing ? (
//                                     <span className="text-gray-500">Syncing...</span>
//                                 ) : plan.stripePriceId ? (
//                                     <span>{plan.stripePriceId}</span>
//                                 ) : (
//                                     <button
//                                     className={`px-3 py-1 text-white text-sm rounded-md ${
//                                         isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
//                                     } transition-colors`}
//                                     onClick={() => openSyncModal(plan.id)}
//                                     disabled={isLoading}
//                                     >
//                                     Sync to Stripe
//                                     </button>
//                                 )}
//                                 </td>
//                                 <td className="p-4 flex space-x-2">
//                                 <button
//                                     className={`px-3 py-1 text-white text-sm rounded-md ${
//                                     isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
//                                     } transition-colors`}
//                                     onClick={() => openEditModal(plan)}
//                                     disabled={isLoading}
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     className={`px-3 py-1 text-white text-sm rounded-md ${
//                                     isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
//                                     } transition-colors`}
//                                     onClick={() => openDeleteModal(plan.id)}
//                                     disabled={isLoading}
//                                 >
//                                     Delete
//                                 </button>
//                                 </td>
//                             </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {plans.length === 0 && (
//                         <p className="text-center text-gray-500 mt-4">No plans available for the selected applications.</p>
//                     )}
//                     </div>

//                     {plans.length > itemsPerPage && (
//                     <div className="flex justify-between items-center mt-4">
//                         <button
//                         onClick={() => paginate(currentPage - 1)}
//                         disabled={currentPage === 1 || isLoading}
//                         className={`px-4 py-2 text-sm rounded-md ${
//                             currentPage === 1 || isLoading
//                             ? 'bg-gray-300 cursor-not-allowed'
//                             : 'bg-blue-600 text-white hover:bg-blue-700'
//                         } transition-colors`}
//                         >
//                         Previous
//                         </button>
//                         <div className="flex space-x-2">
//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                             <button
//                             key={page}
//                             onClick={() => paginate(page)}
//                             className={`px-3 py-1 text-sm rounded-md ${
//                                 currentPage === page
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                             } transition-colors`}
//                             >
//                             {page}
//                             </button>
//                         ))}
//                         </div>
//                         <button
//                         onClick={() => paginate(currentPage + 1)}
//                         disabled={currentPage === totalPages || isLoading}
//                         className={`px-4 py-2 text-sm rounded-md ${
//                             currentPage === totalPages || isLoading
//                             ? 'bg-gray-300 cursor-not-allowed'
//                             : 'bg-blue-600 text-white hover:bg-blue-700'
//                         } transition-colors`}
//                         >
//                         Next
//                         </button>
//                     </div>
//                     )}

//                     {isDeleteModalOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 max-w-md w-full">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
//                         <p className="text-sm text-gray-600 mb-6">
//                             Are you sure you want to delete this plan? This action will mark the plan as deleted and may affect active subscriptions.
//                         </p>
//                         <div className="flex justify-end space-x-4">
//                             <button
//                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                             onClick={closeModal}
//                             >
//                             Cancel
//                             </button>
//                             <button
//                             className={`px-4 py-2 text-white rounded-md ${
//                                 isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
//                             } transition-colors`}
//                             onClick={() => handleDeletePlan(planToDelete)}
//                             disabled={isLoading}
//                             >
//                             {isLoading ? 'Deleting...' : 'Delete'}
//                             </button>
//                         </div>
//                         </div>
//                     </div>
//                     )}

//                     {isSyncModalOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 max-w-md w-full">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Stripe Sync</h3>
//                         <p className="text-sm text-gray-600 mb-6">
//                             Are you sure you want to sync this plan with Stripe? This will create or update the plan in Stripe.
//                         </p>
//                         <div className="flex justify-end space-x-4">
//                             <button
//                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                             onClick={closeModal}
//                             >
//                             Cancel
//                             </button>
//                             <button
//                             className={`px-4 py-2 text-white rounded-md ${
//                                 isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
//                             } transition-colors`}
//                             onClick={() => handleStripeSync(planToSync)}
//                             disabled={isLoading}
//                             >
//                             {isLoading ? 'Syncing...' : 'Sync'}
//                             </button>
//                         </div>
//                         </div>
//                     </div>
//                     )}

//                     {isEditModalOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 max-w-md w-full">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Plan</h3>
//                         <form onSubmit={(e) => { e.preventDefault(); handleUpdatePlan(); }} className="grid grid-cols-1 gap-4">
//                             <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Applications</label>
//                             <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
//                                 {applications.map(app => (
//                                 <div key={app.id} className="flex items-center mb-2">
//                                     <input
//                                     type="checkbox"
//                                     id={`edit-app-${app.id}`}
//                                     value={app.name}
//                                     checked={selectedApps.includes(app.name)}
//                                     onChange={() => handleAppChange(app.name)}
//                                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                     />
//                                     <label htmlFor={`edit-app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
//                                 </div>
//                                 ))}
//                             </div>
//                             {selectedApps.length === 0 && (
//                                 <p className="text-red-500 text-sm mt-2">At least one application is required.</p>
//                             )}
//                             </div>
//                             <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
//                             <select
//                                 name="planTypeMappingId"
//                                 value={form.planTypeMappingId}
//                                 onChange={handleChange}
//                                 className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//                                 required
//                             >
//                                 <option value="">Select Plan Type</option>
//                                 {planTypes.map(planType => (
//                                 <option key={planType.id} value={planType.id}>
//                                     {formatPlanType(planType)}
//                                 </option>
//                                 ))}
//                             </select>
//                             </div>
//                             {selectedApps.length === 1 && isMonthlyPlan() && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Base Price (USD)</label>
//                                 <input
//                                 type="number"
//                                 name="monthlyBasePrice"
//                                 value={form.monthlyBasePrice}
//                                 step="0.01"
//                                 placeholder="Enter monthly base price"
//                                 onChange={handleChange}
//                                 className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//                                 required
//                                 />
//                             </div>
//                             )}
//                             <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
//                             <input
//                                 type="number"
//                                 name="discountPercent"
//                                 value={form.discountPercent}
//                                 step="0.1"
//                                 placeholder="Enter discount percentage"
//                                 onChange={handleChange}
//                                 className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//                             />
//                             </div>
//                             <div className="flex justify-end space-x-4">
//                             <button
//                                 type="button"
//                                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                                 onClick={closeModal}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className={`px-4 py-2 text-white rounded-md ${
//                                 isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                                 } transition-colors`}
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Updating...' : 'Update Plan'}
//                             </button>
//                             </div>
//                         </form>
//                         </div>
//                     </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </ErrorBoundary>
//   );
// }

// export default AdminPlanManager;












import React, { useEffect, useState } from 'react';
import { X, Loader2, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600">Something went wrong.</h3>
          <p className="text-gray-600">Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const navigate = useNavigate();

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
      const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/applications');
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
      const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/plan-types');
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
      const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/plansByApp?${query}`);
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
      const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/sync-stripe-price/${planId}`, {
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
      const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/deletePlans/${planId}`, {
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
      const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/updatePlans/${planToEdit.id}`, {
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
      const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/create', {
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl font-semibold text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8 border-b pb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-extrabold text-gray-900">Subscription Plan Manager</h1>
          </div>
          <p className="text-gray-500 mt-1">Configure pricing plans for applications and multi-app bundles.</p>
        </header>
        <div className="mb-8 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/admin/add-application')}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Application
            </button>
            <button
              onClick={() => navigate('/admin/plan-type')}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Plan Type
            </button>
          </div>
        </div>
        {/* Application Selection (Filter) */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Applications to Manage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {applications
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(app => (
                <label key={app.id} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors select-none">
                  <input
                    type="checkbox"
                    id={`app-${app.id}`}
                    value={app.name}
                    checked={selectedApps.includes(app.name)}
                    onChange={() => handleAppChange(app.name)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className={`text-sm font-medium ${selectedApps.includes(app.name) ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
                    {app.name}
                  </span>
                </label>
              ))}
          </div>
          {selectedApps.length > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              Viewing plans for: <span className="font-medium text-indigo-600">{selectedApps.join(', ')}</span>
            </p>
          )}
          {selectedApps.length === 0 && (
            <p className="mt-4 text-sm text-red-500">At least one application is required to view or create plans.</p>
          )}
        </div>

        {/* Plan Management Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Current Plans ({plans.length})</h2>
            {selectedApps.length > 0 && (
              <button
                onClick={() => {
                  setForm({
                    id: '',
                    applicationIds: selectedApps.map(name => applications.find(app => app.name === name)?.id).filter(id => id),
                    planTypeMappingId: '',
                    monthlyBasePrice: '',
                    discountPercent: '0',
                    stripePriceId: '',
                  });
                  setPlanToEdit(null);
                  setIsEditModalOpen(true);
                }}
                disabled={selectedApps.length === 0}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center active:scale-95"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Plan
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 text-indigo-600" />
              <span className="ml-3 text-lg text-gray-600">Loading Plans...</span>
            </div>
          ) : selectedApps.length === 0 ? (
            <p className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
              Please select one or more applications above to view or create plans.
            </p>
          ) : plans.length === 0 ? (
            <p className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
              No plans found for the selected combination of applications. Click "Add New Plan" to create one.
            </p>
          ) : (
            <div className="overflow-y-auto max-h-[500px] rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe ID</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{plan.applications.map(a => a.name).join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-semibold text-indigo-600">{formatPlanType(plan.plan)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {plan.monthlyBasePrice !== null ? `$${plan.monthlyBasePrice.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.discountPercent}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        ${plan.discountedPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 truncate max-w-[150px] font-mono">
                        {plan.stripePriceId ? (
                          <span>{plan.stripePriceId}</span>
                        ) : (
                          <button
                            className="p-2 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-yellow-50 transition-colors active:scale-95"
                            onClick={() => openSyncModal(plan.id)}
                            disabled={isLoading}
                            title="Sync with Stripe"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50 transition-colors active:scale-95"
                          onClick={() => openEditModal(plan)}
                          disabled={isLoading}
                          title="Edit Plan"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors active:scale-95"
                          onClick={() => openDeleteModal(plan.id)}
                          disabled={isLoading}
                          title="Delete Plan"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <div
          className={`fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isDeleteModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-modal="true"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-extrabold text-gray-800">Confirm Deletion</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-6">
              <p className="text-gray-700">
                Are you sure you want to delete Plan ID <span className="font-mono font-semibold">{planToDelete}</span>? This action will mark the plan as deleted and may affect active subscriptions.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlan(planToDelete)}
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 mr-2" /> : null}
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Stripe Sync Modal */}
        <div
          className={`fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isSyncModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-modal="true"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-extrabold text-gray-800">Confirm Stripe Sync</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-6">
              <p className="text-gray-700">
                Are you sure you want to sync Plan ID <span className="font-mono font-semibold">{planToSync}</span> with Stripe? This will create or update the plan in Stripe.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStripeSync(planToSync)}
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 mr-2" /> : null}
                {isLoading ? 'Syncing...' : 'Sync'}
              </button>
            </div>
          </div>
        </div>

        {/* Create/Edit Plan Modal */}
        <div
          className={`fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isEditModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-modal="true"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-extrabold text-gray-800">{planToEdit ? `Edit Plan ID: ${planToEdit.id}` : 'Create New Plan'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); planToEdit ? handleUpdatePlan() : handleSubmit(e); }}>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <label className="block text-sm font-medium text-indigo-700">Selected Applications</label>
                  <p className="text-sm text-indigo-800 mt-1 font-semibold">
                    {selectedApps.length > 0 ? selectedApps.join(', ') : 'No applications selected.'}
                  </p>
                  <input type="hidden" name="applicationIds" value={form.applicationIds.join(',')} />
                  {selectedApps.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">At least one application must be selected.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="planTypeMappingId" className="block text-sm font-medium text-gray-700">Plan Type *</label>
                  <select
                    id="planTypeMappingId"
                    name="planTypeMappingId"
                    value={form.planTypeMappingId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
                    disabled={planTypes.length === 0}
                  >
                    <option value="" disabled>Select a Plan Type</option>
                    {planTypes
                      .sort((a, b) => {
                        const nameA = a.planName || '';
                        const nameB = b.planName || '';
                        const intervalA = a.interval || '';
                        const intervalB = b.interval || '';
                        return nameA.localeCompare(nameB) || intervalA.localeCompare(intervalB);
                      })
                      .map(planType => (
                        <option key={planType.id} value={planType.id}>
                          {formatPlanType(planType)}
                        </option>
                      ))}
                  </select>
                </div>
                {selectedApps.length === 1 && isMonthlyPlan() && (
                  <div>
                    <label htmlFor="monthlyBasePrice" className="block text-sm font-medium text-gray-700">Monthly Base Price ($) *</label>
                    <input
                      type="number"
                      id="monthlyBasePrice"
                      name="monthlyBasePrice"
                      value={form.monthlyBasePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="e.g., 49.99"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Required for single-app monthly plans (e.g., Basic Monthly, Pro Monthly, Enterprise Monthly).</p>
                  </div>
                )}
                <div>
                  <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700">Discount Percent (%)</label>
                  <input
                    type="number"
                    id="discountPercent"
                    name="discountPercent"
                    value={form.discountPercent}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="0"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="stripePriceId" className="block text-sm font-medium text-gray-700">Stripe Price ID (Optional)</label>
                  <input
                    type="text"
                    id="stripePriceId"
                    name="stripePriceId"
                    value={form.stripePriceId}
                    onChange={handleChange}
                    placeholder="price_123xyz..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 font-mono text-xs focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">If manually setting a Stripe Price ID, otherwise leave blank to sync later.</p>
                </div>
              </form>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => (planToEdit ? handleUpdatePlan() : handleSubmit())}
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 mr-2" /> : null}
                {isLoading ? (planToEdit ? 'Updating...' : 'Creating...') : (planToEdit ? 'Update Plan' : 'Create Plan')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AdminPlanManager;