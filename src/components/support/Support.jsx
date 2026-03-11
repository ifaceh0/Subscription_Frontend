import { Mail, MessageCircle, HelpCircle, ArrowRight, LifeBuoy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../Header';

const Support = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-50/50 via-transparent to-transparent -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            <LifeBuoy className="w-3 h-3" />
            Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            How can we help you today?
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to manage your subscriptions. Our team is dedicated to making your workflow as smooth as possible.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* Email Support */}
          <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-violet-200 transition-all duration-300">
            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Email Support</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Prefer the traditional route? Drop us a line and we'll reply within 24 hours.
            </p>
            <a
              href="mailto:support@ifaceh.com"
              className="flex items-center justify-between w-full px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Live Chat */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-300">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <MessageCircle className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-3">Live Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Real-time assistance for urgent queries. <br/>
              <span className="font-semibold italic">Coming Summer 2026</span>
            </p>
            <div className="w-full px-5 py-3 rounded-xl bg-slate-200 text-slate-400 text-sm font-bold text-center">
              Available Soon
            </div>
          </div>

          {/* FAQ Center */}
          <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-violet-200 transition-all duration-300">
            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">FAQ Center</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Find instant answers to common questions about billing and features.
            </p>
            <Link
              to="/faq"
              className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Browse FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Guidance Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-violet-600 p-8 md:p-12 text-white">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <HelpCircle className="w-64 h-64 rotate-12" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-4">Understanding your dashboard support</h2>
              <p className="text-violet-100 text-lg leading-relaxed">
                We manage your <span className="underline decoration-violet-300 font-bold">interface</span>, but service providers manage your <span className="underline decoration-violet-300 font-bold">service</span>.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <p className="text-sm leading-relaxed mb-6 italic text-violet-50">
                "For issues related to payment failures on Netflix or Spotify account access, please reach out to their respective help centers."
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <ExternalLink className="w-4 h-4" />
                  Provider Quick Links
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Netflix', 'Spotify', 'AWS', 'Adobe'].map((brand) => (
                    <span key={brand} className="px-3 py-1.5 bg-white/20 rounded-lg text-[10px] font-bold">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Minimal Footer */}
        {/* <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
            Interface Hub — Global Subscription Control
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default Support;