import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BoltIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 bg-white border-t-4 border-${color}-500`}
  >
    <Icon className={`w-10 h-10 text-${color}-600 mb-4`} />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="pt-20 pb-28 bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            Your Business, Streamlined
          </p>
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Seamless Subscription Management Platform
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Manage customers, track payments, and analyze performance all in one place. Start your free trial today and scale effortlessly.
          </p>
          
          {/* Main Call-to-Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => navigate('/subscription')}
              className="px-8 py-4 text-lg font-semibold bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Explore subscription plans"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Plans <ArrowRightIcon className="w-5 h-5 inline ml-2 -mt-1" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/subscription-dashboard')}
              className="px-8 py-4 text-lg font-semibold bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Go to the Dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Feature Section (Demo Design) */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Powerful Features for Growth
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Everything you need to manage your recurring revenue business.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ChartBarIcon}
              title="Advanced Analytics"
              description="Gain deep insights into your business performance with real-time reporting and customizable dashboards."
              color="blue"
            />
            <FeatureCard 
              icon={BoltIcon}
              title="Automated Billing"
              description="Reduce manual work with automatic invoicing, dunning, and payment processing for all your subscribers."
              color="pink"
            />
            <FeatureCard 
              icon={ArrowRightIcon} // Reusing ArrowRightIcon for simplicity
              title="Seamless Integrations"
              description="Connect with your existing CRM, accounting, and marketing tools for a unified workflow."
              color="green"
            />
          </div>
          
          {/* Admin Panel Button Section (Optional secondary action) */}
          <div className="text-center mt-16">
             <motion.button
              onClick={() => navigate('/admin')}
              className="text-md font-medium text-gray-600 hover:text-indigo-600 transition-colors flex items-center justify-center mx-auto"
              aria-label="Admin panel"
              whileHover={{ x: 5 }}
            >
              Already an Admin? Access the Panel
            </motion.button>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default HomePage;