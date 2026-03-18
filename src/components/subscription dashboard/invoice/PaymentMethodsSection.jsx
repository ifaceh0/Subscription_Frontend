import { useState, useEffect } from 'react';
import { CreditCard, Plus, Loader2, Wallet, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentMethodCard from './PaymentMethodCard';
import WrappedAddPaymentMethodModal from './AddPaymentMethodModal';
import { useTranslation } from 'react-i18next';

const PaymentMethodsSection = ({ email, API_URL, onRefresh }) => {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const fetchPaymentMethods = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/subscription/payment-methods?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) {
        setPaymentMethods(data.paymentMethods || []);
        setCustomerId(data.customerId);
      } else {
        toast.error(data.error || 'Failed to load payment methods');
      }
    } catch (err) {
      toast.error('Network error while loading payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [email]);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchPaymentMethods();
    toast.success('Payment method added successfully');
    if (onRefresh) onRefresh();
  };

  return (
    <section className="mb-12 max-w-4xl">
      {/* Refined Header with Action */}
      <div className="flex flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-8 h-[1px] bg-gray-300"></span>
          {t('paymentPage.paymentMethods')}
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="group inline-flex items-center gap-2 py-2 px-5 rounded-full font-bold text-sm text-white bg-gray-900 hover:bg-violet-600 transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
          {t('paymentPage.addNewCard')}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : paymentMethods.length === 0 ? (
        /* Soft Glass-Style Empty State */
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-xl p-12 text-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform group-hover:scale-110 duration-500">
              <Wallet className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-2">{t('paymentPage.noCardsSaved')}</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
              {t('paymentPage.addPaymentDescription')}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              {t('paymentPage.setupPaymentMethod')}
            </button>
          </div>
        </div>
      ) : (
        /* Modern Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <PaymentMethodCard
                method={method}
                onRefresh={fetchPaymentMethods}
                API_URL={API_URL}
                email={email}
              />
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <WrappedAddPaymentMethodModal
          email={email}
          customerId={customerId}
          API_URL={API_URL}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </section>
  );
};

export default PaymentMethodsSection;