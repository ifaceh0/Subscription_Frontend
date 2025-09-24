import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, DollarSign, RefreshCw, Package, PlusCircle } from "lucide-react";

const SubscriptionDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [error, setError] = useState(location.state?.successMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
  const [selectedCancelApps, setSelectedCancelApps] = useState([]);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.successMessage);
  const [showChangePlanSelectionModal, setShowChangePlanSelectionModal] = useState(false);
  const [selectedChangePlanApps, setSelectedChangePlanApps] = useState([]);
  const [showAddProductSelectionModal, setShowAddProductSelectionModal] = useState(false);
  const [selectedAddProductApps, setSelectedAddProductApps] = useState([]);
  const [availableApps, setAvailableApps] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

  const fetchSubscriptionDetails = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      if (data.subscriptions && data.subscriptions.length > 0) {
        setSubscriptions(data.subscriptions);
        localStorage.setItem("subscriptions", JSON.stringify(data.subscriptions));
      } else {
        setError("No subscription found for this account.");
      }
      setAvailablePlans(data.plans || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load subscription details: ${err.message}`);
    }

    try {
      const response = await fetch(`${API_URL}/api/subscription/unsubscribed-plans?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      const uniqueApps = [...new Set(data.flatMap(plan => plan.applicationNames || []))];
      setAvailableApps(uniqueApps);
    } catch (err) {
      console.error("Fetch unsubscribed plans error:", err);
      setError(`Failed to load available applications: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const sessionId = params.get("session_id");
    const changePlan = params.get("change_plan");

    if (email) {
      localStorage.setItem("CompanyEmail", email);
    }

    if (sessionId && changePlan === "true") {
      setShowSuccessModal(true);
      setError("Plan change scheduled successfully. You will receive a confirmation email soon.");
    }

    const storedEmail = localStorage.getItem("CompanyEmail");

    if (storedEmail) {
      fetchSubscriptionDetails(storedEmail);
    } else {
      setError("No email found. Please sign in again.");
    }
  }, [navigate, location]);

  useEffect(() => {
    if (error && error !== "No email found. Please sign in again.") {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price, interval = "monthly") => {
    if (price == null) return "N/A";
    if (interval === "monthly") return `$${parseFloat(price).toFixed(2)} /month`;
    if (interval === "quarterly") return `$${parseFloat(price).toFixed(2)} /quarter`;
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getActiveApplications = () => {
    return [
      ...new Set(
        subscriptions
          .filter(sub => sub.status !== "CANCELLED")
          .flatMap(sub => sub.applications.map(app => app.name) || [])
      ),
    ];
  };

  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After") || delay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  const handleCancelSelection = () => {
    if (selectedCancelApps.length === 0) {
      setError("Please select at least one application to cancel.");
      return;
    }
    setShowCancelSelectionModal(false);
    setShowCancelConfirmModal(true);
  };

  const cancelSubscription = async () => {
    const email = localStorage.getItem("CompanyEmail");
    if (!email) {
      setError("No email found. Please sign in again.");
      return;
    }

    setShowCancelConfirmModal(false);
    setError("");

    try {
      const response = await fetchWithBackoff(
        `${API_URL}/api/subscription/cancel-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email,
            appNames: selectedCancelApps.join(",")
          }),
        }
      );
      const data = await response.json();
      if (data.message) {
        setShowSuccessModal(true);
        setSelectedCancelApps([]);
        setTimeout(() => {
          fetchSubscriptionDetails(email);
        }, 2000);
      } else {
        setError(data.error || "Failed to cancel subscription.");
      }
    } catch (err) {
      setError(`Failed to cancel subscription: ${err.message}`);
    }
  };

  const handleChangePlanSelection = () => {
    if (selectedChangePlanApps.length === 0) {
      setError("Please select at least one application to change plan.");
      return;
    }
    setShowChangePlanSelectionModal(false);
    navigate("/subscription-dashboard/change-plan", { 
      state: { 
        selectedApps: selectedChangePlanApps 
      } 
    });
  };

  const handleAddProductSelection = () => {
    if (selectedAddProductApps.length === 0) {
      setError("Please select at least one application to add.");
      return;
    }
    setShowAddProductSelectionModal(false);
    navigate("/subscription-dashboard/add-product", {
      state: { selectedApps: selectedAddProductApps }
    });
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/subscription-dashboard", { replace: true });
  };

  const toggleCancelApp = (app) => {
    setSelectedCancelApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const toggleChangePlanApp = (app) => {
    setSelectedChangePlanApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const toggleAddProductApp = (app) => {
    setSelectedAddProductApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-3 shadow-lg">
        <h2 className="text-4xl font-bold tracking-tight">Subscription Dashboard</h2>
        <p className="text-sm opacity-90 mt-2">Manage your applications, plans, and usage with ease</p>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading subscription details...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {subscriptions.map((sub, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Subscription {index + 1} Applications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sub.applications.map((app, appIndex) => (
                    <div key={appIndex} className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition">
                      <Package className="h-8 w-8 text-indigo-600" />
                      <p className="text-lg font-semibold text-gray-900">{app.name || "N/A"}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-green-50 text-green-800 p-4 rounded-lg mt-6">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-lg">Status:</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      {sub?.status || "N/A"}
                    </span>
                  </div>
                  <div className="text-sm">Last updated: {formatDate(new Date())}</div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Subscription {index + 1} Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Plan</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {sub.planName} ({sub.interval})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(sub.price, sub.interval)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RefreshCw className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Auto Renew</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {sub.autoRenew ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Start Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(sub.startDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">End Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(sub.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RefreshCw className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cancel at Period End</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {sub.cancelAtPeriodEnd ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {(sub.nextPlanName || sub.nextPlanActiveDate || sub.nextPlanApplications?.length > 0) && (
                  <div className="bg-indigo-50 rounded-2xl shadow-lg p-6 mt-4">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Next Plan Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="flex items-center gap-4">
                        <DollarSign className="h-8 w-8 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Next Plan</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {sub.nextPlanName ? `${sub.nextPlanName} (${sub.nextInterval})` : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Active Date</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatDate(sub.nextPlanActiveDate) || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Package className="h-8 w-8 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Applications</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {Array.isArray(sub.nextPlanApplications) && sub.nextPlanApplications.length > 0
                              ? sub.nextPlanApplications.map(app => app.name || "Unknown").join(", ")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-between">
                <p className="text-sm">{error}</p>
                <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setShowChangePlanSelectionModal(true)}
                disabled={getActiveApplications().length === 0}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  getActiveApplications().length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Change Plan
              </button>
              <button
                onClick={() => setShowCancelSelectionModal(true)}
                disabled={getActiveApplications().length === 0}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  getActiveApplications().length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Cancel Subscription
              </button>
              <button
                onClick={() => setShowAddProductSelectionModal(true)}
                className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <PlusCircle className="inline-block mr-2 h-5 w-5" />
                Add Product
              </button>
            </div>

            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Operation Successful</h3>
                  <p className="text-gray-600 mb-6">
                    Your request has been processed. Changes will take effect at the end of the current billing period.
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={closeSuccessModal}
                      className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showCancelSelectionModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Applications to Cancel</h3>
                  <div className="space-y-4 mb-6">
                    {getActiveApplications().map((app) => (
                      <div key={app} className="flex text-lg items-center">
                        <input
                          type="checkbox"
                          id={`cancel-${app}`}
                          checked={selectedCancelApps.includes(app)}
                          onChange={() => toggleCancelApp(app)}
                          className="mr-2 h-5 w-5 text-indigo-600 rounded"
                        />
                        <label htmlFor={`cancel-${app}`}>{app}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setShowCancelSelectionModal(false);
                        setSelectedCancelApps([]);
                      }}
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCancelSelection}
                      className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-all shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showChangePlanSelectionModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Applications to Change Plan</h3>
                  <div className="space-y-4 mb-6">
                    {getActiveApplications().map((app) => (
                      <div key={app} className="flex text-lg items-center">
                        <input
                          type="checkbox"
                          id={`change-plan-${app}`}
                          checked={selectedChangePlanApps.includes(app)}
                          onChange={() => toggleChangePlanApp(app)}
                          className="mr-2 h-5 w-5 text-indigo-600 rounded"
                        />
                        <label htmlFor={`change-plan-${app}`}>{app}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setShowChangePlanSelectionModal(false);
                        setSelectedChangePlanApps([]);
                      }}
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePlanSelection}
                      className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddProductSelectionModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Applications to Add</h3>
                  <div className="space-y-4 mb-6">
                    {availableApps.map((app) => (
                      <div key={app} className="flex text-lg items-center">
                        <input
                          type="checkbox"
                          id={`add-product-${app}`}
                          checked={selectedAddProductApps.includes(app)}
                          onChange={() => toggleAddProductApp(app)}
                          className="mr-2 h-5 w-5 text-indigo-600 rounded"
                        />
                        <label htmlFor={`add-product-${app}`}>{app}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setShowAddProductSelectionModal(false);
                        setSelectedAddProductApps([]);
                      }}
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProductSelection}
                      className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-all shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showCancelConfirmModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to cancel the selected applications: {selectedCancelApps.join(", ")}?
                    This will take effect at the end of the current billing period.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowCancelConfirmModal(false)}
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      No
                    </button>
                    <button
                      onClick={cancelSubscription}
                      className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-all shadow-md"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!subscriptions.length && !error && (
              <div className="text-center text-gray-600 text-lg py-12">
                No subscription details available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;