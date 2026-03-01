// import React, { useEffect, useState } from 'react';
// import { X, Loader2, Plus, Edit, Trash2, RefreshCw, Check, Settings } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

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
//   const [isFabOpen, setIsFabOpen] = useState(false);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_API_BASE_URL;


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
//       const res = await fetch(`${API_BASE}/api/admin/applications`);
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
//       const res = await fetch(`${API_BASE}/api/admin/plan-types`);
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
//       const res = await fetch(`${API_BASE}/api/admin/plansByApp?${query}`);
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
//       const res = await fetch(`${API_BASE}/api/admin/sync-stripe-price/${planId}`, {
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
//       const res = await fetch(`${API_BASE}/api/admin/deletePlans/${planId}`, {
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
//       const res = await fetch(`${API_BASE}/api/admin/updatePlans/${planToEdit.id}`, {
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
//       const res = await fetch(`${API_BASE}/api/admin/create`, {
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
//     <>
//       <ToastContainer position="bottom-right" theme="light" autoClose={3000} />

//       <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 relative">
//         <div className="max-w-7xl mx-auto px-6 py-10 pb-32">

//           {/* Header */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//             <h1 className="text-5xl font-bold text-gray-900">Plan Manager</h1>
//             <p className="text-xl text-gray-600 mt-3">Create, edit, and sync pricing plans</p>
//           </motion.div>

//           {/* Application Selector */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white rounded shadow-xl border border-gray-200 p-5 mb-8"
//           >
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Applications</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//               {applications
//                 .sort((a, b) => a.name.localeCompare(b.name))
//                 .map(app => (
//                   <label
//                     key={app.id}
//                     className={`flex items-center gap-4 p-2 rounded border-2 cursor-pointer transition-all
//                       ${selectedApps.includes(app.name)
//                         ? 'border-violet-500 bg-violet-50 shadow-md'
//                         : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
//                       }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedApps.includes(app.name)}
//                       onChange={() => handleAppChange(app.name)}
//                       className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
//                     />
//                     <span className={`font-medium ${selectedApps.includes(app.name) ? 'text-violet-700' : 'text-gray-700'}`}>
//                       {app.name}
//                     </span>
//                   </label>
//                 ))}
//             </div>

//             {selectedApps.length > 0 && (
//               <div className="mt-6 p-2 bg-violet-50 rounded border border-violet-200">
//                 <p className="text-violet-800 font-medium">
//                   Selected: <span className="font-bold">{selectedApps.join(' + ')}</span>
//                 </p>
//               </div>
//             )}
//           </motion.div>

//           {/* Plans Grid */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white rounded shadow-2xl border border-gray-200 overflow-hidden"
//           >
//             <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-3xl font-bold">Pricing Plans ({plans.length})</h2>
//                   <p className="text-violet-100 mt-1">Click card to edit • Sync to push to Stripe</p>
//                 </div>
//                 {selectedApps.length > 0 && (
//                   <button
//                     onClick={() => {
//                       setForm({
//                         id: '',
//                         applicationIds: selectedApps.map(n => applications.find(a => a.name === n)?.id).filter(Boolean),
//                         planTypeMappingId: '',
//                         monthlyBasePrice: '',
//                         discountPercent: '0',
//                         stripePriceId: '',
//                       });
//                       setPlanToEdit(null);
//                       setIsEditModalOpen(true);
//                     }}
//                     className="px-7 py-2 bg-white text-violet-700 font-bold rounded shadow-xl hover:shadow-2xl transition flex items-center gap-3"
//                   >
//                     <Plus className="w-6 h-6" /> New Plan
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-8">
//               {isLoading ? (
//                 <div className="text-center py-20">
//                   <Loader2 className="w-8 h-8 text-violet-600 mx-auto animate-spin mb-4" />
//                   <p className="text-gray-600 text-lg">Loading plans...</p>
//                 </div>
//               ) : selectedApps.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500">
//                   <div className="bg-gray-100 border-2 border-dashed rounded w-12 h-12 mx-auto mb-6" />
//                   <p className="text-xl">Select applications above to view plans</p>
//                 </div>
//               ) : plans.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500">
//                   <p className="text-xl">No plans found for this combination</p>
//                   <button onClick={() => setIsEditModalOpen(true)} className="mt-4 text-violet-600 font-bold hover:underline">
//                     Create the first one
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   <AnimatePresence>
//                     {plans.map(plan => (
//                       <motion.div
//                         key={plan.id}
//                         layout
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         className="group bg-gradient-to-br from-violet-50 to-purple-50 rounded p-4 border-2 border-violet-200 hover:border-violet-400 hover:shadow-2xl transition-all duration-300"
//                       >
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-xl font-bold text-gray-900">{formatPlanType(plan.plan)}</h3>
//                             <p className="text-sm text-gray-600 mt-1">{plan.applications.map(a => a.name).join(' + ')}</p>
//                           </div>
//                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
//                             <button onClick={() => openEditModal(plan)} className="p-2.5 bg-white rounded shadow hover:shadow-md">
//                               <Edit className="w-5 h-5 text-gray-600" />
//                             </button>
//                             <button onClick={() => openDeleteModal(plan.id)} className="p-2.5 bg-red-100 rounded hover:bg-red-200">
//                               <Trash2 className="w-5 h-5 text-red-600" />
//                             </button>
//                           </div>
//                         </div>

//                         <div className="space-y-3">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Base Price</span>
//                             <span className="font-mono font-bold">
//                               {plan.monthlyBasePrice !== null ? `$${plan.monthlyBasePrice.toFixed(2)}` : '—'}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Discount</span>
//                             <span className="font-bold text-violet-700">{plan.discountPercent}%</span>
//                           </div>
//                           <div className="flex justify-between text-xl font-bold">
//                             <span>Final Price</span>
//                             <span className="text-green-600">${plan.discountedPrice.toFixed(2)}</span>
//                           </div>
//                         </div>

//                         <div className="mt-5 pt-5 border-t border-violet-200 flex items-center justify-between">
//                           {plan.stripePriceId ? (
//                             <div className="flex items-center gap-2 text-green-600">
//                               <Check className="w-5 h-5" />
//                               <span className="text-sm font-medium">Synced</span>
//                             </div>
//                           ) : (
//                             <button
//                               onClick={() => openSyncModal(plan.id)}
//                               className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-2"
//                             >
//                               <RefreshCw className="w-5 h-5" /> Sync
//                             </button>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Floating Action Button (FAB) */}
//         <div className="fixed bottom-8 right-8 z-50">
//           <AnimatePresence>
//             {isFabOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="absolute bottom-20 right-0 mb-4 space-y-3 text-right"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/add-application'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Plus className="w-5 h-5" /> Add Application
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/plan-type'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Settings className="w-5 h-5" /> Add Plan Type
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/trial-days-settings'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Settings className="w-5 h-5" /> Trail Days Setting
//                 </motion.button>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsFabOpen(!isFabOpen)}
//             className="w-14 h-14 bg-violet-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition flex items-center justify-center"
//           >
//             <AnimatePresence mode="wait">
//               {isFabOpen ? (
//                 <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
//                   <X className="w-8 h-8" />
//                 </motion.div>
//               ) : (
//                 <motion.div key="plus" initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
//                   <Plus className="w-8 h-8" />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.button>
//         </div>

//         {/* Modals (Delete, Sync, Edit/Create) */}
//         <AnimatePresence>
//           {isDeleteModalOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
//               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Plan?</h3>
//                 <p className="text-gray-600 mb-8">This action cannot be undone.</p>
//                 <div className="flex justify-end gap-4">
//                   <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Cancel</button>
//                   <button onClick={() => handleDeletePlan(planToDelete)} disabled={isLoading} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:opacity-70 flex items-center gap-2">
//                     {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Delete
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}

//           {isSyncModalOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
//               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Sync with Stripe?</h3>
//                 <p className="text-gray-600 mb-8">This will create/update the price in Stripe.</p>
//                 <div className="flex justify-end gap-4">
//                   <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Cancel</button>
//                   <button onClick={() => handleStripeSync(planToSync)} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-70 flex items-center gap-2">
//                     {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Sync
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}

//           {isEditModalOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
//               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
//                 <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 text-white">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-2xl font-bold">{planToEdit ? `Edit Plan #${planToEdit.id}` : 'Create New Plan'}</h3>
//                     <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded transition"><X className="w-5 h-5" /></button>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-6">
//                   <div className="p-3 bg-violet-50 rounded border border-violet-200">
//                     <p className="font-medium text-violet-800">Applications: <span className="font-bold">{selectedApps.join(' + ')}</span></p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Plan Type</label>
//                     <select name="planTypeMappingId" value={form.planTypeMappingId} onChange={handleChange} required className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none">
//                       <option value="">Select plan type</option>
//                       {planTypes.map(pt => (
//                         <option key={pt.id} value={pt.id}>{formatPlanType(pt)}</option>
//                       ))}
//                     </select>
//                   </div>
//                   {selectedApps.length === 1 && isMonthlyPlan() && (
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Base Price ($)</label>
//                       <input type="number" name="monthlyBasePrice" value={form.monthlyBasePrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
//                     </div>
//                   )}
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
//                     <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleChange} min="0" max="100" className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Stripe Price ID (optional)</label>
//                     <input type="text" name="stripePriceId" value={form.stripePriceId} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded font-mono text-sm focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-4 p-6 bg-gray-50 rounded-b-3xl">
//                   <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition">Cancel</button>
//                   <button
//                     onClick={() => planToEdit ? handleUpdatePlan() : handleSubmit()}
//                     disabled={isLoading}
//                     className="px-8 py-2 bg-violet-600 text-white font-bold rounded hover:bg-violet-700 disabled:opacity-70 flex items-center gap-3 shadow-lg transition"
//                   >
//                     {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
//                     {planToEdit ? 'Update Plan' : 'Create Plan'}
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

// export default AdminPlanManager;








// import React, { useEffect, useState } from 'react';
// import { X, Loader2, Plus, Edit, Trash2, RefreshCw, Check, Settings } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

// function AdminPlanManager() {
//   const [applications, setApplications] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [planTypes, setPlanTypes] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
//   const [selectedApps, setSelectedApps] = useState([]);
//   const [form, setForm] = useState({
//     id: '',
//     applicationIds: [],
//     planTypeMappingId: '',
//     countryCode: '',
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
//   const [isFabOpen, setIsFabOpen] = useState(false);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_API_BASE_URL;


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
//       countryCode: dto.countryCode || '',
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
//     fetchCountries();
//   }, []);

//   useEffect(() => {
//     setSelectedCountryFilter('');
//     if (selectedApps.length > 0) {
//       fetchPlans(selectedApps);
//     } else {
//       setPlans([]);
//     }
//   }, [selectedApps]);

//   const fetchCountries = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/countries`);
//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//       const data = await res.json();
//       setCountries(data);
//     } catch (error) {
//       toast.error('Failed to fetch countries: ' + error.message);
//     }
//   };

//   const fetchApplications = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/applications`);
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
//       const res = await fetch(`${API_BASE}/api/admin/plan-types`);
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
//       const res = await fetch(`${API_BASE}/api/admin/plansByApp?${query}`);
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
//       const res = await fetch(`${API_BASE}/api/admin/sync-stripe-price/${planId}`, {
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
//       const res = await fetch(`${API_BASE}/api/admin/deletePlans/${planId}`, {
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
//       const res = await fetch(`${API_BASE}/api/admin/updatePlans/${planToEdit.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...form,
//           countryCode: form.countryCode,
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
//       countryCode: plan.countryCode || '',
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
//       const res = await fetch(`${API_BASE}/api/admin/create`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...form,
//           countryCode: form.countryCode,
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

//   const filteredPlans = selectedCountryFilter
//   ? plans.filter(plan => plan.countryCode === selectedCountryFilter)
//   : plans;

//   return (
//     <>
//       <ToastContainer position="bottom-right" theme="light" autoClose={3000} />

//       <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 relative">
//         <div className="max-w-7xl mx-auto px-6 py-10 pb-32">

//           {/* Header */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//             <h1 className="text-5xl font-bold text-gray-900">Plan Manager</h1>
//             <p className="text-xl text-gray-600 mt-3">Create, edit, and sync pricing plans</p>
//           </motion.div>

//           {/* Application Selector */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white rounded shadow-xl border border-gray-200 p-5 mb-8"
//           >
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Applications</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//               {applications
//                 .sort((a, b) => a.name.localeCompare(b.name))
//                 .map(app => (
//                   <label
//                     key={app.id}
//                     className={`flex items-center gap-4 p-2 rounded border-2 cursor-pointer transition-all
//                       ${selectedApps.includes(app.name)
//                         ? 'border-violet-500 bg-violet-50 shadow-md'
//                         : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
//                       }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedApps.includes(app.name)}
//                       onChange={() => handleAppChange(app.name)}
//                       className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
//                     />
//                     <span className={`font-medium ${selectedApps.includes(app.name) ? 'text-violet-700' : 'text-gray-700'}`}>
//                       {app.name}
//                     </span>
//                   </label>
//                 ))}
//             </div>

//             {selectedApps.length > 0 && (
//               <div className="mt-6 p-2 bg-violet-50 rounded border border-violet-200">
//                 <p className="text-violet-800 font-medium">
//                   Selected: <span className="font-bold">{selectedApps.join(' + ')}</span>
//                 </p>
//               </div>
//             )}
//           </motion.div>

//           {/* NEW: Country Filter */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
//             <label className="text-gray-700 font-medium whitespace-nowrap">Filter by Country:</label>
//             <select
//               value={selectedCountryFilter}
//               onChange={(e) => setSelectedCountryFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 min-w-[220px]"
//             >
//               <option value="">All Countries</option>
//               {countries.map(c => (
//                 <option key={c.countryCode} value={c.countryCode}>
//                   {c.displayName || c.countryCode} ({c.currencySymbol} {c.currencyCode})
//                 </option>
//               ))}
//             </select>
//           </motion.div>

//           {/* Plans Grid */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white rounded shadow-2xl border border-gray-200 overflow-hidden"
//           >
//             <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-3xl font-bold">Pricing Plans ({filteredPlans.length})</h2>
//                   <p className="text-violet-100 mt-1">Click card to edit • Sync to push to Stripe</p>
//                 </div>
//                 {selectedApps.length > 0 && (
//                   <button
//                     onClick={() => {
//                       setForm({
//                         id: '',
//                         applicationIds: selectedApps.map(n => applications.find(a => a.name === n)?.id).filter(Boolean),
//                         planTypeMappingId: '',
//                         countryCode: '',
//                         monthlyBasePrice: '',
//                         discountPercent: '0',
//                         stripePriceId: '',
//                       });
//                       setPlanToEdit(null);
//                       setIsEditModalOpen(true);
//                     }}
//                     className="px-7 py-2 bg-white text-violet-700 font-bold rounded shadow-xl hover:shadow-2xl transition flex items-center gap-3"
//                   >
//                     <Plus className="w-6 h-6" /> New Plan
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-8">
//               {isLoading ? (
//                 <div className="text-center py-20">
//                   <Loader2 className="w-8 h-8 text-violet-600 mx-auto animate-spin mb-4" />
//                   <p className="text-gray-600 text-lg">Loading plans...</p>
//                 </div>
//               ) : selectedApps.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500">
//                   <div className="bg-gray-100 border-2 border-dashed rounded w-12 h-12 mx-auto mb-6" />
//                   <p className="text-xl">Select applications above to view plans</p>
//                 </div>
//               ) : filteredPlans.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500">
//                   <p className="text-xl">
//                     No plans found for{' '}
//                     {selectedCountryFilter
//                       ? countries.find(c => c.countryCode === selectedCountryFilter)?.displayName || selectedCountryFilter
//                       : 'selected applications'}
//                   </p>
//                   <button
//                     onClick={() => setIsEditModalOpen(true)}
//                     className="mt-4 text-violet-600 font-bold hover:underline"
//                   >
//                     Create a new plan
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   <AnimatePresence>
//                     {filteredPlans.map(plan => (
//                       <motion.div
//                         key={plan.id}
//                         layout
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         className="group bg-gradient-to-br from-violet-50 to-purple-50 rounded p-4 border-2 border-violet-200 hover:border-violet-400 hover:shadow-2xl transition-all duration-300"
//                       >
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-xl font-bold text-gray-900">{formatPlanType(plan.plan)}</h3>
//                             <p className="text-sm text-gray-600 mt-1">{plan.applications.map(a => a.name).join(' + ')}</p>
//                             <p className="text-xs text-indigo-600 mt-1 font-medium">
//                               {countries.find(c => c.countryCode === plan.countryCode)?.displayName || plan.countryCode || 'Unknown'}
//                               {' '}({countries.find(c => c.countryCode === plan.countryCode)?.currencySymbol || '$'})
//                             </p>
//                           </div>
//                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
//                             <button onClick={() => openEditModal(plan)} className="p-2.5 bg-white rounded shadow hover:shadow-md">
//                               <Edit className="w-5 h-5 text-gray-600" />
//                             </button>
//                             <button onClick={() => openDeleteModal(plan.id)} className="p-2.5 bg-red-100 rounded hover:bg-red-200">
//                               <Trash2 className="w-5 h-5 text-red-600" />
//                             </button>
//                           </div>
//                         </div>

//                         <div className="space-y-3">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Base Price</span>
//                             <span className="font-mono font-bold">
//                               {plan.monthlyBasePrice !== null ? `$${plan.monthlyBasePrice.toFixed(2)}` : '—'}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Discount</span>
//                             <span className="font-bold text-violet-700">{plan.discountPercent}%</span>
//                           </div>
//                           <div className="flex justify-between text-xl font-bold">
//                             <span>Final Price</span>
//                             <span className="text-green-600">${plan.discountedPrice.toFixed(2)}</span>
//                           </div>
//                         </div>

//                         <div className="mt-5 pt-5 border-t border-violet-200 flex items-center justify-between">
//                           {plan.stripePriceId ? (
//                             <div className="flex items-center gap-2 text-green-600">
//                               <Check className="w-5 h-5" />
//                               <span className="text-sm font-medium">Synced</span>
//                             </div>
//                           ) : (
//                             <button
//                               onClick={() => openSyncModal(plan.id)}
//                               className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-2"
//                             >
//                               <RefreshCw className="w-5 h-5" /> Sync
//                             </button>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Floating Action Button (FAB) */}
//         <div className="fixed bottom-8 right-8 z-50">
//           <AnimatePresence>
//             {isFabOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="absolute bottom-20 right-0 mb-4 space-y-3 text-right"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/add-application'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Plus className="w-5 h-5" /> Add Application
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/plan-type'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Settings className="w-5 h-5" /> Add Plan Type
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/trial-days-settings'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Settings className="w-5 h-5" /> Trail Days Setting
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/discounts'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Settings className="w-5 h-5" /> Add Discounts
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => { navigate('/admin/currency-config'); setIsFabOpen(false); }}
//                   className="flex items-center gap-3 px-5 py-4 bg-white text-violet-700 font-semibold rounded shadow-xl hover:shadow-2xl transition whitespace-nowrap"
//                 >
//                   <Settings className="w-5 h-5" /> Currency Config
//                 </motion.button>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsFabOpen(!isFabOpen)}
//             className="w-14 h-14 bg-violet-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition flex items-center justify-center"
//           >
//             <AnimatePresence mode="wait">
//               {isFabOpen ? (
//                 <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
//                   <X className="w-8 h-8" />
//                 </motion.div>
//               ) : (
//                 <motion.div key="plus" initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
//                   <Plus className="w-8 h-8" />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.button>
//         </div>

//         {/* Modals (Delete, Sync, Edit/Create) */}
//         <AnimatePresence>
//           {isDeleteModalOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
//               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Plan?</h3>
//                 <p className="text-gray-600 mb-8">This action cannot be undone.</p>
//                 <div className="flex justify-end gap-4">
//                   <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Cancel</button>
//                   <button onClick={() => handleDeletePlan(planToDelete)} disabled={isLoading} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:opacity-70 flex items-center gap-2">
//                     {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Delete
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}

//           {isSyncModalOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
//               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Sync with Stripe?</h3>
//                 <p className="text-gray-600 mb-8">This will create/update the price in Stripe.</p>
//                 <div className="flex justify-end gap-4">
//                   <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Cancel</button>
//                   <button onClick={() => handleStripeSync(planToSync)} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-70 flex items-center gap-2">
//                     {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Sync
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}

//           {isEditModalOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
//               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
//                 <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 text-white">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-2xl font-bold">{planToEdit ? `Edit Plan #${planToEdit.id}` : 'Create New Plan'}</h3>
//                     <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded transition"><X className="w-5 h-5" /></button>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-6">
//                   <div className="p-3 bg-violet-50 rounded border border-violet-200">
//                     <p className="font-medium text-violet-800">Applications: <span className="font-bold">{selectedApps.join(' + ')}</span></p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Plan Type</label>
//                     <select name="planTypeMappingId" value={form.planTypeMappingId} onChange={handleChange} required className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none">
//                       <option value="">Select plan type</option>
//                       {planTypes.map(pt => (
//                         <option key={pt.id} value={pt.id}>{formatPlanType(pt)}</option>
//                       ))}
//                     </select>
//                   </div>
//                   {/* NEW: Country Dropdown */}
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Country <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="countryCode"
//                       value={form.countryCode || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none bg-white"
//                     >
//                       <option value="">Select Country</option>
//                       {countries.map(c => (
//                         <option key={c.countryCode} value={c.countryCode}>
//                           {c.displayName || c.countryCode} ({c.currencySymbol} {c.currencyCode})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   {selectedApps.length === 1 && isMonthlyPlan() && (
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Base Price ($)</label>
//                       <input type="number" name="monthlyBasePrice" value={form.monthlyBasePrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
//                     </div>
//                   )}
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
//                     <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleChange} min="0" max="100" className="w-full px-5 py-3 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Stripe Price ID (optional)</label>
//                     <input type="text" name="stripePriceId" value={form.stripePriceId} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded font-mono text-sm focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-4 p-6 bg-gray-50 rounded-b-3xl">
//                   <button onClick={closeModal} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition">Cancel</button>
//                   <button
//                     onClick={() => planToEdit ? handleUpdatePlan() : handleSubmit()}
//                     disabled={isLoading}
//                     className="px-8 py-2 bg-violet-600 text-white font-bold rounded hover:bg-violet-700 disabled:opacity-70 flex items-center gap-3 shadow-lg transition"
//                   >
//                     {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
//                     {planToEdit ? 'Update Plan' : 'Create Plan'}
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

// export default AdminPlanManager;










import React, { useEffect, useState } from 'react';
import {
  Menu, X, Loader2, Plus, Edit, Trash2, RefreshCw, Check, Layers, Clock, Tag, DollarSign, Globe
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function AdminPlanManager() {
  const [applications, setApplications] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
  const [selectedApps, setSelectedApps] = useState([]);
  const [form, setForm] = useState({
    id: '',
    applicationIds: [],
    planTypeMappingId: '',
    countryCode: '',
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

  // Sidebar / drawer control – always hamburger-triggered
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const quickActions = [
    { label: 'Add Application',    icon: Plus,     path: '/admin/add-application'    },
    { label: 'Add Plan Type',      icon: Layers, path: '/admin/plan-type'           },
    { label: 'Trial Days Setting', icon: Clock, path: '/admin/trial-days-settings' },
    { label: 'Add Discounts',      icon: Tag, path: '/admin/discounts'           },
    { label: 'Currency Config',    icon: DollarSign, path: '/admin/currency-config'     },
  ];

  // ─── Data conversion & fetching logic remains mostly same ───
  const convertDTOToPlan = (dto) => {
    const planType = planTypes.find((pt) => pt.id === (dto.planTypeMappingId || (dto.plan && dto.plan.id)));
    const applicationIds = Array.isArray(dto.applicationIds)
      ? dto.applicationIds
      : dto.applications
      ? dto.applications.map((app) => app.id)
      : [];
    return {
      id: dto.id || null,
      plan: planType || { id: dto.planTypeMappingId || (dto.plan && dto.plan.id) || 0, planName: 'Unknown', interval: 'Unknown' },
      applications: applicationIds.map((id) => applications.find((app) => app.id === id) || { id, name: 'Unknown' }),
      planTypeMappingId: dto.planTypeMappingId || (dto.plan && dto.plan.id) || '',
      countryCode: dto.countryCode || '',
      monthlyBasePrice: dto.monthlyBasePrice || null,
      discountPercent: dto.discountPercent || 0,
      stripePriceId: dto.stripePriceId || '',
      calculatedPrice: dto.calculatedPrice || 0,
      discountedPrice: dto.discountedPrice || 0,
      deleted: dto.deleted || false,
      formattedPrice: dto.formattedPrice || null,
      currencyCode: dto.currencyCode || null,
      currencyConfig: dto.currencyConfig || null,
    };
  };

  useEffect(() => {
    fetchApplications();
    fetchPlanTypes();
    fetchCountries();
  }, []);

  useEffect(() => {
    setSelectedCountryFilter('');
    if (selectedApps.length > 0) {
      fetchPlans(selectedApps);
    } else {
      setPlans([]);
    }
  }, [selectedApps]);

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/getCountries`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      toast.error('Failed to fetch countries: ' + error.message);
    }
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/applications`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
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
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
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
      const query = appNames.map((name) => `appNames=${encodeURIComponent(name)}`).join('&');
      const res = await fetch(`${API_BASE}/api/admin/plansByApp?${query}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const filteredPlans = data
        .map(convertDTOToPlan)
        .filter(
          (plan) =>
            !plan.deleted &&
            plan.applications.length === appNames.length &&
            plan.applications.every((app) => appNames.includes(app.name))
        )
        .sort((a, b) => {
          const planTypeA = planTypes.find((pt) => pt.id === (a.plan?.id || a.planTypeMappingId));
          const planTypeB = planTypes.find((pt) => pt.id === (b.plan?.id || b.planTypeMappingId));
          const nameA = planTypeA?.planName || '';
          const nameB = planTypeB?.planName || '';
          const intervalA = planTypeA?.interval || '';
          const intervalB = planTypeB?.interval || '';
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
        toast.success('Stripe sync successful');
        setPlans((prev) =>
          prev
            .map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
            .sort((a, b) => {
              const ptA = planTypes.find((pt) => pt.id === (a.plan?.id || a.planTypeMappingId));
              const ptB = planTypes.find((pt) => pt.id === (b.plan?.id || b.planTypeMappingId));
              return (ptA?.planName || '').localeCompare(ptB?.planName || '') ||
                     (ptA?.interval || '').localeCompare(ptB?.interval || '');
            })
        );
      } else {
        throw new Error(responseData.error || 'Failed to sync with Stripe');
      }
    } catch (error) {
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
        setPlans((prev) => prev.filter((p) => p.id !== planId));
      } else {
        throw new Error(responseData.error || 'Delete failed');
      }
    } catch (error) {
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
          countryCode: form.countryCode,
          monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) || null : null,
          discountPercent: parseFloat(form.discountPercent) || 0,
        }),
      });
      const responseData = await res.json();
      if (res.ok && responseData.plan) {
        toast.success(responseData.message || 'Plan updated successfully');
        const updatedPlan = convertDTOToPlan(responseData.plan);
        setPlans((prev) =>
          prev
            .map((p) => (p.id === planToEdit.id ? updatedPlan : p))
            .sort((a, b) => {
              const ptA = planTypes.find((pt) => pt.id === (a.plan?.id || a.planTypeMappingId));
              const ptB = planTypes.find((pt) => pt.id === (b.plan?.id || b.planTypeMappingId));
              return (ptA?.planName || '').localeCompare(ptB?.planName || '') ||
                     (ptA?.interval || '').localeCompare(ptB?.interval || '');
            })
        );
        closeModal();
      } else {
        throw new Error(responseData.error || 'Update failed');
      }
    } catch (error) {
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
      applicationIds: plan.applications.map((app) => app.id),
      planTypeMappingId: plan.plan ? plan.plan.id : plan.planTypeMappingId || '',
      countryCode: plan.countryCode || '',
      monthlyBasePrice: plan.monthlyBasePrice || '',
      discountPercent: plan.discountPercent !== undefined ? String(plan.discountPercent) : '0',
      stripePriceId: plan.stripePriceId || '',
    });
    setSelectedApps(plan.applications.map((app) => app.name));
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
      countryCode: '',
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppChange = (appName) => {
    const updatedApps = selectedApps.includes(appName)
      ? selectedApps.filter((name) => name !== appName)
      : [...selectedApps, appName];
    setSelectedApps(updatedApps);
    setForm((prev) => ({
      ...prev,
      applicationIds: updatedApps.map((name) => applications.find((app) => app.name === name)?.id).filter(Boolean),
    }));
  };

  const isMonthlyPlan = () => {
    if (!form.planTypeMappingId) return false;
    const selectedPlan = planTypes.find((pt) => pt.id === Number(form.planTypeMappingId));
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
          countryCode: form.countryCode,
          monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) || null : null,
          discountPercent: parseFloat(form.discountPercent) || 0,
        }),
      });
      const responseData = await res.json();
      if (res.ok) {
        if (responseData.message === 'Plan already exists') {
          toast.error(
            `Plan already exists for applications: ${responseData.data.applications
              .map((app) => app.name)
              .join(', ')} and plan type: ${formatPlanType(responseData.data.plan)}`
          );
          return;
        }
        const newPlan = convertDTOToPlan(responseData.data || responseData);
        toast.success('Plan created successfully');
        setPlans((prev) =>
          [...prev, newPlan].sort((a, b) => {
            const ptA = planTypes.find((pt) => pt.id === (a.plan?.id || a.planTypeMappingId));
            const ptB = planTypes.find((pt) => pt.id === (b.plan?.id || b.planTypeMappingId));
            return (ptA?.planName || '').localeCompare(ptB?.planName || '') ||
                   (ptA?.interval || '').localeCompare(ptB?.interval || '');
          })
        );
        closeModal();
        if (selectedApps.length) fetchPlans(selectedApps);
      } else {
        throw new Error(responseData.error || 'Create failed');
      }
    } catch (error) {
      toast.error(`Error creating plan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPlanType = (planType) => {
    return planType?.planName && planType?.interval
      ? `${planType.planName} (${planType.interval})`
      : planType?.planName || `Plan ${planType?.id || 'Unknown'}`;
  };

  const filteredPlans = selectedCountryFilter
    ? plans.filter((plan) => plan.countryCode === selectedCountryFilter)
    : plans;

  return (
    <>
      <ToastContainer position="bottom-right" theme="light" autoClose={3000} />

      <div className="min-h-screen bg-slate-50">

        {/* ─── HEADER ──────────────────────────────────────────────── */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Left side: Hamburger + Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <h1 className="text-2xl font-semibold text-slate-900">Plan Manager</h1>
              </div>

              {/* Right side: Country Filter */}
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700 hidden sm:block">
                    <span><Globe size={16} /></span>
                    {/* Country: */}
                  </label>
                  <select
                    value={selectedCountryFilter}
                    onChange={(e) => setSelectedCountryFilter(e.target.value)}
                    className="min-w-[180px] sm:min-w-[220px] px-3 py-2 text-sm border border-slate-300 rounded-lg 
                              focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none 
                              bg-white shadow-sm hover:border-slate-400 transition"
                  >
                    <option value="">All Countries</option>
                    {countries.map((c) => (
                      <option key={c.countryCode} value={c.countryCode}>
                        {c.displayName || c.countryCode} ({c.currencySymbol} {c.currencyCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* ─── DRAWER (used on all screen sizes) ───────────────────── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsSidebarOpen(false)}
              />

              {/* Drawer panel */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Admin Tools</h2>
                    <button onClick={() => setIsSidebarOpen(false)}>
                      <X size={24} className="text-slate-500 hover:text-slate-700" />
                    </button>
                  </div>

                  <nav className="flex-1 p-4 space-y-1.5">
                    {quickActions.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition font-medium"
                      >
                        <item.icon size={20} />
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  <div className="p-6 border-t text-sm text-slate-500">
                    Admin Dashboard
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── MAIN CONTENT ────────────────────────────────────────── */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

            {/* Application Selector */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Select Applications</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {applications
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((app) => (
                    <label
                      key={app.id}
                      className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all text-sm sm:text-base
                        ${selectedApps.includes(app.name)
                          ? 'border-slate-500 bg-slate-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedApps.includes(app.name)}
                        onChange={() => handleAppChange(app.name)}
                        className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                      />
                      <span className="font-medium text-slate-800">{app.name}</span>
                    </label>
                  ))}
              </div>

              {selectedApps.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-700 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApps.map((name) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-800 rounded-full text-sm font-medium"
                      >
                        {name}
                        <button
                          onClick={() => handleAppChange(name)}
                          className="p-1 hover:bg-slate-200 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Country Filter */}
            {/* <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Filter by Country</h3>
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="w-full max-w-xs sm:max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.countryCode} value={c.countryCode}>
                    {c.displayName || c.countryCode} ({c.currencySymbol} {c.currencyCode})
                  </option>
                ))}
              </select>
            </section> */}

            {/* Plans Section */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-slate-200 bg-slate-50/70">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                      Pricing Plans ({filteredPlans.length})
                    </h2>
                    <p className="text-slate-600 mt-1 text-sm">
                      Select applications above to view or create plans
                    </p>
                  </div>

                  {selectedApps.length > 0 && (
                    <button
                      onClick={() => {
                        setForm({
                          id: '',
                          applicationIds: selectedApps.map((n) => applications.find((a) => a.name === n)?.id).filter(Boolean),
                          planTypeMappingId: '',
                          countryCode: '',
                          monthlyBasePrice: '',
                          discountPercent: '0',
                          stripePriceId: '',
                        });
                        setPlanToEdit(null);
                        setIsEditModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition shadow-sm whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      New Plan
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                {/* loading / empty / no plans states remain similar, just calmer colors */}
                {isLoading ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-10 h-10 text-slate-600 mx-auto animate-spin mb-4" />
                    <p className="text-slate-600 text-lg">Loading plans...</p>
                  </div>
                ) : selectedApps.length === 0 ? (
                  <div className="text-center py-16 sm:py-20 text-slate-500">
                    <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <Plus className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg sm:text-xl">Select applications above to view or create plans</p>
                  </div>
                ) : filteredPlans.length === 0 ? (
                  <div className="text-center py-16 sm:py-20 text-slate-500">
                    <p className="text-lg sm:text-xl">
                      No plans found for selected applications{selectedCountryFilter ? ` in ${selectedCountryFilter}` : ''}
                    </p>
                    {selectedApps.length > 0 && (
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="mt-4 text-slate-700 hover:text-slate-900 font-medium"
                      >
                        Create a new plan →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {filteredPlans.map((plan) => (
                        <motion.div
                          key={plan.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow transition-all group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {formatPlanType(plan.plan)}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {plan.applications.map((a) => a.name).join(' + ')}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {countries.find((c) => c.countryCode === plan.countryCode)?.displayName || plan.countryCode || 'Global'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(plan)}
                                className="p-2 rounded hover:bg-slate-100 transition"
                              >
                                <Edit className="w-5 h-5 text-slate-600" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(plan.id)}
                                className="p-2 rounded hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-5 h-5 text-rose-600" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Base Price</span>
                              <span className="font-medium">
                                {/* {plan.monthlyBasePrice !== null ? `$${plan.monthlyBasePrice.toFixed(2)}` : '—'} */}
                                {plan.monthlyBasePrice !== null && plan.currencyConfig?.currencySymbol
                                  ? `${plan.currencyConfig.currencySymbol}${plan.monthlyBasePrice.toFixed(2)}`
                                  : plan.formattedPrice || '—'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Discount</span>
                              <span className="font-medium text-rose-600">{plan.discountPercent}%</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t font-medium">
                              <span>Final Price</span>
                              {/* <span className="text-emerald-700">${plan.discountedPrice.toFixed(2)}</span> */}
                              <span className="text-emerald-700">
                                {plan.formattedPrice || '—'}
                              </span>
                            </div>
                            {plan.currencyCode && (
                              <div className="text-xs text-slate-500 mt-1">
                                Currency: {plan.currencyCode} ({plan.currencyConfig?.currencySymbol || '?'})
                              </div>
                            )}
                          </div>

                          <div className="mt-5 pt-4 border-t text-sm flex items-center justify-between">
                            {plan.stripePriceId ? (
                              <div className="flex items-center gap-2 text-emerald-600">
                                <Check className="w-4 h-4" />
                                <span>Synced</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => openSyncModal(plan.id)}
                                className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1.5"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Sync to Stripe
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

        {/* ─── Modals (slightly better mobile handling) ────────────── */}
        <AnimatePresence>
          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900">Delete Plan?</h3>
                </div>

                <div className="p-6">
                  <p className="text-slate-600">
                    This action cannot be undone. The plan will be permanently removed.
                  </p>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePlan(planToDelete)}
                    disabled={isLoading}
                    className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition flex items-center gap-2 shadow-sm
                                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'}`}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Sync with Stripe Modal */}
          {isSyncModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900">Sync with Stripe?</h3>
                </div>

                <div className="p-6">
                  <p className="text-slate-600">
                    This will create or update the corresponding price object in Stripe.
                  </p>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStripeSync(planToSync)}
                    disabled={isLoading}
                    className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition flex items-center gap-2 shadow-sm
                                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sync Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Create / Edit Plan Modal */}
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {planToEdit ? `Edit Plan #${planToEdit.id}` : 'Create New Plan'}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="p-1.5 hover:bg-slate-100 rounded-full transition text-slate-500 hover:text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  {/* Selected Applications summary */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-700">
                      Applications:{' '}
                      <span className="font-semibold text-slate-900">
                        {selectedApps.join(' + ') || 'None selected'}
                      </span>
                    </p>
                  </div>

                  {/* Plan Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Plan Type <span className="text-rose-600">*</span>
                    </label>
                    <select
                      name="planTypeMappingId"
                      value={form.planTypeMappingId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition"
                    >
                      <option value="">Select plan type</option>
                      {planTypes.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {formatPlanType(pt)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country <span className="text-rose-600">*</span>
                    </label>
                    <select
                      name="countryCode"
                      value={form.countryCode || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.countryCode} value={c.countryCode}>
                          {c.displayName || c.countryCode} ({c.currencySymbol} {c.currencyCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly Base Price – only for single-app monthly plans */}
                  {selectedApps.length === 1 && isMonthlyPlan() && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Monthly Base Price ($)
                      </label>
                      <input
                        type="number"
                        name="monthlyBasePrice"
                        value={form.monthlyBasePrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  )}

                  {/* Discount Percent */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercent"
                      value={form.discountPercent}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Stripe Price ID */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stripe Price ID (optional)
                    </label>
                    <input
                      type="text"
                      name="stripePriceId"
                      value={form.stripePriceId || ''}
                      onChange={handleChange}
                      placeholder="price_xxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg font-mono text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition bg-slate-50"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      Will be auto-filled after first successful sync
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => (planToEdit ? handleUpdatePlan() : handleSubmit())}
                    disabled={isLoading}
                    className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition flex items-center gap-2 shadow-sm
                                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {planToEdit ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
}

export default AdminPlanManager;