import { Link } from 'react-router-dom';
import FaqItem from './FaqItem';
import { HelpCircle, Mail, MessageSquare, ShieldCheck, CreditCard, Zap } from 'lucide-react';
import Header from '../subscription/Header';

const Faq = () => {
  const categories = [
    { id: 'general', name: 'General', icon: <Zap className="w-4 h-4" /> },
    { id: 'management', name: 'Management', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'billing', name: 'Billing & Refunds', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', name: 'Security & Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero */}
      <div className="bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Common Questions
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Everything you need to know about Interface Hub. Can't find what you're looking for? 
            <Link to="/support" className="text-violet-600 font-bold ml-1 hover:underline">Contact our team.</Link>
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Nav */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</h4>
              <nav className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <a 
                    key={cat.id} 
                    href={`#${cat.id}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                  >
                    {cat.icon}
                    {cat.name}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* FAQ Sections */}
          <div className="lg:col-span-9 space-y-20">
            
            {/* General Section */}
            <section id="general" className="scroll-mt-24">
              <h2 className="text-xs font-black text-violet-600 uppercase tracking-[0.2em] mb-8">01. General</h2>
              <div className="divide-y divide-slate-100">
                {/* <FaqItem question="What exactly is Interface Hub?" defaultOpen={true}>
                  <p>Interface Hub is a centralized command center for your digital life. We provide a single dashboard to track, monitor, and optimize every subscription you own, from Netflix to AWS.</p>
                </FaqItem>
                <FaqItem question="Do I have to pay for each app separately?">
                  <p>No. You pay one unified monthly or yearly bill to Interface Hub, and we manage the distribution of funds to the specific service providers on your behalf.</p>
                </FaqItem>
                <FaqItem question="Is there a free trial?">
                  <p>Yes! Every new account comes with a <strong>14-day Pro trial</strong>. No credit card is required to explore the dashboard and connect your first three services.</p>
                </FaqItem> */}
                <FaqItem question="What is Centralized Subscriptions?" defaultOpen={true}>
                <p>
                  Centralized Subscriptions is a dashboard that lets you view, manage, and track all your active subscriptions in one secure place — no matter which service they belong to (streaming, software, SaaS, etc.).
                </p>
                <p className="mt-1">
                  We connect via secure APIs (where available) to show you billing dates, amounts, payment methods, and let you take actions like changing plans or canceling — all from one interface.
                </p>
              </FaqItem>

              <FaqItem question="Is my payment information safe?">
                <p>
                  We <strong>never</strong> store your full payment details. All card information and payment processing is handled directly by <strong>Stripe</strong>, a PCI-DSS Level 1 compliant provider trusted by millions of businesses.
                </p>
                <p className="mt-1">
                  We only store the last 4 digits, card type, and expiry date — exactly what you see in the dashboard.
                </p>
              </FaqItem>

              <FaqItem question="Which countries and currencies are supported?">
                <p>
                  Our service is available worldwide. We support <strong>195+ countries</strong> and <strong>135+ currencies</strong> through Stripe.
                </p>
                <p className="mt-1">
                  Prices are automatically shown in your local currency based on your location, with correct tax rules applied (VAT, GST, etc.).
                </p>
              </FaqItem>
              </div>
            </section>

            {/* Management Section */}
            <section id="management" className="scroll-mt-24">
              <h2 className="text-xs font-black text-violet-600 uppercase tracking-[0.2em] mb-8">02. Management</h2>
              <div className="divide-y divide-slate-100">
                <FaqItem question="How do I cancel a subscription?">
                <p>
                  Click the <strong>"Cancel"</strong> button on the subscription card → select which apps/services you want to cancel → confirm.
                </p>
                <p className="mt-3">
                  Most cancellations will take effect at the end of the current billing period. Some services may allow immediate cancellation.
                </p>
              </FaqItem>

              <FaqItem question="Can I change my plan or add more apps?">
                <p>
                  Yes! Use the <strong>"Change Plan"</strong> or <strong>"Add Product"</strong> buttons.
                </p>
                <p className="mt-3">
                  For plan changes: you'll be redirected to choose a new tier.<br />
                  For adding apps: we'll show a proration preview so you know the exact cost.
                </p>
              </FaqItem>

              <FaqItem question="Why do I see a prorated charge when adding something?">
                <p>
                  When you add a new app or upgrade mid-cycle, you are charged only for the remaining days in your current billing period (proration).
                </p>
                <p className="mt-3">
                  The preview screen shows exactly how much you'll pay now and what your next full cycle will cost.
                </p>
              </FaqItem>

              <FaqItem question="What happens if my payment fails?">
                <p>
                  If a payment fails, the affected subscription may show as <strong>past due</strong> or <strong>unpaid</strong>.
                </p>
                <p className="mt-3">
                  Update your payment method via the <strong>"Update Payment Method"</strong> button — this takes you to Stripe's secure customer portal.
                </p>
              </FaqItem>
              </div>
            </section>

            {/* Security Section (NEW) */}
            <section id="security" className="scroll-mt-24">
              <h2 className="text-xs font-black text-violet-600 uppercase tracking-[0.2em] mb-8">03. Security & Privacy</h2>
              <div className="divide-y divide-slate-100">
                <FaqItem question="How secure is my data?">
                  <p>We use bank-grade AES-256 encryption for all data at rest. For payment processing, we use Stripe, ensuring we never actually see or store your raw credit card numbers.</p>
                </FaqItem>
                <FaqItem question="Do you sell my subscription data?">
                  <p><strong>Never.</strong> We are a privacy-first company. We do not sell your usage habits or subscription list to advertisers or third parties. Our only revenue comes from subscription fees.</p>
                </FaqItem>
              </div>
            </section>

            {/* Billing Section */}
            <section id="billing" className="scroll-mt-24">
              <h2 className="text-xs font-black text-violet-600 uppercase tracking-[0.2em] mb-8">04. Billing & Refunds</h2>
              <div className="divide-y divide-slate-100">
                <FaqItem question="How do prorated charges work?">
                  <p>If you add a new app mid-month, you only pay for the remaining days of that month. On your next billing date, the full amount for all active apps will be consolidated into one invoice.</p>
                </FaqItem>
                <FaqItem question="How do I get a refund?">
                  <p>
                    Refunds are handled directly by the service provider (Netflix, Spotify, etc.), not by us.
                  </p>
                  <p className="mt-3">
                    We can only help you cancel or manage visibility — please contact the specific service for refund requests.
                  </p>
                </FaqItem>
              </div>
            </section>

          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-24 p-10 rounded-[2rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-slate-400">Our support specialists are available 24/7 via chat and email.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link to="/support" className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat Support
            </Link>
            <a href="mailto:support@ifaceh.com" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Us
            </a>
          </div>
          <HelpCircle className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 -rotate-12" />
        </div>
      </main>
    </div>
  );
};

export default Faq;