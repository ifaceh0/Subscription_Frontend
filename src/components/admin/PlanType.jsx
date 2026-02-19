// import React, { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';

// const Plus = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M5 12h14" /><path d="M12 5v14" />
//   </svg>
// );

// const X = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 6 6 18" /><path d="m6 6 12 12" />
//   </svg>
// );

// const Edit = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// );

// const Loader2 = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
//     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//   </svg>
// );

// const ToastNotification = ({ message, type, isVisible }) => {
//   if (!isVisible) return null;
//   const bg = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-2xl text-white font-semibold z-50 ${bg} backdrop-blur-sm`}
//     >
//       {message}
//     </motion.div>
//   );
// };

// const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">{children}</div>

//         {onSubmit && (
//           <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b">
//             <button
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onSubmit}
//               disabled={isSubmitting}
//               className="px-7 py-2 bg-violet-600 text-white font-bold rounded hover:bg-violet-700 disabled:opacity-70 flex items-center gap-3 shadow-lg transition"
//             >
//               {isSubmitting && <Loader2 className="w-5 h-5" />}
//               {submitButtonText}
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// const PlanTypeManager = () => {
//   const [planTypes, setPlanTypes] = useState([]);
//   const [form, setForm] = useState({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreatingNew, setIsCreatingNew] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('success');
//   const [isToastVisible, setIsToastVisible] = useState(false);

//   const intervals = ['Monthly', 'Quarterly', 'Yearly'];

//   const showToast = useCallback((message, type = 'success', duration = 3000) => {
//     setIsToastVisible(false);
//     setTimeout(() => {
//       setToastMessage(message);
//       setToastType(type);
//       setIsToastVisible(true);
//     }, 100);
//     clearTimeout(window.toastTimer);
//     window.toastTimer = setTimeout(() => setIsToastVisible(false), duration);
//   }, []);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchPlanTypes = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch(`${API_BASE_URL}/api/admin/plan-types`);
//         if (!res.ok) throw new Error('Failed to load plan types');
//         const data = await res.json();
//         setPlanTypes(data);
//       } catch (err) {
//         showToast(err.message, 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPlanTypes();
//   }, [showToast]);

//   const openCreateModal = () => {
//     setIsCreatingNew(true);
//     setForm({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
//     setIsEditModalOpen(true);
//   };

//   const openEditModal = (plan) => {
//     setIsCreatingNew(false);
//     setForm({ ...plan, monthCount: plan.monthCount || 1 });
//     setIsEditModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsEditModalOpen(false);
//     setForm({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
//   };

//   const handleIntervalChange = (e) => {
//     const val = e.target.value;
//     const months = val === 'Quarterly' ? 3 : val === 'Yearly' ? 12 : 1;
//     setForm(prev => ({ ...prev, interval: val, monthCount: months }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!form.planName.trim() || !form.description.trim()) {
//       showToast('Plan Name and Description are required.', 'error');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         planName: form.planName.trim(),
//         description: form.description.trim(),
//         interval: form.interval,
//         monthCount: parseInt(form.monthCount),
//       };

//       const url = isCreatingNew
//         ? `${API_BASE_URL}/api/admin/createPlanType`
//         : `${API_BASE_URL}/api/admin/updatePlanType/${form.id}`;
//       const method = isCreatingNew ? 'POST' : 'PUT';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || 'Operation failed');

//       const savedPlan = result.data;
//       setPlanTypes(prev =>
//         isCreatingNew
//           ? [...prev, savedPlan]
//           : prev.map(p => (p.id === savedPlan.id ? savedPlan : p))
//       );

//       showToast(
//         `Plan "${savedPlan.planName}" ${isCreatingNew ? 'created' : 'updated'} successfully!`,
//         'success'
//       );
//       closeModal();
//     } catch (err) {
//       showToast(err.message, 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50">
//         <div className="max-w-7xl mx-auto px-6 py-12">

//           {/* Header */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
//             <h1 className="text-4xl font-bold text-gray-900">Plan Type Manager</h1>
//             <p className="text-lg text-gray-600 mt-2">Define subscription tiers and billing intervals</p>
//           </motion.div>

//           {/* Main Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded shadow-2xl border border-gray-200 overflow-hidden"
//           >
//             {/* Violet Header */}
//             <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-2xl font-bold">Subscription Plans ({planTypes.length})</h2>
//                   <p className="text-violet-100 mt-1">Monthly, Quarterly, Yearly — all managed here</p>
//                 </div>
//                 <button
//                   onClick={openCreateModal}
//                   className="px-6 py-2 bg-white text-violet-700 font-bold rounded shadow-lg hover:shadow-xl hover:bg-gray-50 transition flex items-center gap-3"
//                 >
//                   <Plus className="w-5 h-5" /> Add Plan Type
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-8">
//               {isLoading ? (
//                 <div className="text-center py-20">
//                   {/* <Loader2 className="w-12 h-12 text-violet-600 mx-auto mb-4" /> */}
//                   <p className="text-gray-600 text-lg">Loading plan types...</p>
//                 </div>
//               ) : planTypes.length === 0 ? (
//                 <div className="text-center py-20">
//                   <div className="bg-gray-100 border-2 border-dashed rounded w-24 h-24 mx-auto mb-6" />
//                   <p className="text-xl text-gray-500">No plan types yet</p>
//                   <button onClick={openCreateModal} className="mt-4 text-violet-600 font-semibold hover:underline">
//                     Create your first plan
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {planTypes.map((plan) => (
//                     <motion.div
//                       key={plan.id}
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="group bg-gradient-to-br from-violet-50 to-purple-50 rounded p-6 border border-violet-200 hover:border-violet-400 hover:shadow-xl transition-all duration-300"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <h3 className="text-xl font-bold text-gray-900">{plan.planName}</h3>
//                         <button
//                           onClick={() => openEditModal(plan)}
//                           className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded shadow hover:shadow-md transition"
//                         >
//                           <Edit className="w-5 h-5 text-gray-600" />
//                         </button>
//                       </div>

//                       <p className="text-gray-700 text-sm leading-relaxed mb-5">{plan.description}</p>

//                       <div className="flex items-center justify-between">
//                         <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-violet-600 text-white">
//                           {plan.interval}
//                         </span>
//                         <span className="text-2xl font-bold text-violet-700">
//                           {plan.monthCount} {plan.monthCount === 1 ? 'month' : 'months'}
//                         </span>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={closeModal}
//         title={isCreatingNew ? 'Create New Plan Type' : 'Edit Plan Type'}
//         onSubmit={handleSubmit}
//         submitButtonText={isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create Plan' : 'Save Changes')}
//         isSubmitting={isSubmitting}
//       >
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Plan Name</label>
//             <input
//               type="text"
//               name="planName"
//               value={form.planName}
//               onChange={handleChange}
//               placeholder="e.g., Pro, Enterprise"
//               className="w-full px-5 py-2 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none transition"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//             <textarea
//               name="description"
//               rows="3"
//               value={form.description}
//               onChange={handleChange}
//               placeholder="What does this plan include?"
//               className="w-full px-5 py-2 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none resize-none transition"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-5">
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Billing Interval</label>
//               <select
//                 name="interval"
//                 value={form.interval}
//                 onChange={handleIntervalChange}
//                 className="w-full px-5 py-2 border border-gray-300 rounded focus:ring-4 focus:ring-violet-200 focus:border-violet-500 outline-none transition bg-white"
//               >
//                 {intervals.map(i => (
//                   <option key={i} value={i}>{i}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Months)</label>
//               <input
//                 type="number"
//                 name="monthCount"
//                 value={form.monthCount}
//                 onChange={handleChange}
//                 min="1"
//                 className="w-full px-5 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700 font-mono text-lg text-center"
//                 disabled
//               />
//             </div>
//           </div>
//         </div>
//       </Modal>

//       <ToastNotification message={toastMessage} type={toastType} isVisible={isToastVisible} />
//     </>
//   );
// };

// export default PlanTypeManager;









import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Loader, X, Edit, Plus
} from 'lucide-react';

const ToastNotification = ({ message, type, isVisible }) => {
  if (!isVisible) return null;
  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-rose-600';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-6 right-6 px-6 py-3.5 rounded-lg shadow-xl text-white font-medium z-50 ${bg}`}
    >
      {message}
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">{children}</div>

        {onSubmit && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition flex items-center gap-2 shadow-sm
                          ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}
            >
              {isSubmitting && <Loader className="w-4 h-4" />}
              {submitButtonText}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PlanTypeManager = () => {
  const [planTypes, setPlanTypes] = useState([]);
  const [form, setForm] = useState({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const intervals = ['Monthly', 'Quarterly', 'Yearly'];

  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    setIsToastVisible(false);
    setTimeout(() => {
      setToastMessage(message);
      setToastType(type);
      setIsToastVisible(true);
    }, 100);
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => setIsToastVisible(false), duration);
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPlanTypes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/plan-types`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setPlanTypes(data || []);
      } catch (err) {
        showToast('Could not load plan types', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanTypes();
  }, [showToast]);

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setForm({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
    setIsEditModalOpen(true);
  };

  const openEditModal = (plan) => {
    setIsCreatingNew(false);
    setForm({ ...plan, monthCount: plan.monthCount || 1 });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setForm({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
    }, 300);
  };

  const handleIntervalChange = (e) => {
    const val = e.target.value;
    const months = val === 'Quarterly' ? 3 : val === 'Yearly' ? 12 : 1;
    setForm(prev => ({ ...prev, interval: val, monthCount: months }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.planName.trim() || !form.description.trim()) {
      showToast('Plan name and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        planName: form.planName.trim(),
        description: form.description.trim(),
        interval: form.interval,
        monthCount: Number(form.monthCount),
      };

      const url = isCreatingNew
        ? `${API_BASE_URL}/api/admin/createPlanType`
        : `${API_BASE_URL}/api/admin/updatePlanType/${form.id}`;
      const method = isCreatingNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed');
      }

      const saved = await res.json();
      const plan = saved.data || saved;

      setPlanTypes(prev =>
        isCreatingNew
          ? [...prev, plan]
          : prev.map(p => p.id === plan.id ? plan : p)
      );

      showToast(`Plan "${plan.planName}" ${isCreatingNew ? 'created' : 'updated'}`, 'success');
      closeModal();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50/70 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-semibold text-slate-900">Plan Types</h1>
            <p className="mt-2 text-slate-600">
              Manage subscription billing cycles and intervals
            </p>
          </motion.div>

          {/* Main content */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header bar */}
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Available Plans <span className="text-slate-500 font-normal">({planTypes.length})</span>
                </h2>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Plan Type
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 lg:p-8">
              {isLoading ? (
                <div className="text-center py-20 text-slate-500">
                  <Loader className="w-10 h-10 animate-spin mx-auto mb-3" />
                  <p>Loading plan types…</p>
                </div>
              ) : planTypes.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-lg font-medium text-slate-700 mb-2">No plan types defined yet</p>
                  <button
                    onClick={openCreateModal}
                    className="text-slate-700 hover:text-slate-900 font-medium"
                  >
                    Create your first plan type →
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {planTypes.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">{plan.planName}</h3>
                        <button
                          onClick={() => openEditModal(plan)}
                          className="opacity-60 hover:opacity-100 transition p-1.5 -m-1.5 rounded hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>

                      <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                        {plan.description || 'No description'}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {plan.interval}
                        </span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                          {plan.monthCount} {plan.monthCount === 1 ? 'month' : 'months'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        title={isCreatingNew ? 'New Plan Type' : 'Edit Plan Type'}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? 'Saving…' : (isCreatingNew ? 'Create' : 'Update')}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              name="planName"
              value={form.planName}
              onChange={handleChange}
              placeholder="e.g. Professional, Team"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Brief explanation of what this plan includes…"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Billing Interval
              </label>
              <select
                name="interval"
                value={form.interval}
                onChange={handleIntervalChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white outline-none transition"
              >
                {intervals.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (months)
              </label>
              <div className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium text-center">
                {form.monthCount}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ToastNotification
        message={toastMessage}
        type={toastType}
        isVisible={isToastVisible}
      />
    </>
  );
};

export default PlanTypeManager;