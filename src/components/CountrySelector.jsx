// // components/CountrySelector.jsx
// import { Globe } from 'lucide-react';
// import { useLocation } from '../contexts/LocationContext';

// export default function CountrySelector() {
//   const { 
//     countryCode, 
//     detectedCountry, 
//     setSelectedCountry
//   } = useLocation();

//   const isAutoDetected = countryCode === detectedCountry;

//   return (
//     <div className="flex items-center gap-1.5  px-3 py-1.5 rounded-md border border-gray-300 ">
//       <Globe className="h-4 w-4 text-violet-600" />
      
//       <select
//         value={countryCode}
//         onChange={(e) => {
//           const selected = e.target.value;
//           if (selected === detectedCountry) {
//             setSelectedCountry(null);
//           } else {
//             setSelectedCountry(selected);
//           }
//         }}
//         className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer text-sm"
//       >
//         <option value="US">🇺🇸 USA $</option>
//         <option value="IN">🇮🇳 India ₹</option>
//       </select>

//       {/* Small visual hint - only when using detected */}
//       {isAutoDetected && (
//         <span className="text-xs text-gray-500 font-light">
//           auto
//         </span>
//       )}
//     </div>
//   );
// }








import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountrySelector() {
  const { countryCode, detectedCountry, setSelectedCountry } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const countries = [
    { code: 'US', label: 'USA', flag: '🇺🇸', currency: '$' },
    { code: 'IN', label: 'India', flag: '🇮🇳', currency: '₹' },
  ];

  const currentCountry = countries.find(c => c.code === countryCode) || countries[0];
  const isAutoDetected = countryCode === detectedCountry;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    if (code === detectedCountry) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-200
          ${isOpen 
            ? "bg-white border-violet-200 shadow-sm ring-2 ring-violet-50" 
            : "bg-transparent border-slate-200 hover:border-slate-300 hover:bg-slate-50"}
        `}
      >
        <div className="relative">
          <Globe className={`w-4 h-4 ${isOpen ? "text-violet-600" : "text-slate-400"}`} />
          {isAutoDetected && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
          )}
        </div>

        <span className="text-sm font-semibold text-slate-700">
          {currentCountry.flag} {currentCountry.code}
        </span>
        
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50"
          >
            <div className="p-1.5">
              {/* Header inside dropdown */}
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Select Region
              </div>

              {countries.map((country) => {
                const isSelected = countryCode === country.code;
                const isDetected = detectedCountry === country.code;

                return (
                  <button
                    key={country.code}
                    onClick={() => handleSelect(country.code)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all
                      ${isSelected 
                        ? "bg-violet-50 text-violet-700" 
                        : "text-slate-600 hover:bg-slate-50"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold">{country.label}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{country.currency} Currency</span>
                      </div>
                    </div>

                    {isSelected ? (
                      <Check className="w-4 h-4 text-violet-600 stroke-[3px]" />
                    ) : isDetected ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Auto-detected hint footer */}
            {detectedCountry && (
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center italic">
                  Currently optimized for {detectedCountry === 'US' ? 'United States' : 'India'} prices
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}