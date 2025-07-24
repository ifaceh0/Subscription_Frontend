
// src/components/PlanDetails.jsx

// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// const PlanDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [subscribed, setSubscribed] = useState(false);

//   // Fallback message if no state is passed
//   if (!state) {
//     return (
//       <div className="text-center mt-10 px-6">
//         <p className="text-xl text-red-500 font-semibold mb-4">⚠️ No subscription details found.</p>
//         <button
//           onClick={() => navigate('/subscription')}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
//         >
//           Go Back to Plans
//         </button>
//       </div>
//     );
//   }

//   const { planTitle, billingCycle, selectedTypes, price, features } = state;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(`Subscribing ${email} to ${planTitle} plan for ${selectedTypes.join(', ')}`);
//     setSubscribed(true);
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
//       <h2 className="text-3xl font-bold mb-2 text-purple-700 text-center">
//         {planTitle} Plan Summary
//       </h2>
//       <p className="text-center text-gray-600 mb-4">
//         Billing: <strong>{billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}</strong> |
//         Applications: <strong>{selectedTypes.join(', ')}</strong>
//       </p>

//       {/* Price */}
//       <div className="text-center text-2xl font-bold text-blue-600 mb-6">{price}</div>

//       {/* Feature List */}
//       <ul className="list-disc ml-6 text-gray-700 mb-6">
//         {features.map((feature, i) => (
//           <li key={i}>{feature}</li>
//         ))}
//       </ul>

//       {/* Email Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <label className="block">
//           <span className="text-gray-700 font-medium">Enter your email</span>
//           <input
//             type="email"
//             required
//             pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               setSubscribed(false);
//             }}
//             className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             placeholder="you@example.com"
//           />
//         </label>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-150"
//         >
//           Confirm Subscription
//         </button>
//       </form>

//       {subscribed && (
//         <p className="text-green-600 mt-4 font-medium text-center">
//           🎉 You’ve successfully subscribed to the <strong>{planTitle}</strong> plan!
//         </p>
//       )}
//     </div>
//   );
// };

// export default PlanDetails;






import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PlanDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Fallback message if no state is passed
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <p className="text-2xl text-red-600 font-semibold mb-6 flex items-center justify-center gap-2">
            <span>⚠️</span> No subscription details found
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back to Plans
          </button>
        </motion.div>
      </div>
    );
  }

  const { planTitle, billingCycle, selectedTypes, price, features, discountPercent } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          planName: planTitle,
          billingCycle,
          selectedTypes,
          price: price.split(' ')[0].replace('$', ''),
          discountPercent,
        }),
      });
      if (!response.ok) {
        throw new Error('Subscription failed');
      }
      setSubscribed(true);
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full"
      >
        <h2 className="text-4xl font-extrabold text-purple-800 text-center mb-4">
          {planTitle} Plan
        </h2>
        <div className="text-center text-gray-600 mb-6">
          <div className="flex justify-center gap-4 text-sm font-medium">
            <span>
              Billing:{' '}
              <strong className="text-purple-700">
                {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}
              </strong>
            </span>
            <span>
              Apps:{' '}
              <strong className="text-purple-700">{selectedTypes.join(', ')}</strong>
            </span>
            {discountPercent > 0 && (
              <span>
                Discount:{' '}
                <strong className="text-green-600">{discountPercent}%</strong>
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-center text-3xl font-bold text-blue-700 mb-8">
          {price}
        </div>

        {/* Feature List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What’s Included
          </h3>
          <ul className="space-y-3 text-gray-700">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-gray-800 font-medium">Your Email</span>
            <input
              type="email"
              required
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubscribed(false);
              }}
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            Confirm Subscription
          </button>
        </form>

        {subscribed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-green-600 mt-6 font-medium text-center flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Successfully subscribed to the <strong>{planTitle}</strong> plan!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PlanDetails;