// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

// const Cancel = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
//       <div className="bg-white p-6 md:p-8 rounded shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-10 h-10 text-red-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 ></path>
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             Subscription Cancelled
//           </h2>
//           <p className="text-gray-600 mb-4">
//             We’re sorry to see you go. Your subscription process has been cancelled.
//           </p>
//           <button
//             onClick={() => navigate('/')}
//             className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
//           >
//             <ArrowLeft className="w-5 h-5 inline-block mr-2" />
//             Back to Plans
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cancel;







//updated code for language support
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Cancel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
      <div className="bg-white p-6 md:p-8 rounded shadow-lg transform transition-all duration-300 hover:shadow-xl w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('cancel.subscriptionCancelled')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('cancel.weAreSorry')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 inline-block mr-2" />
            {t('cancel.backToPlans')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;