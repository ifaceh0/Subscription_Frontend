import { useTranslation } from 'react-i18next';
import { Mail, ShieldCheck, Globe2, ArrowRight } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-10 pb-6 border-t border-slate-800">
      <div className="max-w-8xl mx-auto px-6 sm:px-16">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 mb-8">
          
          {/* Brand & Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Globe2 className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Interface<span className="text-emerald-400">Hub</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.description', 'Manage all your subscriptions in one secure place. Worldwide support with localized pricing.')}
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
              {t('footer.secure', 'Bank-grade Security')}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
                {t('footer.product', 'Product')}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/subscription" className="hover:text-white transition-colors duration-200 block">
                    {t('footer.pricing', 'Pricing')}
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white transition-colors duration-200 block">
                    {t('footer.support', 'Help & Support')}
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
                {t('footer.legal', 'Legal')}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors duration-200 block">
                    {t('footer.privacyPolicy', 'Privacy Policy')}
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors duration-200 block">
                    {t('footer.termsOfService', 'Terms of Service')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Contact/Action Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
              {t('footer.getInTouch', 'Get in Touch')}
            </h4>
            <p className="text-sm text-slate-400">
              Have questions? Our global support team is available 24/7.
            </p>
            <div className="pt-2">
              <a 
                href="mailto:support@ifaceh.com" 
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-md bg-slate-800 text-sm text-slate-200 hover:text-white hover:bg-slate-750 transition-all border border-slate-750 group"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@ifaceh.com</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500 order-2 sm:order-1">
            © {currentYear} Interface Hub. {t('footer.rights', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-6 order-1 sm:order-2">
             <p className="text-slate-500 italic">
               {t('footer.poweredBy', 'Powered by secure global billing infrastructure')}
             </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;