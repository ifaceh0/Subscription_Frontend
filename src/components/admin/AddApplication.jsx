// import React, { useState, useEffect, useCallback } from 'react';

// const Plus = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M5 12h14" /><path d="M12 5v14" />
//   </svg>
// );

// const X = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 6 6 18" /><path d="m6 6 12 12" />
//   </svg>
// );

// const Edit = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// );

// const Loader2 = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//        className="animate-spin">
//     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//   </svg>
// );

// const RefreshCw = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//     <path d="M21 3v5h-5" />
//     <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//     <path d="M8 16H3v5" />
//   </svg>
// );

// const ToastNotification = ({ message, type, isVisible }) => {
//   if (!isVisible) return null;
//   const bg = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
//   return (
//     <div className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-2xl text-white font-medium z-50 
//                      transition-all duration-300 transform translate-y-0 opacity-100 ${bg}`}>
//       {message}
//     </div>
//   );
// };

// const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <div className="p-6">{children}</div>

//         {onSubmit && (
//           <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
//             <button
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onSubmit}
//               disabled={isSubmitting}
//               className="px-6 py-2 bg-violet-600 text-white font-semibold rounded hover:bg-violet-700 
//                          disabled:opacity-70 flex items-center gap-2 transition shadow-lg"
//             >
//               {isSubmitting && <Loader2 className="w-5 h-5" />}
//               {submitButtonText}
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// import { motion } from 'framer-motion';

// const ApplicationManager = () => {
//   const [applications, setApplications] = useState([]);
//   const [form, setForm] = useState({ id: null, name: '', stripeProductId: '' });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreatingNew, setIsCreatingNew] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('success');
//   const [isToastVisible, setIsToastVisible] = useState(false);

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
//     const fetchApplications = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch(`${API_BASE_URL}/api/admin/applications`);
//         if (!res.ok) throw new Error('Failed to load applications');
//         const data = await res.json();
//         setApplications(data);
//       } catch (err) {
//         showToast(err.message || 'Network error', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchApplications();
//   }, [showToast]);

//   const handleSyncStripe = async (app) => {
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/admin/sync-stripe-app`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(app),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || 'Sync failed');
//       setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stripeProductId: result.stripeProductId } : a));
//       showToast(`${app.name} synced successfully!`, 'success');
//     } catch (err) {
//       showToast(err.message, 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const openCreateModal = () => { setIsCreatingNew(true); setForm({ id: null, name: '', stripeProductId: '' }); setIsEditModalOpen(true); };
//   const openEditModal = (app) => { setIsCreatingNew(false); setForm(app); setIsEditModalOpen(true); };
//   const closeModal = () => { setIsEditModalOpen(false); setForm({ id: null, name: '', stripeProductId: '' }); };
//   const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = async () => {
//     if (!form.name.trim()) return showToast('Application name is required', 'error');
//     setIsSubmitting(true);
//     try {
//       const payload = { name: form.name.trim(), stripeProductId: form.stripeProductId || null };
//       const url = isCreatingNew ? `${API_BASE_URL}/api/admin/createApp` : `${API_BASE_URL}/api/admin/updateApp/${form.id}`;
//       const method = isCreatingNew ? 'POST' : 'PUT';

//       const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || 'Save failed');

//       const savedApp = result.data;
//       setApplications(prev => isCreatingNew ? [...prev, savedApp] : prev.map(a => a.id === savedApp.id ? savedApp : a));
//       showToast(`Application ${savedApp.name} ${isCreatingNew ? 'created' : 'updated'} successfully!`, 'success');
//       closeModal();
//     } catch (err) {
//       showToast(err.message, 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="max-w-7xl mx-auto px-6 py-12">

//           {/* Header */}
//           <div className="mb-10">
//             <h1 className="text-4xl font-bold text-gray-900">Application Manager</h1>
//             <p className="text-lg text-gray-600 mt-2">Manage and sync your subscription applications with Stripe</p>
//           </div>

//           {/* Main Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded shadow-xl border border-gray-200 overflow-hidden"
//           >
//             {/* Card Header */}
//             <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-2xl font-bold">Applications ({applications.length})</h2>
//                   <p className="text-violet-100 mt-1">Click sync to connect with Stripe</p>
//                 </div>
//                 <button
//                   onClick={openCreateModal}
//                   className="px-6 py-2 bg-white text-violet-700 font-bold rounded shadow-lg hover:shadow-xl 
//                              hover:bg-gray-50 transition-all flex items-center gap-3"
//                 >
//                   <Plus className="w-5 h-5" /> Add Application
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="p-8">
//               {isLoading ? (
//                 <div className="text-center py-20">
//                   {/* <Loader2 className="w-12 h-12 text-violet-600 mx-auto mb-4" /> */}
//                   <p className="text-gray-600 text-lg">Loading applications...</p>
//                 </div>
//               ) : applications.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500">
//                   <p className="text-xl">No applications yet</p>
//                   <button onClick={openCreateModal} className="mt-4 text-violet-600 font-medium hover:underline">
//                     Create your first one
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
//                   {applications.map((app) => (
//                     <motion.div
//                       key={app.id}
//                       initial={{ opacity: 0, scale: 0.98 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="bg-gray-50 rounded p-6 border border-gray-200 hover:border-violet-300 
//                                  hover:shadow-lg transition-all duration-300 group"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
//                           <p className="text-sm text-gray-500">ID: {app.id}</p>
//                         </div>
//                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
//                           <button
//                             onClick={() => openEditModal(app)}
//                             className="p-2.5 bg-white rounded shadow hover:shadow-md transition"
//                           >
//                             <Edit className="w-5 h-5 text-gray-600" />
//                           </button>
//                           <button
//                             onClick={() => handleSyncStripe(app)}
//                             disabled={isSubmitting}
//                             className="p-2.5 bg-violet-100 rounded hover:bg-violet-200 transition disabled:opacity-50"
//                           >
//                             <RefreshCw className="w-5 h-5 text-violet-600" />
//                           </button>
//                         </div>
//                       </div>

//                       <div className="bg-white rounded p-4 font-mono text-sm">
//                         <span className="text-gray-500">Stripe ID:</span>{' '}
//                         <span className={app.stripeProductId ? 'text-green-600' : 'text-gray-400'}>
//                           {app.stripeProductId || 'Not synced'}
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
//         title={isCreatingNew ? 'Create New Application' : 'Edit Application'}
//         onSubmit={handleSubmit}
//         submitButtonText={isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create Application' : 'Save Changes')}
//         isSubmitting={isSubmitting}
//       >
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Application Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="e.g., Loyalty Pro"
//               className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Stripe Product ID (Optional)</label>
//             <input
//               type="text"
//               name="stripeProductId"
//               value={form.stripeProductId}
//               onChange={handleChange}
//               placeholder="prod_xxxxxxxxxxxxxxxx"
//               className="w-full px-4 py-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
//             />
//             <p className="text-xs text-gray-500 mt-2">Will be auto-filled when you sync with Stripe</p>
//           </div>
//         </div>
//       </Modal>

//       <ToastNotification message={toastMessage} type={toastType} isVisible={isToastVisible} />
//     </>
//   );
// };

// export default ApplicationManager;













import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Plus, X, Edit } from 'lucide-react';

const ToastNotification = ({ message, type, isVisible }) => {
  if (!isVisible) return null;
  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-rose-600';
  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3.5 rounded-lg shadow-xl text-white font-medium z-50 transition-all ${bg}`}>
      {message}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
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
              {isSubmitting && <Loader2 className="w-4 h-4" />}
              {submitButtonText}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', stripeProductId: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    setIsToastVisible(false);
    setTimeout(() => {
      setToastMessage(message);
      setToastType(type);
      setIsToastVisible(true);
    }, 80);
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => setIsToastVisible(false), duration);
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/applications`);
        if (!res.ok) throw new Error('Failed to load applications');
        const data = await res.json();
        setApplications(data || []);
      } catch (err) {
        showToast('Could not load applications', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [showToast]);

  const handleSyncStripe = async (app) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/sync-stripe-app`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Sync failed');
      }

      const result = await res.json();
      setApplications(prev =>
        prev.map(a => a.id === app.id ? { ...a, stripeProductId: result.stripeProductId } : a)
      );

      showToast(`${app.name} synced with Stripe`, 'success');
    } catch (err) {
      showToast(err.message || 'Sync failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setForm({ id: null, name: '', stripeProductId: '' });
    setIsEditModalOpen(true);
  };

  const openEditModal = (app) => {
    setIsCreatingNew(false);
    setForm(app);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setForm({ id: null, name: '', stripeProductId: '' }), 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast('Application name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        stripeProductId: form.stripeProductId?.trim() || null,
      };

      const url = isCreatingNew
        ? `${API_BASE_URL}/api/admin/createApp`
        : `${API_BASE_URL}/api/admin/updateApp/${form.id}`;
      const method = isCreatingNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Save failed');
      }

      const saved = await res.json();
      const app = saved.data || saved;

      setApplications(prev =>
        isCreatingNew ? [...prev, app] : prev.map(a => a.id === app.id ? app : a)
      );

      showToast(`Application "${app.name}" ${isCreatingNew ? 'created' : 'updated'}`, 'success');
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
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900">Applications</h1>
            <p className="mt-2 text-slate-600">
              Manage subscription-enabled applications and their Stripe integration
            </p>
          </div>

          {/* Main container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top bar */}
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Registered Applications <span className="text-slate-500 font-normal">({applications.length})</span>
              </h2>

              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Application
              </button>
            </div>

            {/* Content area */}
            <div className="p-6 lg:p-8">
              {isLoading ? (
                <div className="text-center py-20 text-slate-500">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                  <p>Loading applications…</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-lg font-medium text-slate-700 mb-2">No applications registered yet</p>
                  <button
                    onClick={openCreateModal}
                    className="text-slate-700 hover:text-slate-900 font-medium"
                  >
                    Add your first application →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-slate-900 truncate">{app.name}</h3>
                          <span className="text-xs text-slate-500 font-mono">#{app.id}</span>
                        </div>

                        <div className="mt-1.5 text-sm font-mono">
                          <span className="text-slate-500">Stripe Product ID:</span>{' '}
                          <span className={app.stripeProductId ? 'text-emerald-700' : 'text-slate-400'}>
                            {app.stripeProductId || 'Not synced'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditModal(app)}
                          className="p-2.5 rounded-lg hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleSyncStripe(app)}
                          disabled={isSubmitting}
                          className={`p-2.5 rounded-lg transition ${
                            isSubmitting
                              ? 'opacity-50 cursor-not-allowed bg-slate-100'
                              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                          title="Sync with Stripe"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
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
        title={isCreatingNew ? 'New Application' : 'Edit Application'}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? 'Saving…' : (isCreatingNew ? 'Create' : 'Update')}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Application Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Loyalty Program, Premium Features"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stripe Product ID
            </label>
            <input
              type="text"
              name="stripeProductId"
              value={form.stripeProductId || ''}
              onChange={handleChange}
              placeholder="prod_xxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg font-mono text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition bg-slate-50"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Leave empty → will be filled automatically after first Stripe sync
            </p>
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

export default ApplicationManager;