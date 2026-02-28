import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureDetailsModal = ({ isOpen, onClose, tier, content }) => {
  if (!isOpen) return null;
  const { t } = useTranslation();

  const title = t('featureDetailsModal.title', { tier: tier.toUpperCase() });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-4 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {content.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {section.title && (
                    <h3 className="text-lg font-semibold text-violet-700">
                      {section.title}
                    </h3>
                  )}
                  {section.subtitle && (
                    <p className="text-gray-700 font-medium">{section.subtitle}</p>
                  )}
                  {section.text && (
                    <p className="text-gray-600 leading-relaxed">{section.text}</p>
                  )}
                  {section.list && (
                    <ul className="space-y-2 pl-5 list-disc text-gray-600 marker:text-violet-500">
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.negative && (
                    <div className="flex items-start gap-2 text-red-600">
                      <span className="font-bold text-xl leading-none">❌</span>
                      <span>{section.negative}</span>
                    </div>
                  )}
                  {section.positive && (
                    <div className="flex items-start gap-2 text-green-600">
                      <span className="font-bold text-xl leading-none">✅</span>
                      <span>{section.positive}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t bg-gray-50 text-right">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition font-medium"
              >
                {t('featureDetailsModal.done')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailsModal;