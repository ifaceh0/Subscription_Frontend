import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, EyeOff, Scale } from 'lucide-react';
import Header from '../Header';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    { id: 'collect', title: '1. Information We Collect', icon: <Shield className="w-4 h-4" /> },
    { id: 'use', title: '2. How We Use Data', icon: <Lock className="w-4 h-4" /> },
    { id: 'sharing', title: '3. Data Sharing', icon: <EyeOff className="w-4 h-4" /> },
    { id: 'rights', title: '4. Your Rights', icon: <Scale className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Simple Sub-Header */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link> */}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 text-sm font-medium">
            Last updated: <span className="text-slate-900">March 2026</span>
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Navigation - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contents</h4>
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

          {/* Content Area */}
          <div className="lg:col-span-9 max-w-2xl">
            <div className="prose prose-slate prose-sm sm:prose-base prose-headings:text-slate-900 prose-headings:font-black prose-a:text-violet-600">
              <p className="text-lg text-slate-600 leading-relaxed mb-12">
                At <strong>Interface Hub</strong>, we take your privacy seriously. This policy explains how we collect, use, disclose, and safeguard your information when you use our centralized subscription management service.
              </p>

              <section id="collect" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">1. Information We Collect</h2>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <p className="text-slate-600">We collect information to provide a better experience, including:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    <li className="flex items-start gap-2 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                      <span className="text-violet-500 mt-0.5">●</span> Account Email & Details
                    </li>
                    <li className="flex items-start gap-2 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                      <span className="text-violet-500 mt-0.5">●</span> Payment Data (Stripe)
                    </li>
                    <li className="flex items-start gap-2 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                      <span className="text-violet-500 mt-0.5">●</span> Location & Currency
                    </li>
                    <li className="flex items-start gap-2 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                      <span className="text-violet-500 mt-0.5">●</span> Usage & Dashboard Analytics
                    </li>
                  </ul>
                </div>
              </section>

              <section id="use" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-600 leading-relaxed">
                  Data allows us to show accurate pricing in your local currency, process secure payments, 
                  and comply with international tax laws. We also use usage data to improve our dashboard 
                  functionality and anti-fraud measures.
                </p>
              </section>

              <section id="sharing" className="scroll-mt-24 mb-12 text-slate-600">
                <h2 className="text-2xl text-slate-900 mb-4">3. Data Sharing</h2>
                <p>
                  We do <strong>not</strong> sell your personal data. We share information only with trusted 
                  infrastructure partners like Stripe for payment processing and regional tax authorities 
                  when legally required for compliance.
                </p>
              </section>

              <section id="rights" className="scroll-mt-24 mb-12 text-slate-600">
                <h2 className="text-2xl text-slate-900 mb-4">4. Your Rights</h2>
                <p className="mb-4">Depending on your location (GDPR/CCPA), you may have the right to:</p>
                <div className="flex flex-wrap gap-2">
                  {['Access Data', 'Delete Account', 'Data Portability', 'Object to Processing'].map((right) => (
                    <span key={right} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-wider">
                      {right}
                    </span>
                  ))}
                </div>
              </section>

              <div className="mt-20 pt-10 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Questions?</h3>
                <div className="flex items-center gap-4 p-6 bg-violet-600 rounded-2xl text-white shadow-xl shadow-violet-100">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-violet-100">Contact our privacy officer</p>
                    <a href="mailto:privacy@ifaceh.com" className="font-bold text-white hover:underline">privacy@ifaceh.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer Signature */}
        {/* <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} Interface Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-violet-600 transition-colors">Support</Link>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default PrivacyPolicy;