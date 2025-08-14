import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChangePlanCard from './ChangePlanCard';
import { User, Briefcase, Building2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from "lucide-react";

const ChangePlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionDetails } = location.state || {};
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [pricingData, setPricingData] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

  // Fetch application types and plans from backend
  useEffect(() => {
    const fetchApplicationsAndPlans = async () => {
      try {
        // Fetch applications
        const appResponse = await fetch(`${API_URL}/api/admin/applications`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!appResponse.ok) {
          throw new Error('Failed to fetch applications');
        }
        const appData = await appResponse.json();
        const allTypes = appData.map(app => app.name.toLowerCase());

        // Fetch plans
        const planResponse = await fetch(`${API_URL}/api/subscription/plans`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!planResponse.ok) {
          throw new Error('Failed to fetch plans');
        }
        const planData = await planResponse.json();
        setPricingData(planData);

        // Filter applications that are associated with valid plans (non-zero priced, not the current subscription)
        const currentPlanId = subscriptionDetails?.planId;
        if (!currentPlanId) {
          console.warn('No planId found in subscriptionDetails:', subscriptionDetails);
        }
        const availableApps = new Set();
        planData.forEach(plan => {
          if (plan.planId !== currentPlanId && plan.discountedPrice > 0) {
            plan.applicationNames.forEach(app => availableApps.add(app.toLowerCase()));
          }
        });
        const filteredTypes = allTypes.filter(type => availableApps.has(type));
        setAvailableTypes(filteredTypes);

        // Debug: Log plans to verify current plan exclusion
        console.log('All Plans:', planData);
        console.log('Current Plan ID:', currentPlanId);
        console.log('Filtered Plans (excluding current):', planData.filter(plan => plan.planId !== currentPlanId));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchApplicationsAndPlans();
  }, [subscriptionDetails]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setSelectedPlan(null); // Reset selected plan when apps change
  };

  const handleChangePlan = async () => {
    const email = localStorage.getItem("CompanyEmail");
    if (!email) {
      setError("No email found. Please sign in again.");
      return;
    }
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }
    if (selectedTypes.length === 0) {
      setError("Please select at least one application.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          appNames: selectedTypes.join(","),
          newPlanTypeId: selectedPlan.planId,
        }),
      });
      const data = await response.json();
      if (data.message) {
        navigate("/subscription-dashboard", {
          state: { successMessage: "Plan changed successfully. You will receive a confirmation email soon." },
        });
      } else {
        setError(data.error || "Failed to change plan.");
      }
    } catch (err) {
      setError(`Failed to change plan: ${err.message}`);
    }
  };

  if (loading || availableTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading subscription plan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <p className="text-xl font-semibold text-red-600">Error</p>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const mergedPricing = {
    Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
    Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
    Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
  };

  // Map backend data to frontend pricing structure, excluding only the exact current plan by planId
  const currentPlanId = subscriptionDetails?.planId;
  ['Basic', 'Pro', 'Enterprise'].forEach((tier) => {
    pricingData?.forEach((plan) => {
      // Skip the exact current plan
      if (plan.planId === currentPlanId) {
        console.log('Excluded current plan:', plan);
        return;
      }
      const selectedTypesLower = selectedTypes.map((type) => type.toLowerCase());
      const applicationNamesLower = plan.applicationNames.map((name) => name.toLowerCase());
      const isSelectedAppsMatch = selectedTypesLower.every((type) =>
        applicationNamesLower.includes(type)
      );
      const isAppCountMatch = selectedTypesLower.length === applicationNamesLower.length;

      if (
        plan.planName.toLowerCase() === tier.toLowerCase() &&
        isSelectedAppsMatch &&
        isAppCountMatch &&
        plan.discountedPrice > 0
      ) {
        const interval = plan.interval.toLowerCase();
        mergedPricing[tier][interval] = plan.discountedPrice;
        mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
        mergedPricing[tier].planIds[interval] = plan.planId;
      }
    });
  });

  const formatPrice = (price, interval) => {
    if (price === 0) return null; // Return null for zero prices to filter them out
    if (interval === 'monthly') {
      return `$${parseFloat(price).toFixed(2)} /month`;
    } else if (interval === 'quarterly') {
      return `$${parseFloat(price).toFixed(2)} /quarter`;
    } else {
      return `$${parseFloat(price).toFixed(2)} /year`;
    }
  };

  const plans = ['Basic', 'Pro', 'Enterprise']
    .map((tier) => ({
      title: tier,
      price: {
        monthly: formatPrice(mergedPricing[tier].monthly, 'monthly'),
        quarterly: formatPrice(mergedPricing[tier].quarterly, 'quarterly'),
        yearly: formatPrice(mergedPricing[tier].yearly, 'yearly'),
      },
      discountPercent: mergedPricing[tier].discount,
      planIds: mergedPricing[tier].planIds,
      features:
        tier === 'Basic'
          ? ['Up to 5 users', '5GB storage', 'Basic support', 'Access to core features']
          : tier === 'Pro'
          ? ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom integrations']
          : [
              'Unlimited users',
              'Unlimited storage',
              '24/7 dedicated support',
              'Advanced security features',
              'Custom development',
              'On-premise deployment option',
            ],
      buttonText: `Select ${tier} Plan`,
      color:
        tier === 'Basic'
          ? 'bg-purple-500'
          : tier === 'Pro'
          ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
          : 'bg-blue-600',
      icon: tier === 'Basic' ? User : tier === 'Pro' ? Briefcase : Building2,
    }))
    .filter((plan) => plan.price[billingCycle]); // Only include plans with a valid price for the selected billing cycle

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
      <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
        Change Your Subscription Plan
      </h1>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white rounded-full p-1 shadow-md">
          {['monthly', 'quarterly', 'yearly'].map((cycle) => (
            <div key={cycle} className="relative mx-1">
              <button
                onClick={() => setBillingCycle(cycle)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 w-[100px] text-center ${
                  billingCycle === cycle
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-700 bg-transparent'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar + Cards */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-[22%] bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-6 flex flex-col gap-5 border border-purple-100">
          <div className="text-purple-800 font-bold text-xl mb-4 text-center">
            Select Applications
          </div>
          <p className="text-purple-600 text-sm mb-6 text-center">
            Choose the applications you want to change the plan for.
          </p>
          {availableTypes.length > 0 ? (
            availableTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-purple-50 transition-all duration-200 cursor-pointer border border-purple-100"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                  className="accent-purple-600 w-5 h-5"
                />
                <span className="text-purple-800 font-medium text-lg capitalize">
                  {type}
                </span>
              </label>
            ))
          ) : (
            <p className="text-purple-600 text-sm text-center">
              No applications available for plan change.
            </p>
          )}
          <div className="mt-auto text-center">
            <button
              onClick={() => setSelectedTypes([])}
              className="mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex-1">
          {selectedTypes.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTypes.join('-') + billingCycle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap justify-center gap-8 px-2"
              >
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <div key={index} className="w-full sm:w-[48%] lg:w-[32%] xl:w-[30%] flex">
                      <ChangePlanCard
                        title={plan.title}
                        price={plan.price}
                        discountPercent={plan.discountPercent}
                        planIds={plan.planIds}
                        features={plan.features}
                        color={plan.color}
                        billingCycle={billingCycle}
                        icon={plan.icon}
                        selectedTypes={selectedTypes}
                        onSelect={() => setSelectedPlan({ ...plan, planId: plan.planIds[billingCycle] })}
                        isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
                      />
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center h-full min-h-[200px] text-center"
                  >
                    <p className="text-purple-600 font-medium text-lg">
                      No plans available for the selected products.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="no-plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center h-full min-h-[200px] text-center"
              >
                <p className="text-purple-600 font-medium text-lg">
                  Please select at least one product to view subscription plans.
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      {selectedTypes.length > 0 && plans.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={!selectedPlan}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              selectedPlan ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Selection
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Plan Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the plan for {selectedTypes.join(", ")} to {selectedPlan.title}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleChangePlan}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePlan;