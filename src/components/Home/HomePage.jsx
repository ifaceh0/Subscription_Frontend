import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  CheckCircleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="group flex items-start gap-5 p-7 bg-white rounded border border-gray-100 
               hover:border-violet-200 hover:shadow-lg transition-all duration-400"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded flex items-center justify-center 
                    group-hover:bg-violet-600 transition-colors duration-300">
      <Icon className="w-7 h-7 text-violet-600 group-hover:text-white transition-colors" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/30">

      {/* Hero Section – Clean & Powerful */}
      <section className="pt-18 pb-6 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 
                            px-5 py-2.5 rounded-full text-sm font-semibold mb-8">
              <CheckCircleIcon className="w-5 h-5" />
              Centralized Subscription Management
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-7 leading-tight">
              All your subscriptions.<br />
              <span className="text-violet-600">One platform.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Automate billing, manage customers, reduce churn, and grow recurring revenue — 
              with a system built for clarity and control.
            </p>

            {/* Primary CTA Buttons – Centered & Prominent */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/subscription')}
                className="px-10 py-4 bg-violet-600 text-white font-semibold text-lg rounded
                           shadow-xl hover:bg-violet-700 hover:shadow-2xl transition-all duration-300 
                           flex items-center gap-3 min-w-[240px] justify-center"
              >
                Start Free Trial
                <ArrowRightIcon className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/subscription-dashboard')}
                className="px-10 py-4 bg-white text-violet-700 font-semibold text-lg rounded 
                           border-2 border-violet-200 hover:border-violet-300 hover:bg-violet-50 
                           transition-all duration-300 min-w-[240px]"
              >
                View Dashboard
              </motion.button>
            </div>

            {/* Trust Line */}
            <p className="text-sm text-gray-500">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section – Clean Grid, Better Spacing */}
      <section className="py-18 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Everything you need. Nothing you don’t.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete subscription platform designed for growing businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            <Feature
              icon={UsersIcon}
              title="Customer Management"
              description="Full customer profiles with subscription history, invoices, payment methods, and activity."
            />
            <Feature
              icon={CurrencyDollarIcon}
              title="Automated Billing"
              description="Recurring charges, dunning, proration, taxes, coupons — all handled automatically."
            />
            <Feature
              icon={ChartBarIcon}
              title="Revenue Analytics"
              description="Track MRR, churn, LTV, cohort retention, and forecast growth with real-time dashboards."
            />
            <Feature
              icon={BellIcon}
              title="Smart Alerts"
              description="Instant notifications for failed payments, renewals, cancellations, and key events."
            />
            <Feature
              icon={ArrowPathIcon}
              title="Workflow Automation"
              description="Trigger emails, webhooks, and actions on any subscription event — no code needed."
            />
            <Feature
              icon={ShieldCheckIcon}
              title="Enterprise Security"
              description="SOC 2 compliant, encrypted data, role-based access, audit logs, and 99.9% uptime."
            />
          </div>
        </div>
      </section>

      {/* Final CTA – Full Width, Strong Close */}
      <section className="py-18 bg-gradient-to-r from-violet-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to take control of your subscriptions?
          </h2>
          <p className="text-xl text-violet-100 mb-10">
            Join thousands of businesses growing with our platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/subscription')}
              className="px-12 py-4 bg-white text-violet-700 font-bold text-xl rounded 
                         shadow-2xl hover:shadow-white/30 transition-all duration-300"
            >
              Start Your Free Trial
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin')}
              className="px-12 py-4 bg-transparent text-white font-bold text-xl rounded 
                         border-2 border-white/40 hover:border-white hover:bg-white/10 
                         transition-all duration-300"
            >
              Admin Panel
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}