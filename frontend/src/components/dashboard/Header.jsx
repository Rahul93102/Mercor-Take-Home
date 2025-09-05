import React from 'react';
import { Menu, Search, Calendar, Download, Bell, User } from 'lucide-react';

const Header = ({ onMenuClick, networkData }) => {
  const totalUsers = networkData?.users?.size || 0;
  const totalConnections = networkData ? Array.from(networkData.referrals.values()).reduce((sum, refs) => sum + refs.length, 0) : 0;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search users, networks, analytics..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
              ⌘ F
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{totalUsers}</span> Users
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">{totalConnections}</span> Connections
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Live Data</span>
          </div>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </button>

          <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-200">
            <Download className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Export</span>
          </button>

          <button className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
