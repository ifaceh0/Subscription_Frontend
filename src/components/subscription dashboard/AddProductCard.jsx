import { Check, Package, PlusCircle } from 'lucide-react';

const AddProductCard = ({ title, price, features, color, billingCycle, selectedTypes, applications, discountPercent, planIds, onSelect, isSelected }) => {
  if (!planIds[billingCycle]) return null; // Only render if planId exists

  const calculateOriginalPrice = (formattedPrice, discountPercent) => {
    if (!formattedPrice || discountPercent === 0) return null;
    const priceMatch = formattedPrice.match(/[\d.]+/);
    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
    return (price / (1 - discountPercent / 100)).toFixed(2);
  };

  const displayPrice = price[billingCycle] && price[billingCycle] !== 'N/A'
    ? price[billingCycle]
    : '$0.00 /month';

  return (
    <div
      className={`relative rounded overflow-hidden shadow-md max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Add ${title} plan`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className={`px-6 py-3 flex justify-center text-center ${color}`}>
        <div>
          <div className="mb-2 flex justify-center">
            <PlusCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-white text-sm">
            Add new features to your subscription
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
          {discountPercent[billingCycle] > 0 && (
            <div className="text-sm text-gray-400 line-through">
              Original: ${calculateOriginalPrice(displayPrice, discountPercent[billingCycle])}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {displayPrice.split(' ')[0] || '$0.00'}
            </span>
            <span className="text-gray-500 text-base font-medium">
              {displayPrice.split(' ')[1] || '/month'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 space-y-2 text-left">
        <p className="text-sm font-medium text-gray-500">Applications Included</p>
        {applications.map((app, index) => (
          <div key={index} className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <p className="text-base font-semibold text-gray-900 capitalize">
              {app}
              {selectedTypes.map(t => t.toLowerCase()).includes(app.toLowerCase()) && (
                <span className="ml-2 text-xs font-medium text-green-600">(New)</span>
              )}
            </p>
          </div>
        ))}
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
          onClick={onSelect}
          className="w-full py-2 rounded font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 bg-purple-600 hover:bg-purple-700"
          aria-label={`Add ${title} plan`}
        >
          Add Plan
        </button>
      </div>
    </div>
  );
};

export default AddProductCard;