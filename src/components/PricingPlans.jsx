// import React from 'react';
// import { useTranslation } from "react-i18next";

// const PricingTable = () => {
//   const { t } = useTranslation();
//   const plans = [
//     {
//       name: "BASIC",
//       subtitle: "Software Only (Independent)",
//       bestFor: "Businesses want to do everything on their own",
//       positioning: "Use the platform independently. Add help only when you need it.",
//       features: {
//         "Full access to applications": true,
//         "All standard product features": true,
//         "Self-service usage": true,
//         "Knowledge base / documentation": true,
//         "Included service hours": "No",
//         "Optional Service Hours Pack": "Available",
//       },
//       support: {
//         "Support Type": "Email (Technical only)",
//         "Response Time": "72 business-hours",
//         "Phone/Zoom Support": "None",
//       }
//     },
//     {
//       name: "PRO",
//       subtitle: "Software + Included Service Hours",
//       bestFor: "Businesses that want occasional help",
//       positioning: "A little expert help included — no long-term commitment.",
//       features: {
//         "Full access to applications": true,
//         "All standard product features": true,
//         "Self-service usage": true,
//         "Knowledge base / documentation": true,
//         "Included service hours": "3 hours/mo (30m blocks)",
//         "Optional Service Hours Pack": "Available",
//       },
//       support: {
//         "Support Type": "Priority Email",
//         "Response Time": "24–48 business-hours",
//         "Phone/Zoom Support": "2 calls/month",
//       }
//     },
//     {
//       name: "ENTERPRISE",
//       subtitle: "Software + Managed Service Hours",
//       bestFor: "Businesses that want predictable, hands-off support",
//       positioning: "Predictable support hours with proactive service.",
//       features: {
//         "Full access to applications": true,
//         "All standard product features": true,
//         "Self-service usage": true,
//         "Knowledge base / documentation": true,
//         "Included service hours": "5 hours/mo (30m blocks)",
//         "Optional Service Hours Pack": "Available",
//       },
//       support: {
//         "Support Type": "Dedicated Email",
//         "Response Time": "24 business-hours",
//         "Phone/Zoom Support": "5 calls/month",
//       }
//     }
//   ];

//   const featureRows = Object.keys(plans[0].features);
//   const supportRows = Object.keys(plans[0].support);

//   return (
//     <div className="max-w-8xl mx-auto px-4 py-12 font-sans text-slate-800">
//       <h2 className="text-3xl font-bold text-center text-[#0a1b3d] mb-12">Compare features across plans</h2>
      
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr>
//               <th className="py-4 px-6 w-1/4"></th>
//               {plans.map((plan) => (
//                 <th key={plan.name} className="py-4 px-6 text-center">
//                   <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{plan.name}</div>
//                   <div className="text-xs text-slate-400 font-normal mb-2">{plan.subtitle}</div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
          
//           <tbody>
//             {/* Best For Row */}
//             <tr className="border-t border-slate-100">
//               <td className="py-4 px-6 font-bold text-[#0a1b3d]">Best For</td>
//               {plans.map((plan) => (
//                 <td key={plan.name} className="py-4 px-6 text-center text-sm text-slate-600 italic">
//                   "{plan.bestFor}"
//                 </td>
//               ))}
//             </tr>

//             {/* Features Section */}
//             <tr>
//               <td colSpan={4} className="py-6 px-6 font-black text-[#0a1b3d] uppercase tracking-widest text-sm bg-slate-50/50">What's Included</td>
//             </tr>
//             {featureRows.map((row) => (
//               <tr key={row} className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors">
//                 <td className="py-4 px-6 text-sm text-slate-700">{row}</td>
//                 {plans.map((plan) => (
//                   <td key={plan.name} className="py-4 px-6 text-center">
//                     {typeof plan.features[row] === 'boolean' ? (
//                       plan.features[row] ? (
//                         <CheckIcon />
//                       ) : (
//                         <span className="text-red-400">✕</span>
//                       )
//                     ) : (
//                       <span className="text-sm font-medium text-slate-700">{plan.features[row]}</span>
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}

//             {/* Support Section */}
//             <tr>
//               <td colSpan={4} className="py-6 px-6 font-black text-[#0a1b3d] uppercase tracking-widest text-sm bg-slate-50/50">Support</td>
//             </tr>
//             {supportRows.map((row) => (
//               <tr key={row} className="border-t border-slate-50 hover:bg-slate-50/30">
//                 <td className="py-4 px-6 text-sm text-slate-700">{row}</td>
//                 {plans.map((plan) => (
//                   <td key={plan.name} className="py-4 px-6 text-center text-sm font-medium text-slate-700">
//                     {plan.support[row]}
//                   </td>
//                 ))}
//               </tr>
//             ))}

//             {/* Positioning / Footer Row */}
//             <tr className="border-t border-slate-200 bg-[#f8fafc]">
//               <td className="py-6 px-6 font-bold text-[#0a1b3d]">Positioning</td>
//               {plans.map((plan) => (
//                 <td key={plan.name} className="py-6 px-6 text-center text-xs font-semibold text-[#0a1b3d]">
//                   {plan.positioning}
//                 </td>
//               ))}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // Simple reusable Check Icon component
// const CheckIcon = () => (
//   <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
//     <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//     </svg>
//   </div>
// );

// export default PricingTable;







import React from "react";
import { useTranslation } from "react-i18next";

const PricingTable = () => {
  const { t } = useTranslation();

  const plans = [
    {
      key: "basic",
      features: {
        fullAccess: true,
        standardFeatures: true,
        selfService: true,
        knowledgeBase: true,
        includedHours: t("pricingTable.featureValues.no"),
        optionalHours: t("pricingTable.featureValues.available"),
      },
      support: {
        supportType: t("pricingTable.supportValues.emailTechnical"),
        responseTime: t("pricingTable.supportValues.response72"),
        phoneSupport: t("pricingTable.supportValues.noPhone"),
      },
    },
    {
      key: "pro",
      features: {
        fullAccess: true,
        standardFeatures: true,
        selfService: true,
        knowledgeBase: true,
        includedHours: t("pricingTable.featureValues.proHours"),
        optionalHours: t("pricingTable.featureValues.available"),
      },
      support: {
        supportType: t("pricingTable.supportValues.priorityEmail"),
        responseTime: t("pricingTable.supportValues.response48"),
        phoneSupport: t("pricingTable.supportValues.twoCalls"),
      },
    },
    {
      key: "enterprise",
      features: {
        fullAccess: true,
        standardFeatures: true,
        selfService: true,
        knowledgeBase: true,
        includedHours: t("pricingTable.featureValues.enterpriseHours"),
        optionalHours: t("pricingTable.featureValues.available"),
      },
      support: {
        supportType: t("pricingTable.supportValues.dedicatedEmail"),
        responseTime: t("pricingTable.supportValues.response24"),
        phoneSupport: t("pricingTable.supportValues.fiveCalls"),
      },
    },
  ];

  const featureRows = [
    "fullAccess",
    "standardFeatures",
    "selfService",
    "knowledgeBase",
    "includedHours",
    "optionalHours",
  ];

  const supportRows = ["supportType", "responseTime", "phoneSupport"];

  return (
    <div className="max-w-8xl mx-auto px-4 py-12 font-sans text-slate-800">
      <h2 className="text-3xl font-bold text-center text-[#0a1b3d] mb-12">
        {t("pricingTable.title")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-6 w-1/4"></th>

              {plans.map((plan) => (
                <th key={plan.key} className="py-4 px-6 text-center">
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {t(`pricingTable.plans.${plan.key}.name`)}
                  </div>

                  <div className="text-xs text-slate-400 font-normal mb-2">
                    {t(`pricingTable.plans.${plan.key}.subtitle`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Best For Row */}
            <tr className="border-t border-slate-100">
              <td className="py-4 px-6 font-bold text-[#0a1b3d]">
                {t("pricingTable.bestFor")}
              </td>

              {plans.map((plan) => (
                <td
                  key={plan.key}
                  className="py-4 px-6 text-center text-sm text-slate-600 italic"
                >
                  "{t(`pricingTable.plans.${plan.key}.bestFor`)}"
                </td>
              ))}
            </tr>

            {/* Features Section */}
            <tr>
              <td
                colSpan={4}
                className="py-6 px-6 font-black text-[#0a1b3d] uppercase tracking-widest text-sm bg-slate-50/50"
              >
                {t("pricingTable.whatsIncluded")}
              </td>
            </tr>

            {featureRows.map((row) => (
              <tr
                key={row}
                className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors"
              >
                <td className="py-4 px-6 text-sm text-slate-700">
                  {t(`pricingTable.features.${row}`)}
                </td>

                {plans.map((plan) => (
                  <td key={plan.key} className="py-4 px-6 text-center">
                    {typeof plan.features[row] === "boolean" ? (
                      plan.features[row] ? (
                        <CheckIcon />
                      ) : (
                        <span className="text-red-400">✕</span>
                      )
                    ) : (
                      <span className="text-sm font-medium text-slate-700">
                        {plan.features[row]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Support Section */}
            <tr>
              <td
                colSpan={4}
                className="py-6 px-6 font-black text-[#0a1b3d] uppercase tracking-widest text-sm bg-slate-50/50"
              >
                {t("pricingTable.support")}
              </td>
            </tr>

            {supportRows.map((row) => (
              <tr
                key={row}
                className="border-t border-slate-50 hover:bg-slate-50/30"
              >
                <td className="py-4 px-6 text-sm text-slate-700">
                  {t(`pricingTable.supportRows.${row}`)}
                </td>

                {plans.map((plan) => (
                  <td
                    key={plan.key}
                    className="py-4 px-6 text-center text-sm font-medium text-slate-700"
                  >
                    {plan.support[row]}
                  </td>
                ))}
              </tr>
            ))}

            {/* Positioning */}
            <tr className="border-t border-slate-200 bg-[#f8fafc]">
              <td className="py-6 px-6 font-bold text-[#0a1b3d]">
                {t("pricingTable.positioning")}
              </td>

              {plans.map((plan) => (
                <td
                  key={plan.key}
                  className="py-6 px-6 text-center text-xs font-semibold text-[#0a1b3d]"
                >
                  {t(`pricingTable.plans.${plan.key}.positioning`)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
    <svg
      className="w-4 h-4 text-emerald-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
);

export default PricingTable;