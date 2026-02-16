import React from 'react';
import { Search, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    // min-h-[100px] ko hata kar sirf h-20 ya py-4 use karein
    <nav className="flex w-full items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo box thoda compact kiya */}
        <div className="w-10 h-10 bg-[#EE3B24] rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[#1A2B3B] font-bold text-lg tracking-tight leading-none">
            Crayon Costing
          </h1>
          <p className="text-gray-400 text-[10px] font-bold mt-1 tracking-widest uppercase">
            Sales Portal
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Bar - Height thodi kam ki (py-2) aur width adjust ki */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-[280px] pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-5">
          {/* Notification */}
          <div className="relative p-2 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 border-2 border-white rounded-full"></span>
          </div>

          {/* Divider line height thodi kam ki */}
          <div className="h-8 w-[1px] bg-gray-200"></div>

          {/* User Profile - More proportional */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#1A2B3B] leading-none">Ahmed Hassan</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Senior Sales Representative</p>
            </div>
            <div className="w-10 h-10 bg-[#1A2B3B] rounded-full flex items-center justify-center text-white font-bold text-xs border border-gray-100 shadow-sm">
              AH
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;