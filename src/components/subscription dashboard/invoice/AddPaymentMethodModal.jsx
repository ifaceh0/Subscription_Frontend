import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, X, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const AddPaymentMethodModal = ({ email, customerId, API_URL, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSetupIntent = async () => {
      if (!email) return;
      try {
        const res = await fetch(`${API_URL}/api/subscription/create-setup-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error(data.error || t('paymentPage.prepareCardFailed'));
          onClose();
        }
      } catch (err) {
        toast.error(t('paymentPage.networkPrepareError'));
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchSetupIntent();
  }, [email, API_URL, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setSubmitting(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email },
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to add card');
        setSubmitting(false);
        return;
      }

      if (setupIntent.status === 'succeeded') {
        try {
          await fetch(`${API_URL}/api/subscription/set-default-payment-method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, paymentMethodId: setupIntent.payment_method }),
          });
        } catch (err) {
          console.warn('Card added but setting default failed', err);
        }
        toast.success(t('paymentPage.cardAddedSuccess'));
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(t('paymentPage.unexpectedError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[0.5rem] max-w-md w-full p-8 relative shadow-2xl shadow-gray-900/20 animate-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-violet-100 rounded-sm flex items-center justify-center">
              <CreditCard className="text-violet-600 w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t('paymentPage.addNewCard')}</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium italic">{t('paymentPage.secureAdd')}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-4" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('paymentPage.initializing')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Lock size={12} /> {t('paymentPage.cardInfo')}
              </label>
              
              <div className="p-4 border border-gray-200 rounded-sm bg-gray-50/50 transition-all focus-within:border-violet-200 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-violet-500/5">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: '#111827',
                        '::placeholder': { color: '#9ca3af' },
                      },
                      invalid: { color: '#ef4444' },
                    },
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={!stripe || submitting || !clientSecret}
                className="w-full py-2.5 rounded-full font-bold text-sm text-white bg-gray-900 hover:bg-violet-600 transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-violet-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('paymentPage.validatingCard')}
                  </span>
                ) : (
                  t('paymentPage.addPaymentMethod')
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 py-2 rounded-sm border border-emerald-100/50">
                <ShieldCheck size={14} />
                {t('paymentPage.pciSecure')}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const WrappedAddPaymentMethodModal = (props) => (
  <Elements stripe={stripePromise}>
    <AddPaymentMethodModal {...props} />
  </Elements>
);

export default WrappedAddPaymentMethodModal;