import {
  CreditCard,
  ShieldCheck,
  MoreVertical,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const PaymentMethodCard = ({ method, onRefresh, API_URL, email }) => {
  const { t } = useTranslation();

  const [settingDefault, setSettingDefault] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleSetDefault = async () => {
    if (method.isDefault) return;
    setSettingDefault(true);
    try {
      const res = await fetch(`${API_URL}/api/subscription/set-default-payment-method`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, paymentMethodId: method.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('paymentPage.setDefaultSuccess'));
        onRefresh();
      } else {
        toast.error(data.error || t('paymentPage.setDefaultFailed'));
      }
    } catch (err) {
      toast.error(t('paymentPage.networkError'));
    } finally {
      setSettingDefault(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('paymentPage.confirmDeleteQuick') || 'Are you sure you want to remove this card?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(
        `${API_URL}/api/subscription/payment-method?email=${encodeURIComponent(email)}&paymentMethodId=${method.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(t('paymentPage.deleteSuccess') || 'Card removed');
        onRefresh();
      } else {
        toast.error(data.error || t('paymentPage.deleteFailed') || 'Failed to remove card');
      }
    } catch (err) {
      toast.error(t('paymentPage.networkError') || 'Network error');
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <>
      <div
        className={`relative overflow-hidden p-6 rounded-xl border transition-all duration-300 group ${
          method.isDefault
            ? 'border-violet-200 bg-white shadow-lg shadow-violet-100/50'
            : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
        }`}
      >
        {method.isDefault && (
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-violet-50 rounded-full blur-2xl opacity-60" />
        )}

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-sm flex items-center justify-center border ${
                  method.isDefault ? 'bg-violet-600 border-violet-600' : 'bg-gray-50 border-gray-100'
                }`}
              >
                <CreditCard size={24} className={method.isDefault ? 'text-white' : 'text-gray-400'} />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800 tracking-tight">
                  {method.brand?.toUpperCase() || 'CARD'}
                </p>
                <p className="text-xs font-medium text-gray-400">•••• {method.last4}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {method.isDefault ? (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <ShieldCheck size={12} />
                  {t('paymentPage.primary')}
                </span>
              ) : (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <MoreVertical size={20} />
                    )}
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 py-1 text-sm animate-in fade-in slide-in-from-top-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        {t('paymentPage.removeCard') || 'Remove card'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                {t('paymentPage.expiry')}
              </p>
              <p className="text-sm font-bold text-gray-700">
                {method.expMonth.toString().padStart(2, '0')} / {method.expYear.toString().slice(-2)}
              </p>
            </div>

            {!method.isDefault && (
              <button
                onClick={handleSetDefault}
                disabled={settingDefault || deleting}
                className="py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 border border-gray-100 bg-gray-100 text-gray-600 hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 disabled:opacity-50"
              >
                {settingDefault ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('paymentPage.setDefault')
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethodCard;