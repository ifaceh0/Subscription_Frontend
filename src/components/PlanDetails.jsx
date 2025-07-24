// src/components/PlanDetails.jsx

import { useParams } from 'react-router-dom';
import { useState } from 'react';

const planDetails = {
  basic: {
    title: 'Basic',
    price: '₹199/month',
    features: ['Feature A', 'Feature B', 'Feature C'],
  },
  pro: {
    title: 'Pro',
    price: '₹499/month',
    features: ['Feature A', 'Feature B', 'Feature C', 'Priority Support'],
  },
  enterprise: {
    title: 'Enterprise',
    price: '₹999/month',
    features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Manager'],
  },
};

const PlanDetails = () => {
  const { planType } = useParams();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const selectedPlan = planDetails[planType?.toLowerCase()];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Subscribing ${email} to ${selectedPlan.title}`);
    setSubscribed(true);
  };

  if (!selectedPlan) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        🚫 Plan not found. Please check the URL.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-2">{selectedPlan.title} Plan</h2>
      <p className="text-lg mb-4 text-gray-700">{selectedPlan.price}</p>

      <ul className="list-disc ml-5 mb-6 text-gray-700">
        {selectedPlan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Enter your email</span>
          <input
            type="email"
            required
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSubscribed(false); // reset on input change
            }}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            placeholder="you@example.com"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-150"
        >
          Confirm Subscription
        </button>
      </form>

      {subscribed && (
        <p className="text-green-600 mt-4 font-medium">
          🎉 You’ve successfully subscribed to the {selectedPlan.title} plan!
        </p>
      )}
    </div>
  );
};

export default PlanDetails;
