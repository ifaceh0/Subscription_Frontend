// import { Check, Package } from 'lucide-react';

// const ChangePlanCard = ({ title, price, features, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds, onSelect, isSelected }) => {
//   if (!price[billingCycle] || price[billingCycle] === 'N/A') return null;

//   const calculateOriginalPrice = (formattedPrice, discountPercent) => {
//     if (!formattedPrice || discountPercent === 0) return null; // Return null if no discount
//     // Extract the numeric part from the formatted price (e.g., "$4.99 /month" → "4.99")
//     const priceMatch = formattedPrice.match(/[\d.]+/);
//     const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
//     return (price / (1 - discountPercent / 100)).toFixed(2);
//   };

//   const getIntervalText = () => {
//     switch (billingCycle) {
//       case 'month': return '/month';
//       case 'quarter': return '/quarter';
//       case 'year': return '/year';
//       default: return '/month';
//     }
//   };

//   return (
//     <div
//       className={`relative rounded-xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
//       onClick={onSelect}
//       role="button"
//       tabIndex={0}
//       aria-label={`Select ${title} plan`}
//       onKeyDown={(e) => e.key === 'Enter' && onSelect()}
//     >
//       <div className={`px-6 py-3 flex justify-center text-center ${color}`}>
//         <div>
//           {Icon && (
//             <div className="mb-2 flex justify-center">
//               <Icon className="h-8 w-8 text-white" />
//             </div>
//           )}
//           <h3 className="text-xl font-bold text-white">{title}</h3>
//           <p className="text-white text-sm">
//             Perfect for individuals and small teams
//           </p>
//         </div>
//       </div>

//       <div className="px-6 py-4 text-left">
//         {discountPercent[billingCycle] > 0 && (
//           <p className="text-sm text-green-600 font-medium mb-1">
//             Save {discountPercent[billingCycle]}%
//           </p>
//         )}
//         <div className="space-y-1">
//           {/* {discountPercent[billingCycle] > 0 && (
//             <div className="text-sm text-gray-400 line-through">
//               Original: ${calculateOriginalPrice(price[billingCycle], discountPercent[billingCycle])}
//             </div>
//           )}
//           <div className="flex items-baseline gap-1">
//             <span className="text-3xl font-bold text-gray-900">
//               {price[billingCycle]?.split(' ')[0] || '$0.00'}
//             </span>
//             <span className="text-gray-500 text-base font-medium">
//               {price[billingCycle]?.split(' ')[1] || '/month'}
//             </span>
//           </div> */}
//           <div className="flex items-baseline gap-1">
//             <span className="text-3xl font-bold text-gray-900">
//               {price[billingCycle] || '0.00'}  {/* ← This is now "₹ 300.00" */}
//             </span>
//             <span className="text-gray-500 text-base font-medium">
//               {getIntervalText()}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 pb-4 space-y-2 text-left">
//         <p className="text-sm font-medium text-gray-500">Applications</p>
//         {selectedTypes.map((app, index) => (
//           <div key={index} className="flex items-center gap-2">
//             <Package className="h-5 w-5 text-purple-600" />
//             <p className="text-base font-semibold text-gray-900 capitalize">{app}</p>
//           </div>
//         ))}
//       </div>

//       <ul className="px-6 pb-4 space-y-2 text-left">
//         {features.map((feat, i) => (
//           <li key={i} className="flex items-center text-gray-700">
//             <Check className="w-4 h-4 mr-2 text-green-500" />
//             {feat}
//           </li>
//         ))}
//       </ul>

//       <div className="px-6 pb-6">
//         <button
//           onClick={onSelect}
//           className="w-full py-2 rounded-full font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 bg-purple-600 hover:bg-purple-700"
//           aria-label={`Select ${title} plan`}
//         >
//           Select Plan
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChangePlanCard;







// updated code for language change
import { Check, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChangePlanCard = ({ title, price, features, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds, onSelect, isSelected }) => {
  const { t } = useTranslation();

  if (!price[billingCycle] || price[billingCycle] === 'N/A') return null;

  const calculateOriginalPrice = (formattedPrice, discountPercent) => {
    if (!formattedPrice || discountPercent === 0) return null; // Return null if no discount
    // Extract the numeric part from the formatted price (e.g., "$4.99 /month" → "4.99")
    const priceMatch = formattedPrice.match(/[\d.]+/);
    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
    return (price / (1 - discountPercent / 100)).toFixed(2);
  };

  const getIntervalText = () => {
    switch (billingCycle) {
      case 'month': return t('changePlanCard.perMonth');
      case 'quarter': return t('changePlanCard.perQuarter');
      case 'year': return t('changePlanCard.perYear');
      default: return t('changePlanCard.perMonth');
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={t('changePlanCard.aria.selectPlan', { title })}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className={`px-6 py-3 flex justify-center text-center ${color}`}>
        <div>
          {Icon && (
            <div className="mb-2 flex justify-center">
              <Icon className="h-8 w-8 text-white" />
            </div>
          )}
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-white text-sm">
            {t('changePlanCard.perfectForIndividuals')}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 text-left">
        {discountPercent[billingCycle] > 0 && (
          <p className="text-sm text-green-600 font-medium mb-1">
            {t('changePlanCard.savePercent', { percent: discountPercent[billingCycle] })}
          </p>
        )}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {price[billingCycle] || '0.00'}
            </span>
            <span className="text-gray-500 text-base font-medium">
              {getIntervalText()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 space-y-2 text-left">
        <p className="text-sm font-medium text-gray-500">{t('changePlanCard.applications')}</p>
        {selectedTypes.map((app, index) => (
          <div key={index} className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <p className="text-base font-semibold text-gray-900 capitalize">{app}</p>
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
          className="w-full py-2 rounded-full font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 bg-purple-600 hover:bg-purple-700"
          aria-label={t('changePlanCard.aria.selectPlan', { title })}
        >
          {t('changePlanCard.selectPlan')}
        </button>
      </div>
    </div>
  );
};

export default ChangePlanCard;