import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const languages = [
        { code: "en", name: "English", countryCode: "GB" },
        { code: "es", name: "Spanish", countryCode: "ES" },
  ];

  const currentLang = languages.find(l => l.code === (i18n.resolvedLanguage || "en")) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* <Globe className="h-5 w-5 text-gray-600" /> */}

      <div className="relative">
        {/* Selected language - always shows flag */}
        <button
          type="button"
          onClick={() => document.getElementById('lang-dropdown').classList.toggle('hidden')}
          className="
            flex items-center gap-2 bg-white border border-gray-300 
            text-gray-700 text-sm rounded-md px-3 py-1.5
            focus:outline-none focus:ring-2 focus:ring-violet-500
            cursor-pointer min-w-[140px]
          "
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <ReactCountryFlag
            countryCode={currentLang.countryCode}
            svg
            style={{
              width: '20px',
              height: '15px',
              borderRadius: '2px',
            }}
            title={currentLang.name}
          />
          <span>{currentLang.name}</span>
          <span className="ml-auto text-xs text-gray-500">▼</span>
        </button>

        {/* Dropdown list - flags show perfectly */}
        <div
          id="lang-dropdown"
          className="hidden absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50"
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                changeLanguage(lang.code);
                document.getElementById('lang-dropdown').classList.add('hidden');
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                hover:bg-violet-50 focus:bg-violet-100 focus:outline-none
                ${i18n.resolvedLanguage === lang.code ? 'bg-violet-50 font-medium' : ''}
              `}
              role="option"
              aria-selected={i18n.resolvedLanguage === lang.code}
            >
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                style={{
                  width: '20px',
                  height: '15px',
                  borderRadius: '2px',
                }}
                title={lang.name}
              />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}