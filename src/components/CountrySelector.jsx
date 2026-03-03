// components/CountrySelector.jsx
import { Globe } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export default function CountrySelector() {
  const { 
    countryCode, 
    detectedCountry, 
    setSelectedCountry
  } = useLocation();

  const isAutoDetected = countryCode === detectedCountry;

  return (
    <div className="flex items-center gap-1.5  px-3 py-1.5 rounded-md border border-gray-300 ">
      <Globe className="h-4 w-4 text-violet-600" />
      
      <select
        value={countryCode}
        onChange={(e) => {
          const selected = e.target.value;
          if (selected === detectedCountry) {
            setSelectedCountry(null);
          } else {
            setSelectedCountry(selected);
          }
        }}
        className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer text-sm"
      >
        <option value="US">🇺🇸 USA $</option>
        <option value="IN">🇮🇳 India ₹</option>
      </select>

      {/* Small visual hint - only when using detected */}
      {isAutoDetected && (
        <span className="text-xs text-gray-500 font-light">
          auto
        </span>
      )}
    </div>
  );
}