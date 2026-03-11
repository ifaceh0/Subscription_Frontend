// src/pages/RenewSuccess.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RenewSuccess = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const status = params.get('renew');
  const sessionId = params.get('session_id');

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === 'success') {
      toast.success(t('dashboard.renewSuccess') || "Subscription renewed successfully!");
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/subscription-dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (status === 'cancel') {
      toast.info(t('dashboard.renewCancelled') || "Renewal cancelled.");
      setTimeout(() => navigate('/subscription-dashboard'), 3000);
    }
  }, [status, navigate]);

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-xl shadow-2xl max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t('dashboard.renewSuccessTitle') || "Renewal Successful!"}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('dashboard.renewSuccessMessage') || "Your subscription is active again. Enjoy!"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <p className="text-gray-700 font-medium">
              {t('dashboard.redirectingIn')} <span className="font-bold text-indigo-600">{countdown}</span> {t('dashboard.seconds')}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'cancel') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t('dashboard.renewCancelledTitle') || "Renewal Cancelled"}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('dashboard.renewCancelledMessage') || "No worries! You can try again anytime."}
          </p>
          <button
            onClick={() => navigate('/subscription-dashboard')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {t('dashboard.backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  // Fallback / processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md text-center">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('dashboard.processingRenewal') || "Processing Renewal..."}
        </h2>
        <p className="text-gray-600">{t('dashboard.pleaseWait')}</p>
      </div>
    </div>
  );
};

export default RenewSuccess;