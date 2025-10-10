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
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
    </svg>
);

const Loader2 = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const RefreshCw = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
    </svg>
);

const ToastNotification = ({ message, type, isVisible }) => {
    if (!isVisible || !message) return null;
    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white font-semibold transition-all duration-300 transform z-50 max-w-sm";
    const typeClasses = { success: "bg-green-600", error: "bg-red-600" };
    return (
        <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-800'}`}
             style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
            {message}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className="text-2xl font-extrabold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="py-6">{children}</div>
                {onSubmit && (
                    <div className="pt-4 border-t border-gray-200 flex justify-end">
                        <button onClick={onClose} className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
                                disabled={isSubmitting}>Cancel</button>
                        <button onClick={onSubmit}
                                className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
                                disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-5 h-5 mr-2" />} {submitButtonText}
                        </button>
                    </div>
                )}
            </div>
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

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        clearTimeout(window.currentToastTimer);
        setIsToastVisible(false);
        setToastMessage(message);
        setToastType(type);
        setIsToastVisible(true);
        window.currentToastTimer = setTimeout(() => setIsToastVisible(false), duration);
    }, []);

    const API_BASE_URL = 'https://subscription-backend-e8gq.onrender.com/api/admin';

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_BASE_URL}/applications`);
                if (!res.ok) throw new Error('Failed to fetch applications');
                setApplications(await res.json());
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, [showToast]);

    const handleSyncStripe = async (app) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/sync-stripe-app`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(app),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to sync');
            setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stripeProductId: result.stripeProductId } : a));
            showToast(result.message || `${app.name} synced with Stripe.`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => { setIsCreatingNew(true); setForm({ id: null, name: '', stripeProductId: '' }); setIsEditModalOpen(true); };
    const openEditModal = (app) => { setIsCreatingNew(false); setForm({ ...app }); setIsEditModalOpen(true); };
    const closeModal = () => { setIsEditModalOpen(false); setForm({ id: null, name: '', stripeProductId: '' }); };
    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        if (!form.name.trim()) return showToast('Application Name is required.', 'error');
        setIsSubmitting(true);
        try {
            const payload = { name: form.name.trim(), stripeProductId: form.stripeProductId || null };
            const url = isCreatingNew ? `${API_BASE_URL}/createApp` : `${API_BASE_URL}/updateApp/${form.id}`;
            const method = isCreatingNew ? 'POST' : 'PUT';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to save');
            const savedApp = result.data;
            setApplications(prev => isCreatingNew ? [...prev, savedApp] : prev.map(a => a.id === savedApp.id ? savedApp : a));
            showToast(result.message || `Application ${savedApp.name} saved successfully.`, 'success');
            closeModal();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Application Manager</h1>
                <p className="text-gray-500 mt-1">Configure core product applications for subscription mapping.</p>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Available Applications ({applications.length})</h2>
                    <div className="flex space-x-3">
                        <button onClick={openCreateModal}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 flex items-center">
                            <Plus className="w-5 h-5 mr-2" /> Add New Application
                        </button>
                        <button onClick={() => applications.forEach(handleSyncStripe)}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 flex items-center"
                                disabled={isSubmitting || isLoading}>
                            <RefreshCw className="w-5 h-5 mr-2" /> {isSubmitting ? 'Syncing...' : 'Sync All with Stripe'}
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48 text-indigo-600">
                        <Loader2 className="w-8 h-8" /><span className="ml-3 text-lg">Loading Applications...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stripe Product ID</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sync</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map(app => (
                                    <tr key={app.id} className="hover:bg-indigo-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-indigo-700">{app.name}</td>
                                        <td className="px-6 py-4 text-xs text-gray-600 font-mono">{app.stripeProductId || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openEditModal(app)}
                                                    className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleSyncStripe(app)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                                                    disabled={isSubmitting}>
                                                <RefreshCw className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                title={isCreatingNew ? 'Create New Application' : `Edit Application: ${form.name}`}
                onSubmit={handleSubmit}
                submitButtonText={isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create' : 'Save Changes')}
                isSubmitting={isSubmitting}
            >
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Application Name *</label>
                        <input type="text" id="name" name="name" value={form.name} onChange={handleChange}
                               required placeholder="e.g., 'Loyalty Engine'"
                               className="mt-1 block w-full border rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="stripeProductId" className="block text-sm font-medium text-gray-700">Stripe Product ID</label>
                        <input type="text" id="stripeProductId" name="stripeProductId" value={form.stripeProductId}
                               onChange={handleChange} placeholder="e.g., 'prod_XYZ123'"
                               className="mt-1 block w-full border rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 font-mono"/>
                        <p className="mt-1 text-xs text-gray-500">Must be unique across all applications.</p>
                    </div>
                </form>
            </Modal>

            <ToastNotification message={toastMessage} type={toastType} isVisible={isToastVisible} />
        </div>
    );
};

export default ApplicationManager;