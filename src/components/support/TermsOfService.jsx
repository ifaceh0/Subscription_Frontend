import { Link } from 'react-router-dom';
import { ChevronLeft, Gavel, UserCheck, CreditCard, Ban, AlertTriangle, Mail } from 'lucide-react';
import Header from '../subscription/Header';

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    { id: 'acceptance', title: '1. Acceptance', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'account', title: '2. Responsibilities', icon: <Gavel className="w-4 h-4" /> },
    { id: 'billing', title: '3. Subscription & Fees', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'conduct', title: '4. Prohibited Conduct', icon: <Ban className="w-4 h-4" /> },
    { id: 'liability', title: '5. Liability', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero Section */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link> */}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500 text-sm font-medium">
            Effective Date: <span className="text-slate-900">March 2026</span>
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</h4>
              <nav className="flex flex-col gap-4">
                {sections.map((section) => (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-violet-600 transition-colors group"
                  >
                    <span className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-violet-50 transition-colors">
                      {section.icon}
                    </span>
                    {section.title.split('. ')[1]}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Content */}
          <div className="lg:col-span-9 max-w-2xl">
            <article className="prose prose-slate prose-sm sm:prose-base prose-headings:text-slate-900 prose-headings:font-black prose-strong:text-slate-900">
              <p className="text-lg text-slate-600 leading-relaxed mb-12">
                These Terms of Service govern your access to and use of the <strong>Interface Hub</strong> centralized subscription management service. Please read them carefully.
              </p>

              <section id="acceptance" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-600 leading-relaxed">
                  By accessing or using our service, you agree to be bound by these Terms. If you do not agree to all of the terms and conditions, you may not access or use the platform.
                </p>
              </section>

              <section id="account" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">2. Account Responsibilities</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    'You must provide accurate, current, and complete information.',
                    'You are responsible for maintaining credential confidentiality.',
                    'You are liable for all activities occurring under your account.'
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 text-sm">
                      <span className="font-bold text-violet-500">{i + 1}.</span>
                      {text}
                    </div>
                  ))}
                </div>
              </section>

              <section id="billing" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">3. Subscription Management & Fees</h2>
                <p className="text-slate-600 mb-4">
                  Interface Hub facilitates the viewing and management of your subscriptions. However:
                </p>
                <ul className="space-y-3 list-none p-0">
                  {['We are not the merchant of record for third-party services.', 'Refunds and cancellations are handled by the respective providers.', 'Platform fees (if applicable) are disclosed prior to billing.'].map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="conduct" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">4. Prohibited Conduct</h2>
                <p className="text-slate-600">
                  To ensure a secure environment, you agree not to use the service for unlawful purposes, 
                  attempt to breach security measures, or interfere with other users' access.
                </p>
              </section>

              <section id="liability" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">5. Limitation of Liability</h2>
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 text-slate-500 text-sm leading-relaxed">
                  To the maximum extent permitted by law, Interface Hub’s total liability for any claim 
                  under these terms is limited to the amount you paid us in the 12 months preceding the claim.
                </div>
              </section>

              {/* Legal Contact CTA */}
              <div className="mt-20 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Legal Inquiries</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-xs">Have questions about our terms or governing laws?</p>
                  <a 
                    href="mailto:legal@ifaceh.com" 
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    legal@ifaceh.com
                  </a>
                </div>
                <Gavel className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
              </div>
            </article>
          </div>
        </div>

        {/* Footer Signature */}
        {/* <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} Interface Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-violet-600 transition-colors">Support</Link>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default TermsOfService;