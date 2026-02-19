import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SubscriptionCard = ({ title, price, features, buttonText, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds }) => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    if (!planIds[billingCycle]) {
      toast.error(`No valid plan ID for ${title} (${billingCycle})`);
      return;
    }
    navigate(`/plan/${title.toLowerCase()}`, {
      state: {
        planId: planIds[billingCycle],
        planTitle: title,
        billingCycle,
        selectedTypes,
        price: price[billingCycle],
        features,
        discountPercent: discountPercent[billingCycle],
      },
    });
  };

  const calculateOriginalPrice = (discountedPrice, discountPercent) => {
    if (!discountedPrice || discountPercent === 0) return null;
    const price = parseFloat(discountedPrice.replace(/[^0-9.]/g, '') || 0);
    return `$${(price / (1 - discountPercent / 100)).toFixed(2)}`;
  };

  const getIntervalText = () => {
    switch (billingCycle) {
      case 'month':
        return '/month';
      case 'quarter':
        return '/quarter';
      case 'year':
        return '/year';
      default:
        return '/month';
    }
  };

  const displayPrice = price[billingCycle] || '$0.00';
  const priceValue = parseFloat(displayPrice.replace(/[^0-9.]/g, '') || 0);

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${title === 'Pro' ? 'ring-4 ring-yellow-300' : ''}`}>
      {title === 'Pro' && (
        <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 px-2 py-1 text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <div className={`px-6 py-2.5 flex justify-center text-center ${color}`}>
        <div>
          {Icon && (
            <div className="mb-2 flex justify-center">
              <Icon className="h-8 w-8 text-white" />
            </div>
          )}
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-white text-sm">
            {title === 'Basic'
              ? 'Perfect for individuals and small teams'
              : title === 'Pro'
              ? 'Ideal for growing businesses'
              : 'For large organizations with complex needs'}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 text-left">
        {discountPercent[billingCycle] > 0 && (
          <p className="text-sm text-green-600 font-medium mb-1">
            Save {discountPercent[billingCycle]}%
          </p>
        )}
        <div className="space-y-1">
          {discountPercent[billingCycle] > 0 && calculateOriginalPrice(displayPrice, discountPercent[billingCycle]) && (
            <div className="text-sm text-gray-400 line-through">
              Original: {calculateOriginalPrice(displayPrice, discountPercent[billingCycle])}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {/* {priceValue > 0 ? `$${priceValue.toFixed(2)}` : '$0.00'} */}
              {price[billingCycle] || '0.00'}
            </span>
            <span className="text-gray-500 text-base font-medium">
              {getIntervalText()}
            </span>
          </div>
        </div>
      </div>

      <ul className="px-6 pb-4 space-y-2 text-left">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center text-gray-700">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            {feat}
          </li>
        ))}
      </ul>

      <div className="px-6 pb-6">
        <button
          onClick={handleAccessClick}
          className={`w-full py-2 rounded-full font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 ${
            title === 'Basic'
              ? 'bg-purple-600 hover:bg-purple-700'
              : title === 'Pro'
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label={`Select ${title} plan`}
        >
          {buttonText || 'Access'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;