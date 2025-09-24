import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChangePlanCard from './ChangePlanCard';
import { User, Briefcase, Building2, Loader2, AlertCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedApps } = location.state || {};
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedTypes, setSelectedTypes] = useState(selectedApps || []);
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://subscription-backend-e8gq.onrender.com";

  useEffect(() => {
    if (!selectedApps || selectedApps.length === 0) {
      setError("No applications selected. Please select applications from the dashboard.");
      setLoading(false);
      return;
    }

    const email = localStorage.getItem("CompanyEmail");
    if (!email) {
      setError("No email found. Please sign in again.");
      setLoading(false);
      return;
    }

    const fetchUnsubscribedPlans = async () => {
      try {
        const response = await fetch(`${API_URL}/api/subscription/unsubscribed-plans?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        console.log('Unsubscribed Plans Response:', data);
        setPricingData(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUnsubscribedPlans();
  }, [selectedApps]);

  const handleAddPlan = async () => {
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
      setError("No applications selected.");
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
          state: { successMessage: "Product added successfully. You will receive a confirmation email soon." },
        });
      } else {
        setError(data.error || "Failed to add product.");
      }
    } catch (err) {
      setError(`Failed to add product: ${err.message}`);
    }
  };

  const mergedPricing = {
    Basic: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
    Pro: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
    Enterprise: { monthly: 0, quarterly: 0, yearly: 0, discount: { monthly: 0, quarterly: 0, yearly: 0 }, planIds: { monthly: null, quarterly: null, yearly: null } },
  };

  pricingData.forEach((plan) => {
    if (
      plan.planName.toLowerCase() === 'basic' ||
      plan.planName.toLowerCase() === 'pro' ||
      plan.planName.toLowerCase() === 'enterprise'
    ) {
      const tier = plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase();
      const interval = plan.interval.toLowerCase();
      mergedPricing[tier][interval] = plan.discountedPrice;
      mergedPricing[tier].discount[interval] = plan.discountPercent || 0;
      mergedPricing[tier].planIds[interval] = plan.planId;
    }
  });

  const formatPrice = (price, interval) => {
    if (price == null) return "N/A";
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
    .filter((plan) => plan.price[billingCycle] && plan.price[billingCycle] !== 'N/A');

  if (loading) {
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
            onClick={() => navigate("/subscription-dashboard")}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white px-6 py-8">
      <h1 className="text-5xl font-extrabold text-purple-700 mb-6 text-center">
        Add a New Product
      </h1>

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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100 max-w-md mx-auto"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Selected Applications
            </h3>
            {selectedTypes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedTypes.map((app) => (
                  <span
                    key={app}
                    className="inline-flex items-center px-8 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
                  >
                    {app}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No applications selected</p>
            )}
          </motion.div>

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
                      onSelect={() => {
                        setSelectedPlan({ ...plan, planId: plan.planIds[billingCycle] });
                        setShowConfirmModal(true);
                      }}
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
                    No plans available for the selected applications in the {billingCycle} billing cycle.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Add Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to add {selectedTypes.join(", ")} to {selectedPlan.title} ({billingCycle})?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleAddPlan}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Yes, Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;