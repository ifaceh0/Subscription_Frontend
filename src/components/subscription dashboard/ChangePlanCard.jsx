import { Check } from 'lucide-react';

const ChangePlanCard = ({ title, price, features, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds, onSelect, isSelected }) => {
  // Skip rendering if the price for the current billing cycle is not available
  if (!price[billingCycle]) return null;

  const calculateOriginalPrice = (discountedPrice, discountPercent) => {
    if (!discountedPrice || discountPercent === 0) return discountedPrice;
    return (discountedPrice / (1 - discountPercent / 100)).toFixed(2);
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${title === 'Pro' ? 'ring-4 ring-yellow-300' : ''} ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      {/* Popular Badge */}
      {title === 'Pro' && (
        <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 px-2 py-1 text-xs font-semibold rounded">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className={`px-6 py-4 flex justify-center text-center ${color}`}>
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

      {/* Price */}
      <div className="px-6 py-4 text-left">
        {discountPercent[billingCycle] > 0 && (
          <p className="text-sm text-green-600 font-medium mb-1">
            Save {discountPercent[billingCycle]}% compared to monthly
          </p>
        )}
        <div className="space-y-1">
          {discountPercent[billingCycle] > 0 && (
            <div className="text-sm text-gray-400 line-through">
              Original: ${calculateOriginalPrice(
                parseFloat(price[billingCycle]?.replace(/[^0-9.]/g, '') || 0),
                discountPercent[billingCycle]
              )}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {price[billingCycle]?.split(' ')[0] || '$0.00'}
            </span>
            <span className="text-gray-500 text-base font-medium">
              {price[billingCycle]?.split(' ')[1] || '/month'}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <ul className="px-6 pb-4 space-y-2 text-left">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center text-gray-700">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            {feat}
          </li>
        ))}
      </ul>

      {/* Select Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onSelect}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 ${
            title === 'Basic'
              ? 'bg-purple-600 hover:bg-purple-700'
              : title === 'Pro'
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Select Plan
        </button>
      </div>
    </div>
  );
};

export default ChangePlanCard;