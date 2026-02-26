import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a
              href="https://www.ifaceh.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <span className="font-bold text-xl sm:text-2xl">
                <span className="text-gray-900">Interface</span>
                <span className="text-violet-600">Hub</span>
              </span>
            </a>
          </div>

          {/* Language selector on the right */}
          <div className="flex items-center gap-6">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}