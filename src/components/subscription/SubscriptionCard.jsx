// import { Check, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next';

// const SubscriptionCard = ({ title, price, features, buttonText, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds, onShowMore, }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const handleAccessClick = () => {
//     if (!planIds[billingCycle]) {
//       toast.error(t('subscriptionCard.noValidPlanId', { title, billingCycle }));
//       return;
//     }
//     navigate(`/plan/${title.toLowerCase()}`, {
//       state: {
//         planId: planIds[billingCycle],
//         planTitle: title,
//         billingCycle,
//         selectedTypes,
//         price: price[billingCycle],
//         features,
//         discountPercent: discountPercent[billingCycle],
//       },
//     });
//   };

//   const calculateOriginalPrice = (formattedDiscounted, discountPercent) => {
//     if (!formattedDiscounted || discountPercent <= 0) return null;

//     const numeric = parseFloat(formattedDiscounted.replace(/[^0-9.]/g, '')) || 0;
//     if (numeric === 0) return null;

//     const original = numeric / (1 - discountPercent / 100);

//     const currencySymbol = formattedDiscounted.replace(/[0-9., ]/g, '').trim() || '$';

//     return `${currencySymbol} ${original.toFixed(2)}`;
//   };

//   // const calculateOriginalPrice = (discountedPrice, discountPercent) => {
//   //   if (!discountedPrice || discountPercent === 0) return null;
//   //   const price = parseFloat(discountedPrice.replace(/[^0-9.]/g, '') || 0);
//   //   return `${(price / (1 - discountPercent / 100)).toFixed(2)}`;
//   // };

//   const getIntervalText = () => {
//     switch (billingCycle) {
//       case 'month':
//         return t('subscriptionCard.perMonth');
//       case 'quarter':
//         return t('subscriptionCard.perQuarter');
//       case 'year':
//         return t('subscriptionCard.perYear');
//       default:
//         return t('subscriptionCard.perMonth');
//     }
//   };

//   const displayPrice = price[billingCycle] || '$0.00';
//   const priceValue = parseFloat(displayPrice.replace(/[^0-9.]/g, '') || 0);

//   return (
//     <div
//       className={`relative rounded-xl overflow-hidden shadow-lg w-full max-w-sm bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
//         title === 'Pro' ? 'ring-4 ring-yellow-300' : ''
//       }`}
//     >
//       {title === 'Pro' && (
//         <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 px-2 py-1 text-xs font-semibold rounded-full">
//           {t('subscriptionCard.mostPopular')}
//         </div>
//       )}

//       <div className={`px-6 py-2.5 flex justify-center text-center ${color}`}>
//         <div>
//           {Icon && (
//             <div className="mb-2 flex justify-center">
//               <Icon className="h-8 w-8 text-white" />
//             </div>
//           )}
//           <h3 className="text-xl font-bold text-white">{title}</h3>
//           <p className="text-white text-sm">
//             {title === 'Basic'
//               ? t('subscriptionCard.basicSubtitle')
//               : title === 'Pro'
//               ? t('subscriptionCard.proSubtitle')
//               : t('subscriptionCard.enterpriseSubtitle')}
//           </p>
//         </div>
//       </div>

//       <div className="px-6 py-4 text-left">
//         {discountPercent?.[billingCycle] > 0 && (
//           <p className="text-sm text-green-600 font-medium mb-1">
//             {t('subscriptionCard.savePercent', { percent: discountPercent[billingCycle] })}
//           </p>
//         )}
//         <div className="space-y-1">
//           {/* {discountPercent?.[billingCycle] > 0 && calculateOriginalPrice(displayPrice, discountPercent[billingCycle]) && (
//             <div className="text-sm text-gray-400 line-through">
//               {t('subscriptionCard.originalPrice', {
//                 price: calculateOriginalPrice(displayPrice, discountPercent[billingCycle]),
//               })}
//             </div>
//           )} */}
//           {discountPercent?.[billingCycle] > 0 && (
//             <div className="text-sm text-gray-400 line-through">
//               {t('subscriptionCard.originalPrice', {
//                 price: calculateOriginalPrice(price[billingCycle], discountPercent[billingCycle])
//               })}
//             </div>
//           )}
//           <div className="flex items-baseline gap-1">
//             <span className="text-3xl font-bold text-gray-900">{displayPrice}</span>
//             <span className="text-gray-500 text-base font-medium">{getIntervalText()}</span>
//           </div>
//         </div>
//       </div>

//       <ul className="px-6 pb-3 space-y-2.5 text-left flex-grow">
//         {features.map((feat, i) => (
//           <li key={i} className="flex items-start text-gray-700">
//             <Check className="w-5 h-5 mr-2.5 text-green-500 flex-shrink-0 mt-0.5" />
//             <span>{feat}</span>
//           </li>
//         ))}

//         <li className="pt-3">
//           <button
//             onClick={onShowMore}
//             className="flex items-center gap-1.5 text-violet-600 hover:text-violet-800 font-medium text-sm transition-colors"
//             type="button"
//           >
//             {t('subscriptionCard.viewFullPlanDetails')}
//           </button>
//         </li>
//       </ul>

//       <div className="px-6 pb-3 mt-4">
//         <button
//           onClick={handleAccessClick}
//           className={`w-full py-2 rounded-full font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 ${
//             title === 'Basic'
//               ? 'bg-purple-600 hover:bg-purple-700'
//               : title === 'Pro'
//               ? 'bg-orange-500 hover:bg-orange-600'
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//           aria-label={`Select ${title} plan`}
//         >
//           {buttonText || t('subscriptionCard.access')}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionCard;











import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const SubscriptionCard = ({ title, price, features, buttonText, color, icon: Icon, billingCycle, selectedTypes, discountPercent, planIds, onShowMore }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAccessClick = () => {
    if (!planIds[billingCycle]) {
      toast.error(t('subscriptionCard.noValidPlanId', { title, billingCycle }));
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

  const calculateOriginalPrice = (formattedDiscounted, discount) => {
    if (!formattedDiscounted || !discount || discount <= 0) return null;
    const numeric = parseFloat(formattedDiscounted.replace(/[^0-9.]/g, '')) || 0;
    if (numeric === 0) return null;
    const original = numeric / (1 - discount / 100);
    const currencySymbol = formattedDiscounted.replace(/[0-9., ]/g, '').trim() || '$';
    return `${currencySymbol}${original.toFixed(2)}`;
  };

  const getIntervalText = () => {
    const keys = { month: 'perMonth', quarter: 'perQuarter', year: 'perYear' };
    return t(`subscriptionCard.${keys[billingCycle] || 'perMonth'}`);
  };

  const displayPrice = price[billingCycle] || '$0.00';
  const currentDiscount = discountPercent?.[billingCycle];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative flex flex-col w-full bg-white rounded-[1rem] p-7 border transition-all duration-300 ${
        title === 'Pro' 
          ? 'border-violet-200 shadow-[0_20px_50px_rgba(124,58,237,0.08)]' 
          : 'border-slate-100 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Popular Badge */}
      {title === 'Pro' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-violet-200">
          <Sparkles className="w-3 h-3" />
          {t('subscriptionCard.mostPopular')}
        </div>
      )}

      {/* Header Area */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mt-1">
            {title === 'Basic' ? t('subscriptionCard.basicSubtitle') : 
            title === 'Pro' ? t('subscriptionCard.proSubtitle') : 
            t('subscriptionCard.enterpriseSubtitle')}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
          {Icon && <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />}
        </div>
      </div>

      {/* Pricing Area */}
      <div className="pb-8 border-b border-slate-50">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{displayPrice}</span>
          <span className="text-slate-400 text-sm font-medium">{getIntervalText()}</span>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          {currentDiscount > 0 && (
            <>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                -{currentDiscount}%
              </span>
              <span className="text-xs text-slate-400 line-through">
                {calculateOriginalPrice(displayPrice, currentDiscount)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="flex-grow mb-8">
        <ul className="space-y-4">
          {features.slice(0, 5).map((feat, i) => (
            <li key={i} className="flex items-start text-sm text-slate-600 group">
              <div className="mr-3 mt-0.5 rounded-full bg-slate-50 p-0.5 group-hover:bg-emerald-50 transition-colors">
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3px]" />
              </div>
              <span className="leading-snug">{feat}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onShowMore}
          className="mt-6 text-xs font-bold text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1 uppercase tracking-wider"
        >
          {t('subscriptionCard.viewFullPlanDetails')}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAccessClick}
        className={`group w-full py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          title === 'Pro' 
            ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-100' 
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        {buttonText || t('subscriptionCard.access')}
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </button>
    </motion.div>
  );
};

export default SubscriptionCard;