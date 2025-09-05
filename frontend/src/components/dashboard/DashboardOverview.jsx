import React, { useState, useEffect } from 'react';
import { Users, Network, TrendingUp, Target, Activity, BarChart3, Zap, Star } from 'lucide-react';
import StatsCard from './StatsCard';
import AnimatedBarChart from '../AnimatedBarChart';

const DashboardOverview = ({ networkData, onTabChange }) => {
  const [realtimeStats, setRealtimeStats] = useState({
    users: 0,
    connections: 0,
    influencers: 0,
    growthRate: 0
  });

  const [networkGrowthData, setNetworkGrowthData] = useState([]);

  useEffect(() => {
    if (networkData) {
      const users = networkData.users?.size || 0;
      const connections = networkData ? Array.from(networkData.referrals.values()).reduce((sum, refs) => sum + refs.length, 0) : 0;
      
      // Calculate influencers (users with more than 3 referrals)
      const influencers = networkData ? Array.from(networkData.referrals.entries()).filter(([_, refs]) => refs.length > 3).length : 0;
      
      // Calculate growth rate based on recent activity
      const growthRate = users > 0 ? Math.min(100, (connections / users) * 15) : 0;

      setRealtimeStats({
        users,
        connections,
        influencers,
        growthRate: Math.round(growthRate)
      });

      // Generate network growth chart data
      const growthData = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((day, index) => {
        growthData.push({
          name: day,
          users: Math.max(0, users - (6 - index) * Math.floor(users / 7)),
          connections: Math.max(0, connections - (6 - index) * Math.floor(connections / 7))
        });
      });
      setNetworkGrowthData(growthData);
    }
  }, [networkData]);

  const quickActions = [
    {
      icon: Users,
      title: 'Add User',
      description: 'Create new network member',
      color: 'bg-blue-500',
      action: () => onTabChange('builder')
    },
    {
      icon: Network,
      title: 'Analyze Network',
      description: 'View network statistics',
      color: 'bg-green-500',
      action: () => onTabChange('analyzer')
    },
    {
      icon: TrendingUp,
      title: 'Simulate Growth',
      description: 'Model network expansion',
      color: 'bg-purple-500',
      action: () => onTabChange('simulator')
    },
    {
      icon: Target,
      title: 'Optimize Bonuses',
      description: 'Maximize recruitment',
      color: 'bg-orange-500',
      action: () => onTabChange('optimizer')
    }
  ];

  const recentActivity = [
    {
      type: 'user_added',
      message: 'New user Alice joined the network',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      type: 'referral_made',
      message: 'Bob referred 3 new members',
      time: '5 minutes ago',
      icon: Network,
      color: 'text-green-600'
    },
    {
      type: 'milestone',
      message: 'Network reached 100 connections',
      time: '1 hour ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      type: 'analysis',
      message: 'Influencer analysis completed',
      time: '2 hours ago',
      icon: BarChart3,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Network Overview</h2>
          <p className="text-gray-600 mt-1">Real-time insights into your referral network performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={realtimeStats.users}
            change={12.5}
            icon={Users}
            color="bg-blue-500"
            delay={0}
          />
          <StatsCard
            title="Connections"
            value={realtimeStats.connections}
            change={8.3}
            icon={Network}
            color="bg-green-500"
            delay={200}
          />
          <StatsCard
            title="Influencers"
            value={realtimeStats.influencers}
            change={15.7}
            icon={Star}
            color="bg-purple-500"
            delay={400}
          />
          <StatsCard
            title="Growth Rate"
            value={realtimeStats.growthRate}
            change={-2.1}
            icon={TrendingUp}
            color="bg-orange-500"
            delay={600}
          />
        </div>
      </div>

      {/* Network Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Network Growth</h3>
                <p className="text-gray-600 text-sm">Weekly user and connection trends</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 mr-4">Users</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Connections</span>
              </div>
            </div>
            
            <AnimatedBarChart 
              data={networkGrowthData} 
              height={300}
              showLegend={true}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => onTabChange('activity')}
            className="w-full mt-4 text-center py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            View All Activity →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">Network Health</h4>
              <p className="text-3xl font-bold">{realtimeStats.users > 0 ? Math.min(100, (realtimeStats.connections / realtimeStats.users) * 20) : 0}%</p>
              <p className="text-blue-100 text-sm">Excellent connectivity</p>
            </div>
            <Zap className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">Active Rate</h4>
              <p className="text-3xl font-bold">{Math.min(100, realtimeStats.growthRate + 15)}%</p>
              <p className="text-green-100 text-sm">High engagement</p>
            </div>
            <Activity className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">Influence Score</h4>
              <p className="text-3xl font-bold">{realtimeStats.influencers > 0 ? Math.min(100, realtimeStats.influencers * 15) : 0}</p>
              <p className="text-purple-100 text-sm">Strong leaders</p>
            </div>
            <Star className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
