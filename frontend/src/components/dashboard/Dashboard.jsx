import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardOverview from './DashboardOverview';
import NetworkBuilderFixed from '../NetworkBuilderFixed';
import NetworkAnalyzer from '../NetworkAnalyzer';
import InfluencerFinder from '../InfluencerFinder';
import GrowthSimulator from '../GrowthSimulator';
import BonusOptimizer from '../BonusOptimizer';
import AnimatedLoader from '../AnimatedLoader';

const Dashboard = ({ network, onNetworkUpdate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderActiveComponent = () => {
    const commonProps = {
      network,
      onNetworkUpdate
    };

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview networkData={network} onTabChange={setActiveTab} />;
      case 'builder':
        return <NetworkBuilderFixed {...commonProps} />;
      case 'analyzer':
        return <NetworkAnalyzer {...commonProps} />;
      case 'influencer':
        return <InfluencerFinder {...commonProps} />;
      case 'simulator':
        return <GrowthSimulator {...commonProps} />;
      case 'optimizer':
        return <BonusOptimizer {...commonProps} />;
      case 'activity':
        return <ActivityLog networkData={network} />;
      default:
        return <DashboardOverview networkData={network} onTabChange={setActiveTab} />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard Overview',
      builder: 'Network Builder',
      analyzer: 'Network Analysis',
      influencer: 'Influencer Finder',
      simulator: 'Growth Simulator',
      optimizer: 'Bonus Optimizer',
      activity: 'Activity Log'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getPageDescription = () => {
    const descriptions = {
      dashboard: 'Monitor your referral network performance and key metrics',
      builder: 'Build and manage referral relationships',
      analyzer: 'Analyze reach and network statistics',
      influencer: 'Identify key influencers using advanced metrics',
      simulator: 'Simulate network growth over time',
      optimizer: 'Optimize referral bonuses for hiring targets',
      activity: 'View detailed activity logs and system events'
    };
    return descriptions[activeTab] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AnimatedLoader message="Loading Referral Network Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          networkData={network}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              {/* Page Header */}
              {activeTab !== 'dashboard' && (
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                  <p className="text-gray-600 mt-2">{getPageDescription()}</p>
                </div>
              )}
              
              {/* Content Area */}
              <div className="animate-fadeIn">
                {renderActiveComponent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ networkData }) => {
  const activities = [
    {
      id: 1,
      type: 'user_added',
      title: 'New User Added',
      description: 'Alice Johnson joined the referral network',
      timestamp: '2024-12-18 14:30:00',
      icon: '👤',
      status: 'success'
    },
    {
      id: 2,
      type: 'referral_made',
      title: 'Referral Connection',
      description: 'Bob Smith referred 3 new team members',
      timestamp: '2024-12-18 14:25:00',
      icon: '🔗',
      status: 'success'
    },
    {
      id: 3,
      type: 'analysis_run',
      title: 'Network Analysis',
      description: 'Influence metrics calculated for all users',
      timestamp: '2024-12-18 14:20:00',
      icon: '📊',
      status: 'completed'
    },
    {
      id: 4,
      type: 'simulation',
      title: 'Growth Simulation',
      description: 'Network growth projected for next 30 days',
      timestamp: '2024-12-18 14:15:00',
      icon: '📈',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">System Activity</h3>
          <p className="text-gray-600 text-sm mt-1">Recent actions and system events</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
