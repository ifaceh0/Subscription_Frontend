// import { useTranslation } from "react-i18next";
// // import ReactCountryFlag from "react-country-flag";  // ❌ removed

// export default function LanguageSelector() {
//   const { i18n } = useTranslation();

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "es", name: "Spanish" },
//   ];

//   const currentLang =
//     languages.find((l) => l.code === (i18n.resolvedLanguage || "en")) ||
//     languages[0];

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <div className="relative inline-flex items-center gap-2">
//       <div className="relative">
//         {/* Selected language */}
//         <button
//           type="button"
//           onClick={() =>
//             document
//               .getElementById("lang-dropdown")
//               .classList.toggle("hidden")
//           }
//           className="
//             flex items-center gap-2 bg-white border border-gray-300 
//             text-gray-700 text-sm rounded-md px-3 py-1.5
//             focus:outline-none focus:ring-2 focus:ring-violet-500
//             cursor-pointer
//           "
//           aria-expanded="false"
//           aria-haspopup="listbox"
//         >
//           <span>{currentLang.name}</span>
//           <span className="ml-auto text-xs text-gray-500">▼</span>
//         </button>

//         {/* Dropdown list */}
//         <div
//           id="lang-dropdown"
//           className="hidden absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50"
//           role="listbox"
//         >
//           {languages.map((lang) => (
//             <button
//               key={lang.code}
//               type="button"
//               onClick={() => {
//                 changeLanguage(lang.code);
//                 document
//                   .getElementById("lang-dropdown")
//                   .classList.add("hidden");
//               }}
//               className={`
//                 w-full flex items-center px-4 py-2 text-left text-sm
//                 hover:bg-violet-50 focus:bg-violet-100 focus:outline-none
//                 ${
//                   i18n.resolvedLanguage === lang.code
//                     ? "bg-violet-50 font-medium"
//                     : ""
//                 }
//               `}
//               role="option"
//               aria-selected={i18n.resolvedLanguage === lang.code}
//             >
//               <span>{lang.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }






import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
  ];

  const currentLang =
    languages.find((l) => l.code === (i18n.resolvedLanguage || "en")) ||
    languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
          ${isOpen 
            ? "bg-white border-violet-200 shadow-sm ring-2 ring-violet-50" 
            : "bg-transparent border-slate-200 hover:border-slate-300 hover:bg-slate-50"}
        `}
      >
        <Globe className={`w-4 h-4 ${isOpen ? "text-violet-600" : "text-slate-400"}`} />
        <span className="text-sm font-semibold text-slate-700 tracking-tight">
          {currentLang.name}
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
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50"
          >
            <div className="py-1.5 px-1.5">
              {languages.map((lang) => {
                const isSelected = i18n.resolvedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors
                      ${isSelected 
                        ? "bg-violet-50 text-violet-700 font-bold" 
                        : "text-slate-600 hover:bg-slate-50"}
                    `}
                  >
                    {lang.name}
                    {isSelected && <Check className="w-4 h-4 text-violet-600 stroke-[3px]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}