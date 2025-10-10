import React, { useState, useEffect, useCallback } from 'react';

const Plus = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const X = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const Edit = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
    </svg>
);

const Loader2 = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const ToastNotification = ({ message, type, isVisible }) => {
    if (!isVisible || !message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white font-semibold transition-all duration-300 transform z-50 max-w-sm";
    const typeClasses = {
        success: "bg-green-600",
        error: "bg-red-600",
    };
    const finalClasses = `${baseClasses} ${typeClasses[type] || 'bg-gray-800'}`;

    return (
        <div 
            className={finalClasses}
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
            aria-live="polite"
        >
            {message}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children, onSubmit, submitButtonText, isSubmitting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className="text-2xl font-extrabold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="py-6">
                    {children}
                </div>
                {(onSubmit && submitButtonText) && (
                    <div className="pt-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="mr-3 px-6 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center active:scale-95"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 mr-2" />
                            ) : null}
                            {submitButtonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
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

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        clearTimeout(window.currentToastTimer);
        setIsToastVisible(false);
        setToastMessage(message);
        setToastType(type);
        setIsToastVisible(true);
        window.currentToastTimer = setTimeout(() => {
            setIsToastVisible(false);
            setToastMessage('');
        }, duration);
    }, []);

    const API_BASE_URL = 'https://subscription-backend-e8gq.onrender.com/api/admin';

    useEffect(() => {
        const fetchPlanTypes = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/plan-types`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch plan types');
                }
                const data = await response.json();
                setPlanTypes(data);
            } catch (error) {
                showToast(`Error: ${error.message}`, 'error');
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
        setForm({ id: null, planName: '', description: '', interval: 'Monthly', monthCount: 1 });
    };

    const handleIntervalChange = (e) => {
        const newInterval = e.target.value;
        let newMonthCount;
        switch (newInterval) {
            case 'Monthly':
                newMonthCount = 1;
                break;
            case 'Quarterly':
                newMonthCount = 3;
                break;
            case 'Yearly':
                newMonthCount = 12;
                break;
            default:
                newMonthCount = 1;
        }
        setForm(prev => ({ 
            ...prev, 
            interval: newInterval, 
            monthCount: newMonthCount 
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.planName.trim() || !form.description.trim()) {
            showToast('Plan Name and Description are required.', 'error');
            return;
        }
        if (!form.monthCount || form.monthCount <= 0) {
            showToast('Month Count must be a positive number.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const trimmedName = form.planName.trim();
            const payload = { 
                planName: trimmedName, 
                description: form.description.trim(),
                interval: form.interval,
                monthCount: parseInt(form.monthCount),
            };

            if (isCreatingNew) {
                const response = await fetch(`${API_BASE_URL}/createPlanType`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create plan type');
                }
               Helen
                const result = await response.json();
                const newPlan = result.data;
                setPlanTypes(prev => [...prev, newPlan]);
                showToast(result.message || `Plan Type "${newPlan.planName}" created successfully.`, 'success');
            } else {
                const response = await fetch(`${API_BASE_URL}/updatePlanType/${form.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update plan type');
                }
                const result = await response.json();
                const updatedPlan = result.data;
                setPlanTypes(prev => prev.map(plan => plan.id === form.id ? updatedPlan : plan));
                showToast(result.message || `Plan Type "${updatedPlan.planName}" updated successfully.`, 'success');
            }
            closeModal();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            {/* Header */}
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Subscription Plan Type Manager</h1>
                <p className="text-gray-500 mt-1">Define the pricing frequency and naming conventions for subscriptions.</p>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Defined Plan Types ({planTypes.length})</h2>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Plan Type
                    </button>
                </div>

                {/* Data Table */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-48 text-indigo-600">
                        <Loader2 className="w-8 h-8" />
                        <span className="ml-3 text-lg">Loading Plan Types...</span>
                    </div>
                ) : planTypes.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg bg-gray-50">
                        No plan types defined. Start by adding a new one.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Plan Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Interval</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Months</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {planTypes.map(plan => (
                                    <tr key={plan.id} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">{plan.planName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{plan.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {plan.interval}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{plan.monthCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => openEditModal(plan)}
                                                className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors active:scale-95"
                                                title="Edit Plan Type"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                title={isCreatingNew ? 'Create New Plan Type' : `Edit Plan Type: ${form.planName}`}
                onSubmit={handleSubmit}
                submitButtonText={isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create Plan Type' : 'Save Changes')}
                isSubmitting={isSubmitting}
            >
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div>
                        <label htmlFor="planName" className="block text-sm font-medium text-gray-700">Plan Name *</label>
                        <input
                            type="text"
                            id="planName"
                            name="planName"
                            value={form.planName}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 'Starter' or 'Pro Plus'"
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="2"
                            value={form.description}
                            onChange={handleChange}
                            required
                            placeholder="Briefly describe the features and tier."
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="interval" className="block text-sm font-medium text-gray-700">Billing Interval *</label>
                            <select
                                id="interval"
                                name="interval"
                                value={form.interval}
                                onChange={handleIntervalChange}
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
                            >
                                {intervals.map(int => (
                                    <option key={int} value={int}>{int}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="monthCount" className="block text-sm font-medium text-gray-700">Month Count *</label>
                            <input
                                type="number"
                                id="monthCount"
                                name="monthCount"
                                value={form.monthCount}
                                onChange={handleChange}
                                min="1"
                                required
                                disabled={intervals.includes(form.interval)}
                                className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 sm:text-sm ${intervals.includes(form.interval) ? 'bg-gray-100' : 'bg-white focus:ring-indigo-500 focus:border-indigo-500'}`}
                            />
                            {intervals.includes(form.interval) && <p className="mt-1 text-xs text-gray-500">Auto-set by selected interval.</p>}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Custom Toast Notification */}
            <ToastNotification message={toastMessage} type={toastType} isVisible={isToastVisible} />
        </div>
    );
};

export default PlanTypeManager;