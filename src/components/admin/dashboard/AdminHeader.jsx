import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import LogoutButton from '../signin/LogoutButton';

const AdminHeader = ({
  isSidebarOpen,
  setIsSidebarOpen,
  title = "Dashboard",
  countries = [],
  selectedCountryFilter = '',
  setSelectedCountryFilter = () => {},
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-violet-600 transition-all duration-200 active:scale-95"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={28} />}
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 leading-none">
                {title}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Country Selector Container */}
            <div className="relative flex items-center group">
              <div className="absolute left-3 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                <Globe size={15} />
              </div>
              
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="appearance-none pl-10 pr-10 py-2 text-[13px] font-medium bg-gray-50/50 border border-gray-200 rounded-sm 
                           focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none 
                           text-gray-700 transition-all cursor-pointer"
              >
                <option value="">Global</option>
                {countries.map((c) => (
                  <option key={c.countryCode} value={c.countryCode}>
                    {c.displayName || c.countryCode}
                  </option>
                ))}
              </select>
              
              <div className="absolute right-3 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 mx-2" />

            {/* Logout Action */}
            <div className="flex items-center">
              <LogoutButton 
                className="!bg-transparent !text-gray-500 hover:!text-red-500 hover:!bg-red-50 !border-none !shadow-none !px-3" 
                size="sm" 
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;