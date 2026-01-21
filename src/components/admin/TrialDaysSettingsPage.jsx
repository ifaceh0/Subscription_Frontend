// // src/pages/admin/TrialDaysSettingsPage.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   CircularProgress,
//   Alert,
//   Box,
//   Divider,
//   InputAdornment,
// } from '@mui/material';
// import SaveIcon from '@mui/icons-material/Save';
// import RefreshIcon from '@mui/icons-material/Refresh';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const TRIAL_KEY = 'subscription.trial-days';

// const TrialDaysSettingsPage = () => {
//   const [value, setValue] = useState('0');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [feedback, setFeedback] = useState({ severity: 'info', message: '' });

//   useEffect(() => {
//     loadSetting();
//   }, []);

//   const loadSetting = async () => {
//     setLoading(true);
//     setFeedback({ severity: 'info', message: '' });

//     try {
//       const token = localStorage.getItem('token') || '';

//       const response = await fetch(`${API_BASE_URL}/api/admin/getTrail/${TRIAL_KEY}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//         credentials: 'same-origin', 
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       setValue(data.value || '0');
//       setDescription(data.description || '');
//       setFeedback({
//         severity: 'success',
//         message: `Loaded: ${data.value || '0'} days`,
//       });
//     } catch (err) {
//       console.error('Failed to load trial days setting:', err);
//       setFeedback({
//         severity: 'error',
//         message: 'Failed to load trial days setting',
//       });
//       setValue('0');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     const num = parseInt(value, 10);

//     if (isNaN(num) || num < 0 || num > 730) {
//       setFeedback({
//         severity: 'error',
//         message: 'Please enter a number between 0 and 730',
//       });
//       return;
//     }

//     setSaving(true);
//     setFeedback({ severity: 'info', message: '' });

//     try {
//       const token = localStorage.getItem('token') || '';

//       const payload = {
//         key: TRIAL_KEY,
//         value: num.toString(),
//         description:
//           description ||
//           'Global trial period in days for first-time subscribers (0 = disabled)',
//       };

//       const response = await fetch(`${API_BASE_URL}/api/admin/updateTrail`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         credentials: 'same-origin',
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `HTTP error! Status: ${response.status}`
//         );
//       }

//       setFeedback({
//         severity: 'success',
//         message: `Trial period updated to ${num} days`,
//       });

//       // Refresh after successful save
//       loadSetting();
//     } catch (err) {
//       console.error('Failed to save trial days setting:', err);
//       setFeedback({
//         severity: 'error',
//         message: err.message || 'Failed to save setting',
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ py: 6 }}>
//       <Paper elevation={4} sx={{ p: 5, borderRadius: 2 }}>
//         <Typography variant="h4" gutterBottom fontWeight="bold">
//           Global Free Trial Configuration
//         </Typography>

//         <Typography variant="body1" color="text.secondary" paragraph>
//           This value applies the same trial duration to <strong>all first-time users</strong> across
//           every plan. Only admins can modify this setting.
//         </Typography>

//         <Alert severity="info" sx={{ mb: 4 }}>
//           0 = No trial | Recommended range: 0–90 days | Max allowed: 730 days
//         </Alert>

//         <Divider sx={{ my: 4 }} />

//         {feedback.message && (
//           <Alert
//             severity={feedback.severity}
//             sx={{ mb: 4 }}
//             onClose={() => setFeedback({ severity: 'info', message: '' })}
//           >
//             {feedback.message}
//           </Alert>
//         )}

//         <Box component="form" noValidate>
//           <TextField
//             fullWidth
//             label="Trial Duration (days)"
//             type="number"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             InputProps={{
//               startAdornment: <InputAdornment position="start">Days</InputAdornment>,
//               inputProps: { min: 0, max: 730 },
//             }}
//             helperText="Number of days for the free trial (0 disables trial)"
//             variant="outlined"
//             margin="normal"
//             disabled={saving}
//           />

//           <TextField
//             fullWidth
//             label="Description (optional)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Global trial period in days for first-time subscribers (0 = disabled)"
//             variant="outlined"
//             margin="normal"
//             multiline
//             rows={2}
//             disabled={saving}
//           />

//           <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//             <Button
//               variant="outlined"
//               startIcon={<RefreshIcon />}
//               onClick={loadSetting}
//               disabled={saving}
//             >
//               Refresh
//             </Button>

//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
//               onClick={handleSave}
//               disabled={saving}
//             >
//               {saving ? 'Saving...' : 'Save Trial Setting'}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default TrialDaysSettingsPage;





// src/pages/admin/TrialDaysSettingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// Reuse your existing SVG icons style
const Save = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);

const Loader2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// Toast Notification (reused from your ApplicationManager)
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

// Modal (reused from your ApplicationManager)
const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">{children}</div>

        {onSubmit && (
          <div className="flex justify-end gap-4 px-6 py-5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 
                         disabled:opacity-60 flex items-center gap-2 transition shadow-md"
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

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    setIsToastVisible(false);
    setTimeout(() => {
      setToastMessage(message);
      setToastType(type);
      setIsToastVisible(true);
    }, 100);
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
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setValue(data.value || '0');
      setDescription(data.description || '');
      showToast(`Loaded: ${data.value || '0'} days`, 'success');
    } catch (err) {
      console.error('Failed to load trial setting:', err);
      showToast('Failed to load trial setting', 'error');
      setValue('0');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const num = parseInt(value.trim(), 10);
    if (isNaN(num) || num < 0 || num > 730) {
      showToast('Please enter a number between 0 and 730', 'error');
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
        throw new Error(errData.message || `HTTP error! Status: ${res.status}`);
      }

      showToast(`Trial period updated to ${num} days`, 'success');
      loadSetting(); // refresh
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to save trial setting:', err);
      showToast(err.message || 'Failed to save trial setting', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => setIsEditModalOpen(true);
  const closeModal = () => setIsEditModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading trial configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Trial Period Settings</h1>
            <p className="text-lg text-gray-600 mt-2">
              Configure the global free trial duration for all first-time subscribers
            </p>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Global Trial Duration</h2>
                  <p className="text-violet-100 mt-1">Applies to all plans • First-time users only</p>
                </div>
                <button
                  onClick={openEditModal}
                  className="px-6 py-2.5 bg-white text-violet-700 font-bold rounded-lg shadow-lg 
                             hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" /> Edit Trial Days
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Current Trial Period</h3>
                    <p className="text-sm text-gray-500 mt-1">Applies automatically on first subscription</p>
                  </div>
                  <div className="text-4xl font-bold text-violet-700">
                    {value} <span className="text-2xl font-medium">days</span>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded border border-gray-200">
                  <strong>Note:</strong> Set to <strong>0</strong> to disable free trials completely.
                  Maximum allowed value is 730 days (~2 years).
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        title="Configure Global Trial Period"
        onSubmit={handleSave}
        submitButtonText={saving ? 'Saving...' : 'Save Trial Duration'}
        isSubmitting={saving}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trial Duration (days)
            </label>
            <input
              type="number"
              min="0"
              max="730"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 14, 30, 60"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-violet-500 focus:border-violet-500 outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-2">
              0 = No trial • Recommended: 0–90 days
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional, for admin reference)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Global trial period in days for first-time subscribers (0 = disabled)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-violet-500 focus:border-violet-500 outline-none transition min-h-[100px]"
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