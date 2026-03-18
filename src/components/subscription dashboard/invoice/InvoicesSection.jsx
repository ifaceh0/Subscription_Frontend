import { useState, useEffect } from 'react';
import { FileText, Download, Loader2, Calendar, ArrowUpRight, ReceiptText, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const InvoicesSection = ({ email, API_URL, currencySymbol, currencyPosition }) => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [nextBilling, setNextBilling] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/subscription/invoices?email=${encodeURIComponent(email)}&limit=10`
      );
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.invoices || []);
        setNextBilling(data.nextBilling || null);
        setCustomerId(data.customerId);
      } else {
        toast.error(data.error || t('invoicePage.failedToLoad'));
      }
    } catch (err) {
      toast.error(t('invoicePage.networkError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [email]);

  const formatAmount = (amount) => {
    if (!amount) return `${currencySymbol || '$'}0.00`;
    const formatted = Number(amount).toFixed(2);
    return currencyPosition === 'prefix'
      ? `${currencySymbol || '$'}${formatted}`
      : `${formatted}${currencySymbol || '$'}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'open':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'void':
        return 'bg-gray-50 text-gray-500 border-gray-100';
      default:
        return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  // Helper to show next billing info
  const renderNextBilling = () => {
    if (!nextBilling) {
      return (
        <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-5 text-center mb-6">
          <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">
            {t('invoicePage.noActiveSubscription')}
          </p>
        </div>
      );
    }

    const isActive = ['active', 'trialing'].includes(nextBilling.status?.toLowerCase());
    const nextDate = nextBilling.nextBillingDate
      ? formatDate(nextBilling.nextBillingDate)
      : '—';

    const amount = nextBilling.amount
      ? formatAmount(nextBilling.amount)
      : formatAmount(0);

    return (
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4 transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-violet-800">
                {t('invoicePage.nextBilling')}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                {nextBilling.status || 'unknown'}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-gray-500">{t('invoicePage.amount')}</p>
                <p className="font-semibold text-gray-800">{amount}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('invoicePage.due')}</p>
                <p className="font-semibold text-gray-800">{nextDate}</p>
              </div>
            </div>
          </div>

          {isActive && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">{t('invoicePage.automaticallyCharged')}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="mb-16">
      {/* Header */}
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
        <span className="w-8 h-[1px] bg-gray-300"></span>
        {t('invoicePage.billingHistory')}
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500 mb-2" />
          <p className="text-xs font-medium text-gray-400">{t('invoicePage.fetchingRecords')}</p>
        </div>
      ) : (
        <>
          {/* Next Billing Section – shown even when there are no invoices */}
          {customerId && renderNextBilling()}

          {invoices.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <ReceiptText className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-600 font-semibold italic">{t('invoicePage.noInvoices')}</p>
              {customerId && (
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                  {t('invoicePage.noInvoicesDesc')}
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="group relative bg-white border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-5">
                    {/* Date Badge */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-md bg-gray-50 border border-gray-100 group-hover:bg-violet-50 group-hover:border-violet-100 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-violet-400 transition-colors">
                        {new Date(inv.created * 1000).toLocaleString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-gray-700 group-hover:text-violet-700 transition-colors">
                        {new Date(inv.created * 1000).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-gray-800 text-lg">
                          {formatAmount(inv.amountDue || inv.amountPaid)}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(
                            inv.status
                          )}`}
                        >
                          {inv.status || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {formatDate(inv.created)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                    {inv.hostedInvoiceUrl ? (
                      <a
                        href={inv.hostedInvoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-2 px-4 rounded-full text-sm font-bold text-gray-600 bg-gray-200 border border-gray-100 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300"
                      >
                        <Download size={14} />
                        {t('invoicePage.invoice')}
                        <ArrowUpRight size={14} className="opacity-50" />
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-gray-300 italic px-4">
                        {t('invoicePage.processing')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default InvoicesSection;