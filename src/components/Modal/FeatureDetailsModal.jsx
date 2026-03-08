import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureDetailsModal = ({ isOpen, onClose, tier, content }) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const title = t('featureDetailsModal.title', { tier: tier.toUpperCase() });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        {/* Backdrop: Solid soft blur for focus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header: Clean & Integrated */}
          <div className="px-8 pt-8 pb-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-violet-600 mb-1 block">
                Plan Details
              </span>
              <h2 className="text-2xl font-semibold text-slate-900 leading-tight">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-4 space-y-10">
            {content.map((section, idx) => (
              <section key={idx} className="space-y-4">
                {/* Section Branding */}
                {section.title && (
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}

                <div className="space-y-3">
                  {section.subtitle && (
                    <p className="text-lg font-medium text-slate-800">{section.subtitle}</p>
                  )}
                  
                  {section.text && (
                    <p className="text-slate-500 leading-relaxed text-sm">
                      {section.text}
                    </p>
                  )}

                  {/* List: Using soft bullets */}
                  {section.list && (
                    <ul className="space-y-3 pt-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <Circle className="w-1.5 h-1.5 mt-2 fill-violet-400 text-violet-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Status Blocks: Minimalist treatment */}
                  {section.negative && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100/50 text-rose-700 text-sm italic">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {section.negative}
                    </div>
                  )}

                  {section.positive && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100/50 text-emerald-700 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {section.positive}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Footer: Floating appearance */}
          <div className="px-8 py-6 bg-white/80 backdrop-blur-sm border-t border-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 font-medium text-sm shadow-sm"
            >
              {t('featureDetailsModal.done')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeatureDetailsModal;