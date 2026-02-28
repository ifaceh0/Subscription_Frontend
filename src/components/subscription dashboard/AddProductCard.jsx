// import { Check, Package, PlusCircle } from 'lucide-react';

// const AddProductCard = ({ title, price, features, color, billingCycle, selectedTypes, applications, discountPercent, planIds, onSelect, isSelected }) => {
//   if (!planIds[billingCycle]) return null; // Only render if planId exists

//   const calculateOriginalPrice = (formattedPrice, discountPercent) => {
//     if (!formattedPrice || discountPercent === 0) return null;
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

//   // const displayPrice = price[billingCycle] && price[billingCycle] !== 'N/A'
//   //   ? price[billingCycle]
//   //   : '$0.00 /month';
//   const displayPrice = price[billingCycle] || '0.00';

//   return (
//     <div
//       className={`relative rounded-xl overflow-hidden shadow-md max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
//       onClick={onSelect}
//       role="button"
//       tabIndex={0}
//       aria-label={`Add ${title} plan`}
//       onKeyDown={(e) => e.key === 'Enter' && onSelect()}
//     >
//       <div className={`px-6 py-3 flex justify-center text-center ${color}`}>
//         <div>
//           <div className="mb-2 flex justify-center">
//             <PlusCircle className="h-8 w-8 text-white" />
//           </div>
//           <h3 className="text-xl font-bold text-white">{title}</h3>
//           <p className="text-white text-sm">
//             Add new features to your subscription
//           </p>
//         </div>
//       </div>

//       <div className="px-6 py-4 text-left">
//         {discountPercent[billingCycle] > 0 && (
//           <p className="text-sm text-green-600 font-medium mb-1">
//             Save {discountPercent[billingCycle]}%
//           </p>
//         )}
//         {/* <div className="space-y-1">
//           {discountPercent[billingCycle] > 0 && (
//             <div className="text-sm text-gray-400 line-through">
//               Original: ${calculateOriginalPrice(displayPrice, discountPercent[billingCycle])}
//             </div>
//           )}
//           <div className="flex items-baseline gap-1">
//             <span className="text-3xl font-bold text-gray-900">
//               {displayPrice.split(' ')[0] || '$0.00'}
//             </span>
//             <span className="text-gray-500 text-base font-medium">
//               {displayPrice.split(' ')[1] || '/month'}
//             </span>
//           </div>
//         </div> */}
//         <div className="space-y-1">
//           {/* Use backend-formatted price directly */}
//           <div className="flex items-baseline gap-1">
//             <span className="text-3xl font-bold text-gray-900">
//               {price[billingCycle] || '0.00'}
//             </span>
//             <span className="text-gray-500 text-base font-medium">
//               {getIntervalText()}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 pb-4 space-y-2 text-left">
//         <p className="text-sm font-medium text-gray-500">Applications Included</p>
//         {applications.map((app, index) => (
//           <div key={index} className="flex items-center gap-2">
//             <Package className="h-5 w-5 text-purple-600" />
//             <p className="text-base font-semibold text-gray-900 capitalize">
//               {app}
//               {selectedTypes.map(t => t.toLowerCase()).includes(app.toLowerCase()) && (
//                 <span className="ml-2 text-xs font-medium text-green-600">(New)</span>
//               )}
//             </p>
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
//           aria-label={`Add ${title} plan`}
//         >
//           Add Plan
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddProductCard;











// updated code for language change
import { Check, Package, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AddProductCard = ({ title, price, features, color, billingCycle, selectedTypes, applications, discountPercent, planIds, onSelect, isSelected, onShowMore }) => {
  const { t } = useTranslation();

  if (!planIds[billingCycle]) return null;

  const calculateOriginalPrice = (formattedDiscounted, discountPercent) => {
    if (!formattedDiscounted || discountPercent <= 0) return null;

    const numeric = parseFloat(formattedDiscounted.replace(/[^0-9.]/g, '')) || 0;
    if (numeric === 0) return null;

    const original = numeric / (1 - discountPercent / 100);

    const currencySymbol = formattedDiscounted.replace(/[0-9., ]/g, '').trim() || '$';

    return `${currencySymbol} ${original.toFixed(2)}`;
  };

  const getIntervalText = () => {
    switch (billingCycle) {
      case 'month': return t('addProductCard.perMonth');
      case 'quarter': return t('addProductCard.perQuarter');
      case 'year': return t('addProductCard.perYear');
      default: return t('addProductCard.perMonth');
    }
  };

  const displayPrice = price[billingCycle] || '0.00';

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-md max-w-sm bg-white flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
      // onClick={onSelect}
      // role="button"
      // tabIndex={0}
      // aria-label={t('addProductCard.aria.addPlan', { title })}
      // onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className={`px-5 py-4 sm:px-6 sm:py-5 flex justify-center text-center ${color}`}>
        <div>
          <div className="mb-2 flex justify-center">
            <PlusCircle className="h-9 w-9 sm:h-10 sm:w-10 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          <p className="text-white text-sm sm:text-base mt-1">
            {t('addProductCard.addNewFeatures')}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 text-left">
        {discountPercent[billingCycle] > 0 && (
          <p className="text-sm text-green-600 font-medium mb-1">
            {t('addProductCard.savePercent', { percent: discountPercent[billingCycle] })}
          </p>
        )}
        <div className="space-y-1">
          {discountPercent[billingCycle] > 0 && (
            <div className="text-sm text-gray-400 line-through">
              {t('subscriptionCard.originalPrice', {
                price: calculateOriginalPrice(price[billingCycle], discountPercent[billingCycle])
              })}
            </div>
          )}
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
        <p className="text-sm font-medium text-gray-500">{t('addProductCard.applicationsIncluded')}</p>
        {applications.map((app, index) => (
          <div key={index} className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <p className="text-base font-semibold text-gray-900 capitalize">
              {app}
              {selectedTypes.map(t => t.toLowerCase()).includes(app.toLowerCase()) && (
                <span className="ml-2 text-xs font-medium text-green-600">({t('addProductCard.new')})</span>
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
        <li className="pt-3">
          <button
            onClick={onShowMore}
            className="flex items-center gap-1.5 text-violet-600 hover:text-violet-800 font-medium text-sm transition-colors"
            type="button"
          >
            {t('subscriptionCard.viewFullPlanDetails') || 'View full plan details →'}
          </button>
        </li>
      </ul>

      <div className="px-6 pb-6">
        <button
          onClick={onSelect}
          className="w-full py-2 rounded-full font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 bg-purple-600 hover:bg-purple-700"
          aria-label={t('addProductCard.aria.addPlan', { title })}
        >
          {t('addProductCard.addPlan')}
        </button>
      </div>
    </div>
  );
};

export default AddProductCard;