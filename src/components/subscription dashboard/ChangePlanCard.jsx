// import { Check, Package } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// const ChangePlanCard = ({ title, price, features, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds, onSelect, isSelected, onShowMore }) => {
//   const { t } = useTranslation();

//   if (!price[billingCycle] || price[billingCycle] === 'N/A') return null;

//   // const calculateOriginalPrice = (formattedPrice, discountPercent) => {
//   //   if (!formattedPrice || discountPercent === 0) return null; // Return null if no discount
//   //   // Extract the numeric part from the formatted price (e.g., "$4.99 /month" → "4.99")
//   //   const priceMatch = formattedPrice.match(/[\d.]+/);
//   //   const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
//   //   return (price / (1 - discountPercent / 100)).toFixed(2);
//   // };
//   const calculateOriginalPrice = (formattedDiscounted, discountPercent) => {
//     if (!formattedDiscounted || discountPercent <= 0) return null;

//     const numeric = parseFloat(formattedDiscounted.replace(/[^0-9.]/g, '')) || 0;
//     if (numeric === 0) return null;

//     const original = numeric / (1 - discountPercent / 100);

//     const currencySymbol = formattedDiscounted.replace(/[0-9., ]/g, '').trim() || '$';

//     return `${currencySymbol} ${original.toFixed(2)}`;
//   };

//   const getIntervalText = () => {
//     switch (billingCycle) {
//       case 'month': return t('changePlanCard.perMonth');
//       case 'quarter': return t('changePlanCard.perQuarter');
//       case 'year': return t('changePlanCard.perYear');
//       default: return t('changePlanCard.perMonth');
//     }
//   };

//   return (
//     <div
//       className={`relative rounded-xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
//       // onClick={onSelect}
//       // role="button"
//       // tabIndex={0}
//       // aria-label={t('changePlanCard.aria.selectPlan', { title })}
//       // onKeyDown={(e) => e.key === 'Enter' && onSelect()}
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
//             {t('changePlanCard.perfectForIndividuals')}
//           </p>
//         </div>
//       </div>

//       <div className="px-6 py-4 text-left">
//         {discountPercent[billingCycle] > 0 && (
//           <p className="text-sm text-green-600 font-medium mb-1">
//             {t('changePlanCard.savePercent', { percent: discountPercent[billingCycle] })}
//           </p>
//         )}
//         <div className="space-y-1">
//           {discountPercent[billingCycle] > 0 && calculateOriginalPrice(price[billingCycle], discountPercent[billingCycle]) && (
//             <div className="text-sm text-gray-400 line-through">
//               {t('subscriptionCard.originalPrice', {
//                 price: calculateOriginalPrice(price[billingCycle], discountPercent[billingCycle])
//               })}
//               {/* {calculateOriginalPrice(price[billingCycle], discountPercent[billingCycle])} */}
//             </div>
//           )}
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
//         <p className="text-sm font-medium text-gray-500">{t('changePlanCard.applications')}</p>
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
//         <li className="pt-3">
//           <button
//             onClick={onShowMore}
//             className="flex items-center gap-1.5 text-violet-600 hover:text-violet-800 font-medium text-sm transition-colors"
//             type="button"
//           >
//             {t('subscriptionCard.viewFullPlanDetails') || 'View full plan details →'}
//             {/* <ChevronDown className="w-4 h-4" /> */}
//           </button>
//         </li>
//       </ul>

//       <div className="px-6 pb-6">
//         <button
//           onClick={onSelect}
//           className="w-full py-2 rounded-full font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-1 bg-purple-600 hover:bg-purple-700"
//           aria-label={t('changePlanCard.aria.selectPlan', { title })}
//         >
//           {t('changePlanCard.selectPlan')}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChangePlanCard;










import { Check, Package, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChangePlanCard = ({ title, price, features, color, billingCycle, selectedTypes, discountPercent, onSelect, isSelected, onShowMore }) => {
  const { t } = useTranslation();

  if (!price[billingCycle] || price[billingCycle] === 'N/A') return null;

  const calculateOriginalPrice = (formattedDiscounted, discount) => {
    if (!formattedDiscounted || discount <= 0) return null;
    const numeric = parseFloat(formattedDiscounted.replace(/[^0-9.]/g, '')) || 0;
    const original = numeric / (1 - discount / 100);
    const currencySymbol = formattedDiscounted.replace(/[0-9., ]/g, '').trim() || '$';
    return `${currencySymbol} ${original.toFixed(2)}`;
  };

  const currentDiscount = discountPercent[billingCycle];

  return (
    <div className={`relative flex flex-col h-full rounded-[1rem] border-2 transition-all duration-500 bg-white ${
      isSelected 
        ? 'border-violet-600 shadow-2xl shadow-violet-100 scale-[1.02] z-10' 
        : 'border-slate-100 hover:border-slate-200 shadow-sm'
    }`}>
      
      {/* Popular Tag (Optional logic for Pro) */}
      {title === 'Pro' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
          {t("changePlanCard.mostPopular")}
        </div>
      )}

      <div className="p-6 pb-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">
              {t("changePlanCard.bestForYourNeeds")}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} bg-opacity-10`}>
             <div className={`w-3 h-3 rounded-full ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {price[billingCycle]}
            </span>
            <span className="text-slate-400 text-sm font-bold uppercase">
              /{billingCycle === 'month' ? 'mo' : billingCycle === 'year' ? 'yr' : 'qt'}
            </span>
          </div>
          
          {currentDiscount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs line-through text-slate-300 font-bold">
                {calculateOriginalPrice(price[billingCycle], currentDiscount)}
              </span>
              <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                {/* Save {currentDiscount}% */}
                {t("changePlanCard.savePercent", { percent: currentDiscount })}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("changePlanCard.topFeatures")}</p>
          <ul className="space-y-3">
            {features.slice(0, 4).map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium leading-tight">
                <div className="w-5 h-5 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-violet-600 stroke-[3]" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
          <button 
            onClick={onShowMore}
            className="text-violet-600 text-xs font-bold hover:underline underline-offset-4 flex items-center gap-1"
          >
            {t("changePlanCard.fullFeatureList")} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mt-auto p-8 pt-0">
        <button
          onClick={onSelect}
          className={`w-full py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 ${
            isSelected 
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
              : 'bg-slate-700 text-white hover:bg-slate-800'
          }`}
        >
          {/* {isSelected ? 'Current Selection' : `Select ${title}`} */}
          {isSelected
            ? t("changePlanCard.currentSelection")
            : t("changePlanCard.selectPlanFor", { title })}
        </button>
      </div>
    </div>
  );
};

export default ChangePlanCard;