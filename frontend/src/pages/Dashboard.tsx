import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  HeartIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Documents Analyzed',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/documents'
    },
    {
      name: 'Forecasts Generated',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-green-500',
      href: '/forecasting'
    },
    {
      name: 'Investment Recommendations',
      value: '89',
      change: '+15%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      href: '/strategy'
    },
    {
      name: 'Sentiment Analyses',
      value: '67',
      change: '-3%',
      changeType: 'decrease',
      icon: HeartIcon,
      color: 'bg-red-500',
      href: '/sentiment'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'Document Upload',
      description: 'Q4 Earnings Report uploaded',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'Forecast Generated',
      description: 'Stock price forecast for AAPL',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'Investment Recommendation',
      description: 'BUY recommendation for TSLA',
      time: '6 hours ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'Sentiment Analysis',
      description: 'Market sentiment analysis completed',
      time: '8 hours ago',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      name: 'Upload Document',
      description: 'Upload financial documents for analysis',
      href: '/documents',
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Generate Forecast',
      description: 'Create financial forecasts for any symbol',
      href: '/forecasting',
      icon: ChartBarIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Get Investment Advice',
      description: 'Receive buy/sell recommendations',
      href: '/strategy',
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Analyze Sentiment',
      description: 'Analyze market sentiment',
      href: '/sentiment',
      icon: HeartIcon,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to FinDocGPT - Your AI-powered financial analysis platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color.replace('bg-', 'bg-')}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === 'increase' ? (
                <ArrowUpIcon className="w-4 h-4 text-success-600" />
              ) : stat.changeType === 'decrease' ? (
                <ArrowDownIcon className="w-4 h-4 text-danger-600" />
              ) : (
                <MinusIcon className="w-4 h-4 text-gray-400" />
              )}
              <span className={`ml-1 text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-success-600' :
                stat.changeType === 'decrease' ? 'text-danger-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="card hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className={`p-3 rounded-lg ${action.color} w-fit mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {action.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="card">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 