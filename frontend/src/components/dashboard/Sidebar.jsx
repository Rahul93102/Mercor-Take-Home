import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Search, 
  Target, 
  Settings,
  HelpCircle,
  Network,
  ChevronDown,
  Activity,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      active: activeTab === 'dashboard',
      section: 'GENERAL' 
    },
    { 
      id: 'builder', 
      icon: Network, 
      label: 'Network Builder', 
      active: activeTab === 'builder',
      section: 'GENERAL' 
    },
    { 
      id: 'analyzer', 
      icon: BarChart3, 
      label: 'Network Analysis', 
      active: activeTab === 'analyzer',
      section: 'GENERAL' 
    },
    { 
      id: 'influencer', 
      icon: Users, 
      label: 'Influencer Finder', 
      active: activeTab === 'influencer',
      section: 'GENERAL' 
    },
  ];

  const supportItems = [
    { 
      id: 'simulator', 
      icon: TrendingUp, 
      label: 'Growth Simulator', 
      active: activeTab === 'simulator' 
    },
    { 
      id: 'optimizer', 
      icon: Target, 
      label: 'Bonus Optimizer', 
      active: activeTab === 'optimizer' 
    },
    { 
      id: 'activity', 
      icon: Activity, 
      label: 'Activity Log', 
      active: activeTab === 'activity' 
    },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Help', active: false },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white z-50 transition-all duration-300 ease-in-out border-r border-gray-100 ${
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Referral Network</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">GENERAL</p>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="mb-1">
                  <div
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                      item.active 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">ANALYTICS</p>
            {supportItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="mb-1">
                  <div
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                      item.active 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-100 p-4">
          {bottomItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="mb-1">
                <div className="group flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </div>
            );
          })}
          
          <div className="mt-4 flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">RN</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Network Admin</p>
              <p className="text-xs text-gray-500">admin@referralnet.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="mt-3 flex items-center justify-between px-3">
            <span className="text-xs text-gray-400">Advanced Mode</span>
            <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 px-3">© 2024 Referral Network Inc.</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
