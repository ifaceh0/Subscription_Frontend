// import React, { useState, useEffect, useCallback } from 'react';

// const Plus = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M5 12h14" /><path d="M12 5v14" />
//     </svg>
// );

// const X = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M18 6 6 18" /><path d="m6 6 12 12" />
//     </svg>
// );

// const Edit = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
//     </svg>
// );

// const Loader2 = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//          className="animate-spin">
//         <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//     </svg>
// );

// const RefreshCw = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//         <path d="M21 3v5h-5" />
//         <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//         <path d="M8 16H3v5" />
//     </svg>
// );

// const ToastNotification = ({ message, type, isVisible }) => {
//     if (!isVisible || !message) return null;
//     const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white font-semibold transition-all duration-300 transform z-50 max-w-sm";
//     const typeClasses = { success: "bg-green-600", error: "bg-red-600" };
//     return (
//         <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-800'}`}
//              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
//             {message}
//         </div>
//     );
// };

// const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
//                 <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//                     <h3 className="text-2xl font-extrabold text-gray-800">{title}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>
//                 <div className="py-6">{children}</div>
//                 {onSubmit && (
//                     <div className="pt-4 border-t border-gray-200 flex justify-end">
//                         <button onClick={onClose} className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
//                                 disabled={isSubmitting}>Cancel</button>
//                         <button onClick={onSubmit}
//                                 className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
//                                 disabled={isSubmitting}>
//                             {isSubmitting && <Loader2 className="w-5 h-5 mr-2" />} {submitButtonText}
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// const ApplicationManager = () => {
//     const [applications, setApplications] = useState([]);
//     const [form, setForm] = useState({ id: null, name: '', stripeProductId: '' });
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isCreatingNew, setIsCreatingNew] = useState(false);
//     const [toastMessage, setToastMessage] = useState('');
//     const [toastType, setToastType] = useState('success');
//     const [isToastVisible, setIsToastVisible] = useState(false);

//     const showToast = useCallback((message, type = 'success', duration = 3000) => {
//         clearTimeout(window.currentToastTimer);
//         setIsToastVisible(false);
//         setToastMessage(message);
//         setToastType(type);
//         setIsToastVisible(true);
//         window.currentToastTimer = setTimeout(() => setIsToastVisible(false), duration);
//     }, []);

//     const API_BASE_URL = 'https://subscription-backend-e8gq.onrender.com/api/admin';

//     useEffect(() => {
//         const fetchApplications = async () => {
//             try {
//                 setIsLoading(true);
//                 const res = await fetch(`${API_BASE_URL}/applications`);
//                 if (!res.ok) throw new Error('Failed to fetch applications');
//                 setApplications(await res.json());
//             } catch (err) {
//                 showToast(err.message, 'error');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchApplications();
//     }, [showToast]);

//     const handleSyncStripe = async (app) => {
//         setIsSubmitting(true);
//         try {
//             const res = await fetch(`${API_BASE_URL}/sync-stripe-app`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(app),
//             });
//             const result = await res.json();
//             if (!res.ok) throw new Error(result.error || 'Failed to sync');
//             setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stripeProductId: result.stripeProductId } : a));
//             showToast(result.message || `${app.name} synced with Stripe.`, 'success');
//         } catch (err) {
//             showToast(err.message, 'error');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const openCreateModal = () => { setIsCreatingNew(true); setForm({ id: null, name: '', stripeProductId: '' }); setIsEditModalOpen(true); };
//     const openEditModal = (app) => { setIsCreatingNew(false); setForm({ ...app }); setIsEditModalOpen(true); };
//     const closeModal = () => { setIsEditModalOpen(false); setForm({ id: null, name: '', stripeProductId: '' }); };
//     const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

//     const handleSubmit = async () => {
//         if (!form.name.trim()) return showToast('Application Name is required.', 'error');
//         setIsSubmitting(true);
//         try {
//             const payload = { name: form.name.trim(), stripeProductId: form.stripeProductId || null };
//             const url = isCreatingNew ? `${API_BASE_URL}/createApp` : `${API_BASE_URL}/updateApp/${form.id}`;
//             const method = isCreatingNew ? 'POST' : 'PUT';
//             const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//             const result = await res.json();
//             if (!res.ok) throw new Error(result.message || 'Failed to save');
//             const savedApp = result.data;
//             setApplications(prev => isCreatingNew ? [...prev, savedApp] : prev.map(a => a.id === savedApp.id ? savedApp : a));
//             showToast(result.message || `Application ${savedApp.name} saved successfully.`, 'success');
//             closeModal();
//         } catch (err) {
//             showToast(err.message, 'error');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//             <header className="mb-8 border-b pb-4">
//                 <h1 className="text-3xl font-extrabold text-gray-900">Application Manager</h1>
//                 <p className="text-gray-500 mt-1">Configure core product applications for subscription mapping.</p>
//             </header>

//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-gray-800">Available Applications ({applications.length})</h2>
//                     <div className="flex space-x-3">
//                         <button onClick={openCreateModal}
//                                 className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 flex items-center">
//                             <Plus className="w-5 h-5 mr-2" /> Add New Application
//                         </button>
//                         <button onClick={() => applications.forEach(handleSyncStripe)}
//                                 className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 flex items-center"
//                                 disabled={isSubmitting || isLoading}>
//                             <RefreshCw className="w-5 h-5 mr-2" /> {isSubmitting ? 'Syncing...' : 'Sync All with Stripe'}
//                         </button>
//                     </div>
//                 </div>

//                 {isLoading ? (
//                     <div className="flex justify-center items-center h-48 text-indigo-600">
//                         <Loader2 className="w-8 h-8" /><span className="ml-3 text-lg">Loading Applications...</span>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto rounded-xl border border-gray-200">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stripe Product ID</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sync</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {applications.map(app => (
//                                     <tr key={app.id} className="hover:bg-indigo-50">
//                                         <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.id}</td>
//                                         <td className="px-6 py-4 text-sm font-semibold text-indigo-700">{app.name}</td>
//                                         <td className="px-6 py-4 text-xs text-gray-600 font-mono">{app.stripeProductId || 'N/A'}</td>
//                                         <td className="px-6 py-4 text-right">
//                                             <button onClick={() => openEditModal(app)}
//                                                     className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100">
//                                                 <Edit className="w-5 h-5" />
//                                             </button>
//                                         </td>
//                                         <td className="px-6 py-4 text-right">
//                                             <button onClick={() => handleSyncStripe(app)}
//                                                     className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
//                                                     disabled={isSubmitting}>
//                                                 <RefreshCw className="w-5 h-5" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             <Modal
//                 isOpen={isEditModalOpen}
//                 onClose={closeModal}
//                 title={isCreatingNew ? 'Create New Application' : `Edit Application: ${form.name}`}
//                 onSubmit={handleSubmit}
//                 submitButtonText={isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create' : 'Save Changes')}
//                 isSubmitting={isSubmitting}
//             >
//                 <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">Application Name *</label>
//                         <input type="text" id="name" name="name" value={form.name} onChange={handleChange}
//                                required placeholder="e.g., 'Loyalty Engine'"
//                                className="mt-1 block w-full border rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"/>
//                     </div>
//                     <div>
//                         <label htmlFor="stripeProductId" className="block text-sm font-medium text-gray-700">Stripe Product ID</label>
//                         <input type="text" id="stripeProductId" name="stripeProductId" value={form.stripeProductId}
//                                onChange={handleChange} placeholder="e.g., 'prod_XYZ123'"
//                                className="mt-1 block w-full border rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 font-mono"/>
//                         <p className="mt-1 text-xs text-gray-500">Must be unique across all applications.</p>
//                     </div>
//                 </form>
//             </Modal>

//             <ToastNotification message={toastMessage} type={toastType} isVisible={isToastVisible} />
//         </div>
//     );
// };

// export default ApplicationManager;









import React, { useState, useEffect, useCallback } from 'react';

const Plus = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

const X = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const Edit = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const Loader2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const RefreshCw = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const ToastNotification = ({ message, type, isVisible }) => {
  if (!isVisible) return null;
  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-2xl text-white font-medium z-50 
                     transition-all duration-300 transform translate-y-0 opacity-100 ${bg}`}>
      {message}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {onSubmit && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-violet-600 text-white font-semibold rounded hover:bg-violet-700 
                         disabled:opacity-70 flex items-center gap-2 transition shadow-lg"
            >
              {isSubmitting && <Loader2 className="w-5 h-5" />}
              {submitButtonText}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

import { motion } from 'framer-motion';

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

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
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
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/admin/applications`);
        if (!res.ok) throw new Error('Failed to load applications');
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        showToast(err.message || 'Network error', 'error');
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
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Sync failed');
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stripeProductId: result.stripeProductId } : a));
      showToast(`${app.name} synced successfully!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => { setIsCreatingNew(true); setForm({ id: null, name: '', stripeProductId: '' }); setIsEditModalOpen(true); };
  const openEditModal = (app) => { setIsCreatingNew(false); setForm(app); setIsEditModalOpen(true); };
  const closeModal = () => { setIsEditModalOpen(false); setForm({ id: null, name: '', stripeProductId: '' }); };
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return showToast('Application name is required', 'error');
    setIsSubmitting(true);
    try {
      const payload = { name: form.name.trim(), stripeProductId: form.stripeProductId || null };
      const url = isCreatingNew ? `${API_BASE_URL}/api/admin/createApp` : `${API_BASE_URL}/api/admin/updateApp/${form.id}`;
      const method = isCreatingNew ? 'POST' : 'PUT';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Save failed');

      const savedApp = result.data;
      setApplications(prev => isCreatingNew ? [...prev, savedApp] : prev.map(a => a.id === savedApp.id ? savedApp : a));
      showToast(`Application ${savedApp.name} ${isCreatingNew ? 'created' : 'updated'} successfully!`, 'success');
      closeModal();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Application Manager</h1>
            <p className="text-lg text-gray-600 mt-2">Manage and sync your subscription applications with Stripe</p>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Applications ({applications.length})</h2>
                  <p className="text-violet-100 mt-1">Click sync to connect with Stripe</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="px-6 py-2 bg-white text-violet-700 font-bold rounded shadow-lg hover:shadow-xl 
                             hover:bg-gray-50 transition-all flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" /> Add Application
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="p-8">
              {isLoading ? (
                <div className="text-center py-20">
                  {/* <Loader2 className="w-12 h-12 text-violet-600 mx-auto mb-4" /> */}
                  <p className="text-gray-600 text-lg">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl">No applications yet</p>
                  <button onClick={openCreateModal} className="mt-4 text-violet-600 font-medium hover:underline">
                    Create your first one
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {applications.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 rounded p-6 border border-gray-200 hover:border-violet-300 
                                 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                          <p className="text-sm text-gray-500">ID: {app.id}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-2.5 bg-white rounded shadow hover:shadow-md transition"
                          >
                            <Edit className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleSyncStripe(app)}
                            disabled={isSubmitting}
                            className="p-2.5 bg-violet-100 rounded hover:bg-violet-200 transition disabled:opacity-50"
                          >
                            <RefreshCw className="w-5 h-5 text-violet-600" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded p-4 font-mono text-sm">
                        <span className="text-gray-500">Stripe ID:</span>{' '}
                        <span className={app.stripeProductId ? 'text-green-600' : 'text-gray-400'}>
                          {app.stripeProductId || 'Not synced'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        title={isCreatingNew ? 'Create New Application' : 'Edit Application'}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create Application' : 'Save Changes')}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Application Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Loyalty Pro"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stripe Product ID (Optional)</label>
            <input
              type="text"
              name="stripeProductId"
              value={form.stripeProductId}
              onChange={handleChange}
              placeholder="prod_xxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-2">Will be auto-filled when you sync with Stripe</p>
          </div>
        </div>
      </Modal>

      <ToastNotification message={toastMessage} type={toastType} isVisible={isToastVisible} />
    </>
  );
};

export default ApplicationManager;