import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({
  isOpen,
  setIsOpen,
  quickActions = [],
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Admin Tools</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} className="text-slate-500 hover:text-slate-700" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            {quickActions.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition font-medium"
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t text-sm text-slate-500">
            Admin Dashboard
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;