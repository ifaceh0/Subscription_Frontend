import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { Star } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="https://www.ifaceh.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Interface<span className="text-violet-600">Hub</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </div>
      </header>
  );
}