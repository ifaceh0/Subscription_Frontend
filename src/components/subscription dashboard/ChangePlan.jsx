import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Loader2, AlertCircle, Package, RefreshCw } from 'lucide-react';
import { FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ChangePlanCard from './ChangePlanCard';
import { useLocation as useCountryLocation } from '../../contexts/LocationContext';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import FeatureDetailsModal from '../Modal/FeatureDetailsModal';

const ChangePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedApps = [] } = location.state || {};
  const [billingCycle, setBillingCycle] = useState('month');
  const [selectedTypes] = useState(selectedApps);
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { countryCode } = useCountryLocation();
  const [selectedTierForModal, setSelectedTierForModal] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('CompanyEmail');
    if (!email) {
      setError(t('changePlan.noEmailFound'));
      setLoading(false);
      return;
    }
    if (!selectedApps || selectedApps.length === 0) {
      setError(t('changePlan.noAppsSelected'));
      setLoading(false);
      return;
    }

    const fetchAvailablePlans = async () => {
      setLoading(true);
      try {
        const query = selectedTypes.length > 0
          ? `?${selectedTypes.map(type => `appNames=${encodeURIComponent(type)}`).join('&')}`
          : '';
        const response = await fetch(`${API_URL}/api/subscription/subscribed-plan?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'X-User-Location': countryCode
           },
        });
        if (!response.ok) {
          if (response.status === 404) throw new Error(t('changePlan.noAlternativePlans'));
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPricingData(data || []);
      } catch (err) {
        setError(`${t('changePlan.failedToFetchPlans')}: ${err.message}`);
        toast.error(`${t('changePlan.error')}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailablePlans();
  }, [selectedApps, navigate]);

  const handleChangePlan = async () => {
    const email = localStorage.getItem('CompanyEmail');
    if (!email || !selectedPlan || selectedTypes.length === 0) return;

    setModalLoading(true);
    try {
      const lowercaseAppNames = selectedTypes.map(type => type.trim().toLowerCase());
      const response = await fetch(`${API_URL}/api/subscription/change-plan`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Location': countryCode
        },
        body: JSON.stringify({
          email,
          appNames: lowercaseAppNames,
          newPlanTypeId: selectedPlan.planId,
          newInterval: billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1),
          activationDate: Math.floor(Date.now() / 1000),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.checkoutUrl) {
          toast.success(t('changePlan.redirectingToCheckout'));
          window.location.href = data.checkoutUrl;
        } else {
          const successMsg = data.message || t('changePlan.planChangedSuccess');
          toast.success(successMsg);
          navigate('/subscription-dashboard', {
            state: { successMessage: successMsg }
          });
        }
      } else {
        const errMsg = data.message || t('changePlan.failedToChange');
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      setError(`${t('changePlan.failedToChange')}: ${err.message}`);
      toast.error(`${t('changePlan.error')}: ${err.message}`);
    } finally {
      setModalLoading(false);
      setShowConfirmModal(false);
    }
  };

  const uniqueTiers = [...new Set(pricingData.map(plan => 
    plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase()
  ))];

  const planHighlights = {
    Basic: t('subscription.planHighlights.Basic', { returnObjects: true }) || [],
    Pro: t('subscription.planHighlights.Pro', { returnObjects: true }) || [],
    Enterprise: t('subscription.planHighlights.Enterprise', { returnObjects: true }) || [],
  };

  const planDetails = {
    Basic: t('subscription.planDetails.Basic', { returnObjects: true }) || [],
    Pro: t('subscription.planDetails.Pro', { returnObjects: true }) || [],
    Enterprise: t('subscription.planDetails.Enterprise', { returnObjects: true }) || [],
  };

  // const plans = uniqueTiers
  //   .map((tier) => {
  //     const matchingPlan = pricingData.find(plan => 
  //       plan.planName.toLowerCase() === tier.toLowerCase() &&
  //       plan.interval.toLowerCase().includes(billingCycle) &&
  //       plan.applicationNames?.length === selectedTypes.length &&
  //       selectedTypes.every(app => 
  //         plan.applicationNames?.map(n => n.toLowerCase()).includes(app.toLowerCase())
  //       )
  //     );

  //     if (!matchingPlan) return null;

  //     const intervalKey = billingCycle;

  //     return {
  //       title: tier,
  //       price: {
  //         month: matchingPlan.formattedPrice || '0.00',
  //         quarter: matchingPlan.formattedPrice || '0.00',
  //         year: matchingPlan.formattedPrice || '0.00',
  //       },
  //       discountPercent: { [intervalKey]: matchingPlan.discountPercent || 0 },
  //       planIds: { [intervalKey]: matchingPlan.planId },
  //       features: matchingPlan.features || [],
  //       selectedTypes,
  //       buttonText: `${t('changePlan.select')} ${tier} ${t('changePlan.plan')}`,
  //       color: tier === 'Basic' ? 'bg-purple-500' : 
  //              tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 
  //              'bg-blue-600',
  //       icon: User,
  //     };
  //   })
  //   .filter(plan => plan !== null && plan.planIds[billingCycle] !== null);

  const plans = ['Basic', 'Pro', 'Enterprise'].map(tier => {
    // Find all plans for this tier that match selected apps exactly
    const tierPlans = pricingData.filter(plan =>
      plan.planName.toLowerCase() === tier.toLowerCase() &&
      plan.applicationNames?.length === selectedTypes.length &&
      selectedTypes.every(app =>
        plan.applicationNames.map(n => n.toLowerCase()).includes(app.toLowerCase())
      )
    );

    if (tierPlans.length === 0) return null;

    const priceObj = {};
    const discountObj = {};
    const planIdObj = {};

    tierPlans.forEach(plan => {
      let key;
      const intervalLower = plan.interval.toLowerCase();
      if (intervalLower === 'monthly') key = 'month';
      else if (intervalLower === 'quarterly') key = 'quarter';
      else if (intervalLower === 'yearly') key = 'year';
      else return;

      priceObj[key] = plan.formattedPrice || '0.00';
      discountObj[key] = plan.discountPercent || 0;
      planIdObj[key] = plan.planId;
    });

    return {
      title: tier,
      price: priceObj,
      discountPercent: discountObj,
      planIds: planIdObj,
      features: planHighlights[tier] || [],
      selectedTypes,
      buttonText: `${t('changePlan.select')} ${tier} ${t('changePlan.plan')}`,
      color: tier === 'Basic' ? 'bg-purple-500' :
            tier === 'Pro' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
            'bg-blue-600',
      icon: User,
    };
  }).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div className="flex flex-col items-center">
          <FiLoader className="h-14 w-14 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-600 text-lg">{t('changePlan.loadingPlans')}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div className="bg-white rounded shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-500 mb-4">{t('changePlan.error')}</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subscription-dashboard')}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            {t('changePlan.backToDashboard')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <motion.div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          {t('changePlan.changeYourPlan')}
        </h1>

        {/* Billing Cycle Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
            {['month', 'quarter', 'year'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingCycle === cycle
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t(`changePlan.${cycle}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Apps */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">
            {t('changePlan.changingPlanFor')}: <strong>{selectedTypes.join(', ')}</strong>
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={billingCycle}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ChangePlanCard
                    title={plan.title}
                    price={plan.price}
                    discountPercent={plan.discountPercent}
                    planIds={plan.planIds}
                    features={plan.features}
                    color={plan.color}
                    billingCycle={billingCycle}
                    icon={plan.icon}
                    selectedTypes={plan.selectedTypes}
                    onSelect={() => {
                      setSelectedPlan({ title: plan.title, planId: plan.planIds[billingCycle] });
                      setShowConfirmModal(true);
                    }}
                    isSelected={selectedPlan?.planId === plan.planIds[billingCycle]}
                    onShowMore={() => setSelectedTierForModal(plan.title)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">
                  {t('changePlan.noAlternativePlansFor', { 
                    apps: selectedTypes.join(', '), 
                    cycle: billingCycle 
                  })}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('changePlan.confirmPlanChange')}</h3>
              <p className="text-gray-600 mb-8">
                {t('changePlan.confirmMessage', {
                  apps: selectedTypes.join(', '),
                  plan: selectedPlan.title,
                  cycle: billingCycle
                })}
                <br />
                <strong>{t('changePlan.newPriceNextCycle')}</strong>
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={modalLoading}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 disabled:opacity-50"
                >
                  {t('changePlan.cancel')}
                </button>
                <button
                  onClick={handleChangePlan}
                  disabled={modalLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {modalLoading ? (
                    <>
                      {t('changePlan.processing')}
                      <FiLoader className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    t('changePlan.yesChange')
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        <FeatureDetailsModal
          isOpen={!!selectedTierForModal}
          onClose={() => setSelectedTierForModal(null)}
          tier={selectedTierForModal || ''}
          content={planDetails[selectedTierForModal] || []}
        />
      </motion.div>
    </div>
  );
};

export default ChangePlan;