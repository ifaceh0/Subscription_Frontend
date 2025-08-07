import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

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
  const [planToDelete, setPlanToDelete] = useState(null);
  const [planToSync, setPlanToSync] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    fetchPlanTypes();
  }, []);

  useEffect(() => {
    if (selectedApps.length > 0) {
      fetchPlans(selectedApps);
    } else {
      setPlans([]);
      setCurrentPage(1);
    }
  }, [selectedApps]);

  const fetchApplications = async () => {
    try {
      const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        toast.error('Failed to fetch applications.');
      }
    } catch (error) {
      toast.error('Error fetching applications.');
    }
  };

  const fetchPlanTypes = async () => {
    try {
      const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/plan-types');
      if (res.ok) {
        const data = await res.json();
        setPlanTypes(data);
      } else {
        toast.error('Failed to fetch plan types.');
      }
    } catch (error) {
      toast.error('Error fetching plan types.');
    }
  };

  const fetchPlans = async (appNames) => {
    try {
      const query = appNames.map(name => `appNames=${encodeURIComponent(name)}`).join('&');
      const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/plans?${query}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Raw API Response:', data);
        const filteredPlans = data.filter(plan => {
          if (plan.deleted) return false;
          const planAppNames = plan.applications ? plan.applications.map(a => a.name).sort() : [];
          const selectedAppNames = [...appNames].sort();
          console.log('Plan App Names:', planAppNames, 'Selected App Names:', selectedAppNames);
          return (
            planAppNames.length === selectedAppNames.length &&
            planAppNames.every(name => selectedAppNames.includes(name))
          );
        });
        console.log('Filtered Plans:', filteredPlans);
        setPlans(filteredPlans);
        setCurrentPage(1);
      } else {
        toast.error('Failed to fetch plans.');
      }
    } catch (error) {
      toast.error('Error fetching plans.');
    }
  };

  // const handleStripeSync = async (planId) => {
  //   setIsLoading(true);
  //   try {
  //     const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/sync-stripe-price/${planId}`, {
  //       method: 'POST',
  //     });
      
  //     if (res.ok) {
  //       const updatedPlan = await res.json();
  //       toast.success('Stripe sync successful');
  //       // Optional: update the local plans state if needed
  //       setPlans(prev => prev.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
        
  //       // Redirect immediately
  //       navigate('/admin');
  //     } else {
  //       toast.error('Failed to sync with Stripe.');
  //     }
  //   } catch (error) {
  //     toast.error('Error syncing with Stripe.');
  //   } finally {
  //     setIsLoading(false);
  //     setIsSyncModalOpen(false);
  //     setPlanToSync(null);
  //   }
  // };
  const handleStripeSync = async (planId) => {
  setIsLoading(true);
  try {
    const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/sync-stripe-price/${planId}`, {
      method: 'POST',
    });

    const responseData = await res.json().catch(() => ({}));

    if (res.ok && responseData.status === 'success' && responseData.data) {
      const updatedPlan = responseData.data;
      if (!updatedPlan.id) {
        toast.error('Invalid plan data received from server.');
        return;
      }
      toast.success('Stripe sync successful');
      setPlans(prev => prev.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
      navigate('/admin');
    } else {
      toast.error(responseData.error || 'Failed to sync with Stripe.');
    }
  } catch (error) {
    toast.error('Error syncing with Stripe: ' + error.message);
  } finally {
    setIsLoading(false);
    setIsSyncModalOpen(false);
    setPlanToSync(null);
  }
};

  const handleDeletePlan = async (planId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://subscription-backend-e8gq.onrender.com/api/admin/plans/${planId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        setPlans(prev => prev.filter(p => p.id !== planId));
        setCurrentPage(1);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      toast.error('Error deleting plan.');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
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

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsSyncModalOpen(false);
    setPlanToDelete(null);
    setPlanToSync(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAppChange = (appName) => {
    const updatedApps = selectedApps.includes(appName)
      ? selectedApps.filter(name => name !== appName)
      : [...selectedApps, appName];
    setSelectedApps(updatedApps);
    setForm({
      ...form,
      applicationIds: updatedApps.map(name => applications.find(app => app.name === name)?.id).filter(id => id),
    });
  };

  const isMonthlyPlan = () => {
    const selectedPlan = planTypes.find(pt => pt.id === parseInt(form.planTypeMappingId));
    return selectedPlan && selectedPlan.interval.toLowerCase() === 'monthly';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.applicationIds.length || !form.planTypeMappingId) {
      toast.error('All required fields must be filled.');
      return;
    }

    if (selectedApps.length === 1 && isMonthlyPlan() && !form.monthlyBasePrice) {
      toast.error('Monthly base price is required for a single application monthly plan.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://subscription-backend-e8gq.onrender.com/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyBasePrice: selectedApps.length === 1 && isMonthlyPlan() ? parseFloat(form.monthlyBasePrice) : null,
          discountPercent: form.discountPercent ? parseFloat(form.discountPercent) : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Plan created successfully.');
        setPlans([...plans, data]);
        setForm({
          id: '',
          applicationIds: [],
          planTypeMappingId: '',
          monthlyBasePrice: '',
          discountPercent: '',
          stripePriceId: '',
        });
        setSelectedApps([]);
        setCurrentPage(1);
        if (selectedApps.length) {
          fetchPlans(selectedApps);
        }
      } else {
        toast.error('Failed to create plan.');
      }
    } catch (error) {
      toast.error('Error creating plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPlanType = (planType) => {
    return planType.planName && planType.interval
      ? `${planType.planName} (${planType.interval})`
      : planType.planName || `Plan ${planType.id}`;
  };

  const indexOfLastPlan = currentPage * itemsPerPage;
  const indexOfFirstPlan = indexOfLastPlan - itemsPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl">
        <nav className="bg-blue-600 text-white p-4 mb-6 w-full rounded-t-xl">
          <h2 className="text-2xl font-bold text-center">Manage Subscription Plans</h2>
        </nav>
        <div className="p-6"> {/* Added padding inside a wrapper div */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Applications</label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                {applications.map(app => (
                  <div key={app.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`app-${app.id}`}
                      value={app.name}
                      checked={selectedApps.includes(app.name)}
                      onChange={() => handleAppChange(app.name)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`app-${app.id}`} className="ml-2 text-sm text-gray-600">{app.name}</label>
                  </div>
                ))}
              </div>
              {selectedApps.length === 0 && (
                <p className="text-red-500 text-sm mt-2">At least one application is required.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
              <select
                name="planTypeMappingId"
                value={form.planTypeMappingId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                <option value="">Select Plan Type</option>
                {planTypes.map(planType => (
                  <option key={planType.id} value={planType.id}>
                    {formatPlanType(planType)}
                  </option>
                ))}
              </select>
            </div>
            {selectedApps.length === 1 && isMonthlyPlan() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Base Price (USD)</label>
                <input
                  type="number"
                  name="monthlyBasePrice"
                  value={form.monthlyBasePrice}
                  step="0.01"
                  placeholder="Enter monthly base price"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={form.discountPercent}
                step="0.1"
                placeholder="Enter discount percentage"
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full md:w-auto px-6 py-3 text-white rounded-md ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isLoading ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </form>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Subscription Plans</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-50 text-gray-700">
                  <th className="p-4 text-left text-sm font-medium">Applications</th>
                  <th className="p-4 text-left text-sm font-medium">Plan Type</th>
                  <th className="p-4 text-left text-sm font-medium">Monthly Base Price</th>
                  <th className="p-4 text-left text-sm font-medium">Calculated Price</th>
                  <th className="p-4 text-left text-sm font-medium">Discount</th>
                  <th className="p-4 text-left text-sm font-medium">Final Price</th>
                  <th className="p-4 text-left text-sm font-medium">Stripe Price ID</th>
                  <th className="p-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.map((plan, index) => {
                  const appNames = plan.applications
                    ? plan.applications.map(a => a.name).join(', ')
                    : 'Unknown';
                  const planType = planTypes.find(pt => pt.id === plan.plan.id);
                  return (
                    <tr key={plan.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                      <td className="p-4 text-sm text-gray-600">{appNames}</td>
                      <td className="p-4 text-sm text-gray-600">{planType ? formatPlanType(planType) : `Plan ${plan.id}`}</td>
                      <td className="p-4 text-sm text-gray-600">${(plan.monthlyBasePrice ?? 0).toFixed(2)}</td>
                      <td className="p-4 text-sm text-gray-600">${(plan.calculatedPrice ?? 0).toFixed(2)}</td>
                      <td className="p-4 text-sm text-gray-600">{plan.discountPercent ? `${plan.discountPercent}%` : '0%'}</td>
                      <td className="p-4 text-sm font-semibold text-gray-800">${(plan.discountedPrice ?? 0).toFixed(2)}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {plan.syncing ? (
                          <span className="text-gray-500">Syncing...</span>
                        ) : plan.stripePriceId ? (
                          <span>{plan.stripePriceId}</span>
                        ) : (
                          <button
                            className={`px-3 py-1 text-white text-sm rounded-md ${
                              isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            } transition-colors`}
                            onClick={() => openSyncModal(plan.id)}
                            disabled={isLoading}
                          >
                            Sync to Stripe
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          className={`px-3 py-1 text-white text-sm rounded-md ${
                            isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                          } transition-colors`}
                          onClick={() => openDeleteModal(plan.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {plans.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No plans available for the selected applications.</p>
            )}
          </div>

          {plans.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`px-4 py-2 text-sm rounded-md ${
                  currentPage === 1 || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`px-4 py-2 text-sm rounded-md ${
                  currentPage === totalPages || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this plan? This action will mark the plan as deleted and may affect active subscriptions.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 text-white rounded-md ${
                      isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                    } transition-colors`}
                    onClick={() => handleDeletePlan(planToDelete)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isSyncModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Stripe Sync</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to sync this plan with Stripe? This will create or update the plan in Stripe.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 text-white rounded-md ${
                      isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    } transition-colors`}
                    onClick={() => handleStripeSync(planToSync)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Syncing...' : 'Sync'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPlanManager;