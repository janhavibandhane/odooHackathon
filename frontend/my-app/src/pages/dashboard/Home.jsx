import { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Download,
  RefreshCw,
  MoreVertical,
  Bell,
  Search,
  Sparkles,
  Award,
  Target,
  Zap,
  Shield,
  Crown,
  Star,
  BarChart3,
  Wallet,
  Globe,
  Clock,
} from 'lucide-react';

import api from '../../api/axios';
import { toast } from 'react-toastify';

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900" />

    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
    <div className="absolute bottom-0 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />
  </div>
);

// Counter
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{Number(count).toLocaleString()}</span>;
};

// Stat Card
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isPositive,
  subtitle,
  color,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    green: 'from-green-500 to-emerald-500',
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute -inset-0.5 rounded-2xl blur opacity-30 bg-gradient-to-r ${gradients[color]} ${
          isHovered ? 'scale-105 opacity-100' : ''
        } transition duration-300`}
      />

      <div className="relative glass-card p-6 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center text-white shadow-lg`}
          >
            <Icon className="w-7 h-7" />
          </div>

          <div
            className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full ${
              isPositive
                ? 'bg-green-500/20 text-green-600'
                : 'bg-red-500/20 text-red-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}

            {trend}%
          </div>
        </div>

        <div>
          <h3 className="text-base-content/60 text-sm font-medium mb-1">
            {title}
          </h3>

          <p className="text-4xl font-bold">
            {title === 'Total Revenue' ? '$' : ''}
            <AnimatedCounter value={value} />
          </p>

          {subtitle && (
            <p className="text-xs text-base-content/40 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
            gradients[color]
          } rounded-b-2xl transition-all duration-300 ${
            isHovered ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    </div>
  );
};

// Revenue Chart
const RevenueChart = ({
  data,
  selectedPeriod,
  setSelectedPeriod,
}) => {
  const [activePoint, setActivePoint] = useState(null);

  const maxValue = Math.max(...data);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            Revenue Analytics
          </h3>

          <p className="text-base-content/50 text-sm mt-1">
            Track your revenue performance
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-80">
        <svg viewBox="0 0 800 300" className="w-full h-full">
          <polyline
            points={data
              .map(
                (value, index) =>
                  `${(index / (data.length - 1)) * 800},${
                    300 - (value / maxValue) * 250
                  }`
              )
              .join(' ')}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="4"
          />

          {data.map((value, index) => (
            <circle
              key={index}
              cx={(index / (data.length - 1)) * 800}
              cy={300 - (value / maxValue) * 250}
              r="6"
              fill="#8b5cf6"
              onMouseEnter={() => setActivePoint(index)}
              onMouseLeave={() => setActivePoint(null)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

// Activity Feed
const ActivityFeed = ({ activities }) => {
  const icons = [User, Award, Target, Zap, Shield, Crown, Star];

  return (
    <div className="space-y-3">
      {activities?.map((activity, index) => {
        const IconComponent = icons[index % icons.length];

        return (
          <div
            key={activity.id}
            className="group relative overflow-hidden rounded-xl p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4 relative">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-base-content">
                  {activity.message}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-base-content/40" />

                  <span className="text-xs text-base-content/40">
                    {activity.time}
                  </span>
                </div>
              </div>

              <MoreVertical className="w-4 h-4 text-base-content/40" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] =
    useState('weekly');

  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const revenueData = {
    weekly: [18500, 19200, 18800, 21500, 23800, 25600, 28900],
    monthly: [45800, 52300, 58900, 65700, 71200, 78900, 84500],
    yearly: [
      425000,
      487000,
      568000,
      678000,
      789000,
      890000,
      1020000,
    ],
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStatsData(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    await fetchDashboardData();

    setTimeout(() => setRefreshing(false), 1000);

    toast.success('Dashboard refreshed!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />

        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-purple-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const statsList = [
    {
      title: 'Total Revenue',
      value: statsData?.revenue?.value || 125890,
      icon: Wallet,
      trend: 23.5,
      isPositive: true,
      subtitle: 'vs. last month',
      color: 'blue',
    },

    {
      title: 'Active Users',
      value: statsData?.users?.value || 2847,
      icon: Users,
      trend: 18.2,
      isPositive: true,
      subtitle: 'new users this week',
      color: 'purple',
    },

    {
      title: 'Active Sessions',
      value: statsData?.sessions?.value || 1542,
      icon: Activity,
      trend: 12.8,
      isPositive: true,
      subtitle: 'current active',
      color: 'orange',
    },

    {
      title: 'Conversion Rate',
      value: 24.8,
      icon: Target,
      trend: 5.3,
      isPositive: true,
      subtitle: 'vs. last week',
      color: 'green',
    },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Banner */}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Welcome back, Admin!
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-9 pr-4 py-2 rounded-xl bg-white/20 border border-white/30 focus:outline-none text-white placeholder-white/60"
                />
              </div>

              <button className="relative p-2 rounded-xl bg-white/20 hover:bg-white/30">
                <Bell className="w-5 h-5" />
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30"
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    refreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>

              <button className="bg-white text-purple-600 px-5 py-2 rounded-xl font-semibold shadow-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl bg-white/90 shadow-xl">
            <RevenueChart
              data={revenueData[selectedPeriod]}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
            />
          </div>

          <div className="glass-card p-6 rounded-2xl bg-white/90 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">
              Performance Metrics
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>User Growth</span>
                  <span className="font-bold text-purple-600">
                    +245 this week
                  </span>
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity */}

        <div className="glass-card p-6 rounded-2xl bg-white/90 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">
              Live Activity Feed
            </h3>

            <button className="text-sm text-purple-600 font-semibold">
              View All →
            </button>
          </div>

          <ActivityFeed
            activities={
              statsData?.recentActivity || [
                {
                  id: 1,
                  message: 'New user registered',
                  time: '2 minutes ago',
                },

                {
                  id: 2,
                  message: 'Payment received',
                  time: '15 minutes ago',
                },

                {
                  id: 3,
                  message: 'New support ticket',
                  time: '1 hour ago',
                },
              ]
            }
          />
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }

          33% {
            transform: translate(30px, -50px) scale(1.1);
          }

          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }

          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            #8b5cf6,
            #ec4899
          );
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Home;