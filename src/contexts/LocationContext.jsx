import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [countryCode, setCountryCode] = useState('US'); 

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://cloudflare.com/cdn-cgi/trace');
        const text = await res.text();
        const lines = text.split('\n');
        const countryLine = lines.find(line => line.startsWith('loc='));
        if (countryLine) {
          const code = countryLine.split('=')[1]?.trim();
          if (code && code.length === 2) {
            setCountryCode(code);
            console.log(`[Location] Detected country from Cloudflare: ${code}`);
            return;
          }
        }
      } catch (err) {
        console.warn('[Location] Cloudflare detection failed', err);
      }

      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const data = await ipRes.json();
        if (data.country_code && data.country_code.length === 2) {
          setCountryCode(data.country_code);
          console.log(`[Location] Detected country from ipapi: ${data.country_code}`);
          return;
        }
      } catch (err) {
        console.warn('[Location] ipapi fallback failed', err);
      }

      console.log('[Location] All detection failed → default US');
      setCountryCode('US');
    };

    detectCountry();
  }, []);

  return (
    <LocationContext.Provider value={{ countryCode }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};