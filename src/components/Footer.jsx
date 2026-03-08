import { useTranslation } from 'react-i18next';
import { Mail, ShieldCheck, Globe2 } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-violet-600 rounded flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Interface<span className="text-violet-600">Hub</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              {t('footer.description', 'Manage all your subscriptions in one secure place. Worldwide support with localized pricing.')}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('footer.secure', 'Bank-grade Security')}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">
              {t('footer.product', 'Product')}
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="/subscription" className="hover:text-violet-600 transition-colors">{t('footer.pricing', 'Pricing')}</a></li>
              <li><a href="/support" className="hover:text-violet-600 transition-colors">{t('footer.support', 'Help & Support')}</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">
              {t('footer.legal', 'Legal')}
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="/privacy" className="hover:text-violet-600 transition-colors">{t('footer.privacyPolicy', 'Privacy Policy')}</a></li>
              <li><a href="/terms" className="hover:text-violet-600 transition-colors">{t('footer.termsOfService', 'Terms of Service')}</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 md:text-right">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">
              {t('footer.getInTouch', 'Get in Touch')}
            </h4>
            <a 
              href="mailto:support@ifaceh.com" 
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 transition-colors group"
            >
              <Mail className="w-4 h-4 text-slate-400 group-hover:text-violet-600" />
              support@ifaceh.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            © {currentYear} Interface Hub. {t('footer.rights', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-6">
             <p className="text-[11px] text-slate-400 italic">
               {t('footer.poweredBy', 'Powered by secure global billing infrastructure')}
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;