// import React, { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';

// // Reuse your existing SVG icons style
// const Save = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
//     <path d="M17 21v-8H7v8" />
//     <path d="M7 3v5h8" />
//   </svg>
// );

// const Loader2 = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//        className="animate-spin">
//     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//   </svg>
// );

// // Toast Notification (reused from your ApplicationManager)
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

// // Modal (reused from your ApplicationManager)
// const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//           <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M18 6 6 18" /><path d="m6 6 12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="p-6">{children}</div>

//         {onSubmit && (
//           <div className="flex justify-end gap-4 px-6 py-5 border-t border-gray-100 bg-gray-50">
//             <button
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onSubmit}
//               disabled={isSubmitting}
//               className="px-8 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 
//                          disabled:opacity-60 flex items-center gap-2 transition shadow-md"
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

// const TrialDaysSettingsPage = () => {
//   const [value, setValue] = useState('0');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('success');
//   const [isToastVisible, setIsToastVisible] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

//   const showToast = useCallback((message, type = 'success', duration = 4000) => {
//     setIsToastVisible(false);
//     setTimeout(() => {
//       setToastMessage(message);
//       setToastType(type);
//       setIsToastVisible(true);
//     }, 100);
//     clearTimeout(window.trialToastTimer);
//     window.trialToastTimer = setTimeout(() => setIsToastVisible(false), duration);
//   }, []);

//   useEffect(() => {
//     loadSetting();
//   }, []);

//   const loadSetting = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/admin/getTrail/subscription.trial-days`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });

//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

//       const data = await res.json();
//       setValue(data.value || '0');
//       setDescription(data.description || '');
//       showToast(`Loaded: ${data.value || '0'} days`, 'success');
//     } catch (err) {
//       console.error('Failed to load trial setting:', err);
//       showToast('Failed to load trial setting', 'error');
//       setValue('0');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     const num = parseInt(value.trim(), 10);
//     if (isNaN(num) || num < 0 || num > 730) {
//       showToast('Please enter a number between 0 and 730', 'error');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         key: 'subscription.trial-days',
//         value: num.toString(),
//         description: description.trim() || 'Global trial period in days for first-time subscribers (0 = disabled)',
//       };

//       const res = await fetch(`${API_BASE_URL}/api/admin/updateTrail`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData.message || `HTTP error! Status: ${res.status}`);
//       }

//       showToast(`Trial period updated to ${num} days`, 'success');
//       loadSetting(); // refresh
//       setIsEditModalOpen(false);
//     } catch (err) {
//       console.error('Failed to save trial setting:', err);
//       showToast(err.message || 'Failed to save trial setting', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const openEditModal = () => setIsEditModalOpen(true);
//   const closeModal = () => setIsEditModalOpen(false);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-spin" />
//           <p className="text-gray-600 text-lg">Loading trial configuration...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="max-w-5xl mx-auto px-6 py-12">
//           {/* Header */}
//           <div className="mb-10">
//             <h1 className="text-4xl font-bold text-gray-900">Trial Period Settings</h1>
//             <p className="text-lg text-gray-600 mt-2">
//               Configure the global free trial duration for all first-time subscribers
//             </p>
//           </div>

//           {/* Main Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
//           >
//             {/* Card Header */}
//             <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-5 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-2xl font-bold">Global Trial Duration</h2>
//                   <p className="text-violet-100 mt-1">Applies to all plans • First-time users only</p>
//                 </div>
//                 <button
//                   onClick={openEditModal}
//                   className="px-6 py-2.5 bg-white text-violet-700 font-bold rounded-lg shadow-lg 
//                              hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2"
//                 >
//                   <Save className="w-5 h-5" /> Edit Trial Days
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-8">
//               <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">Current Trial Period</h3>
//                     <p className="text-sm text-gray-500 mt-1">Applies automatically on first subscription</p>
//                   </div>
//                   <div className="text-4xl font-bold text-violet-700">
//                     {value} <span className="text-2xl font-medium">days</span>
//                   </div>
//                 </div>

//                 <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded border border-gray-200">
//                   <strong>Note:</strong> Set to <strong>0</strong> to disable free trials completely.
//                   Maximum allowed value is 730 days (~2 years).
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={closeModal}
//         title="Configure Global Trial Period"
//         onSubmit={handleSave}
//         submitButtonText={saving ? 'Saving...' : 'Save Trial Duration'}
//         isSubmitting={saving}
//       >
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Trial Duration (days)
//             </label>
//             <input
//               type="number"
//               min="0"
//               max="730"
//               value={value}
//               onChange={(e) => setValue(e.target.value)}
//               placeholder="e.g. 14, 30, 60"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
//                          focus:ring-violet-500 focus:border-violet-500 outline-none transition"
//             />
//             <p className="text-xs text-gray-500 mt-2">
//               0 = No trial • Recommended: 0–90 days
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description (optional, for admin reference)
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Global trial period in days for first-time subscribers (0 = disabled)"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
//                          focus:ring-violet-500 focus:border-violet-500 outline-none transition min-h-[100px]"
//             />
//           </div>
//         </div>
//       </Modal>

//       <ToastNotification 
//         message={toastMessage} 
//         type={toastType} 
//         isVisible={isToastVisible} 
//       />
//     </>
//   );
// };

// export default TrialDaysSettingsPage;










import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader, Save } from 'lucide-react';

const ToastNotification = ({ message, type, isVisible }) => {
  if (!isVisible) return null;
  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-rose-600';
  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3.5 rounded-lg shadow-xl text-white font-medium z-50 
                     transition-all duration-300 ${bg}`}>
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
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded-full transition text-slate-500 hover:text-slate-700"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
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
    </div>
  );
};

const TrialDaysSettingsPage = () => {
  const [value, setValue] = useState('0');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const showToast = useCallback((message, type = 'success', duration = 3800) => {
    setIsToastVisible(false);
    setTimeout(() => {
      setToastMessage(message);
      setToastType(type);
      setIsToastVisible(true);
    }, 80);
    clearTimeout(window.trialToastTimer);
    window.trialToastTimer = setTimeout(() => setIsToastVisible(false), duration);
  }, []);

  useEffect(() => {
    loadSetting();
  }, []);

  const loadSetting = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/getTrail/subscription.trial-days`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);

      const data = await res.json();
      setValue(data.value || '0');
      setDescription(data.description || '');
      showToast(`Current trial: ${data.value || '0'} days`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to load trial setting', 'error');
      setValue('0');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const num = parseInt(value.trim(), 10);
    if (isNaN(num) || num < 0 || num > 730) {
      showToast('Value must be 0–730 days', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        key: 'subscription.trial-days',
        value: num.toString(),
        description: description.trim() || 'Global trial period in days for first-time subscribers (0 = disabled)',
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/updateTrail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Status: ${res.status}`);
      }

      showToast(`Trial updated to ${num} days`, 'success');
      loadSetting();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-slate-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Loading configuration…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50/70">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-900">Trial Period</h1>
            <p className="mt-2 text-slate-600">
              Set the default free trial duration offered to new subscribers
            </p>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Free Trial Duration</h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Applies automatically to first-time subscriptions only
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Edit Settings
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Current Setting</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Duration offered on first subscription
                    </p>
                  </div>
                  <div className="text-5xl font-bold text-slate-800 tabular-nums">
                    {value}
                    <span className="text-2xl font-medium text-slate-500 ml-1">days</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 text-sm text-slate-600">
                  <strong>Tip:</strong> Use <strong>0</strong> to disable free trials for all new users.<br />
                  Recommended range: 0–90 days. Maximum: 730 days (≈2 years).
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Trial Period"
        onSubmit={handleSave}
        submitButtonText={saving ? 'Saving…' : 'Save Changes'}
        isSubmitting={saving}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Trial Duration (days)
            </label>
            <input
              type="number"
              min="0"
              max="730"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="14, 30, 60…"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition disabled:opacity-60"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              0 = disabled • Suggested: 0–90 days
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Internal Note / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Global trial period in days for first-time subscribers (0 = disabled)"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition resize-none"
            />
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

export default TrialDaysSettingsPage;