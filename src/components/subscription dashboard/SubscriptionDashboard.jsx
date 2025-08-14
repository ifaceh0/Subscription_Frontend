import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, DollarSign, RefreshCw, Package, PlusCircle } from "lucide-react";

const SubscriptionDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [error, setError] = useState(location.state?.successMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelSelectionModal, setShowCancelSelectionModal] = useState(false);
  const [selectedCancelApps, setSelectedCancelApps] = useState([]);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.successMessage);
  const [showChangePlanSelectionModal, setShowChangePlanSelectionModal] = useState(false);
  const [selectedChangePlanApps, setSelectedChangePlanApps] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (email) {
      localStorage.setItem("CompanyEmail", email);
    }

    const storedEmail = localStorage.getItem("CompanyEmail");

    if (storedEmail) {
      const fetchSubscriptionDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(storedEmail)}`, {
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }
          const data = await response.json();
          const subscriptionData = data.subscriptions && data.subscriptions.length > 0 ? data.subscriptions[0] : null;
          if (subscriptionData) {
            setSubscriptionDetails(subscriptionData);
            localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
          } else {
            setError("No subscription found for this account.");
          }
          setAvailablePlans(data.plans || []);
        } catch (err) {
          console.error("Fetch error:", err);
          setError(`Failed to load subscription details: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSubscriptionDetails();
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

  const formatApplications = (applications) => {
    if (!applications || applications.length === 0) return ["None"];
    return applications;
  };

  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After") || delay * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
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
        setTimeout(async () => {
          try {
            const detailsResponse = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
              headers: { "Content-Type": "application/json" },
            });
            if (detailsResponse.ok) {
              const updatedData = await detailsResponse.json();
              const subscriptionData = updatedData.subscriptions && updatedData.subscriptions.length > 0 ? updatedData.subscriptions[0] : null;
              if (subscriptionData) {
                setSubscriptionDetails(subscriptionData);
                localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
              } else {
                setError("No subscription found after cancellation.");
              }
            }
          } catch (err) {
            console.error("Failed to refresh subscription details:", err);
            setError(`Failed to refresh subscription details: ${err.message}`);
          }
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
        subscriptionDetails: { ...subscriptionDetails, applications: selectedChangePlanApps } 
      } 
    });
  };

  const handleAddProduct = async () => {
    const email = localStorage.getItem("CompanyEmail");
    if (!email) {
      setError("No email found. Please sign in again.");
      return;
    }

    try {
      const response = await fetchWithBackoff(
        `${API_URL}/api/subscription/add-product`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.message) {
        setShowSuccessModal(true);
        setTimeout(async () => {
          try {
            const detailsResponse = await fetch(`${API_URL}/api/subscription/details?email=${encodeURIComponent(email)}`, {
              headers: { "Content-Type": "application/json" },
            });
            if (detailsResponse.ok) {
              const updatedData = await detailsResponse.json();
              const subscriptionData = updatedData.subscriptions && updatedData.subscriptions.length > 0 ? updatedData.subscriptions[0] : null;
              if (subscriptionData) {
                setSubscriptionDetails(subscriptionData);
                localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
              } else {
                setError("No subscription found after adding product.");
              }
            }
          } catch (err) {
            console.error("Failed to refresh subscription details:", err);
            setError(`Failed to refresh subscription details: ${err.message}`);
          }
        }, 2000);
      } else {
        setError(data.error || "Failed to add product.");
      }
    } catch (err) {
      setError(`Failed to add product: ${err.message}`);
    }
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-3 shadow-lg">
        <h2 className="text-4xl font-bold tracking-tight">Subscription Dashboard</h2>
        <p className="text-sm opacity-90 mt-2">Manage your applications, plans, and usage with ease</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading subscription details...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Applications Section */}
            {subscriptionDetails && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Your Applications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formatApplications(subscriptionDetails.applications).map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition"
                    >
                      <Package className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Application</p>
                        <p className="text-lg font-semibold text-gray-900">{app}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status and Error Messages */}
            {subscriptionDetails && (
              <div className="flex items-center justify-between bg-green-50 text-green-800 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">Status:</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {subscriptionDetails?.status || "N/A"}
                  </span>
                </div>
                <div className="text-sm">Last updated: {formatDate(new Date())}</div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-between">
                <p className="text-sm">{error}</p>
                <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
                  ✕
                </button>
              </div>
            )}

            {/* Plan Details Section */}
            {subscriptionDetails && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Current Plan Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4">
                    <DollarSign className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plan</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscriptionDetails.planName} ({subscriptionDetails.interval})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <DollarSign className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(subscriptionDetails.price, subscriptionDetails.interval)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RefreshCw className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Auto Renew</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscriptionDetails.autoRenew ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(subscriptionDetails.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(subscriptionDetails.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RefreshCw className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cancel at Period End</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscriptionDetails.cancelAtPeriodEnd ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Plan Details */}
            {subscriptionDetails?.nextPlanName && (
              <div className="bg-indigo-50 rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Next Plan Details</h3>
                <div className="flex items-center gap-4">
                  <DollarSign className="h-8 w-8 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Plan</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {subscriptionDetails.nextPlanName} ({subscriptionDetails.nextInterval})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setShowChangePlanSelectionModal(true)}
                disabled={subscriptionDetails?.cancelAtPeriodEnd}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  subscriptionDetails?.cancelAtPeriodEnd
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Change Plan
              </button>
              <button
                onClick={() => setShowCancelSelectionModal(true)}
                disabled={subscriptionDetails?.cancelAtPeriodEnd}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  subscriptionDetails?.cancelAtPeriodEnd
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Cancel Subscription
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <PlusCircle className="inline-block mr-2 h-5 w-5" />
                Add Product
              </button>
            </div>

            {/* Modals */}
            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Operation Successful</h3>
                  <p className="text-gray-600 mb-6">
                    Your request has been processed. It will remain active until{" "}
                    <span className="font-semibold">{formatDate(subscriptionDetails.endDate)}</span>.
                    You will receive a confirmation email soon.
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
                    {formatApplications(subscriptionDetails.applications).map((app) => (
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
                    {formatApplications(subscriptionDetails.applications).map((app) => (
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

            {showCancelConfirmModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to cancel the selected applications: {selectedCancelApps.join(", ")}?
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

            {!subscriptionDetails && !error && (
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