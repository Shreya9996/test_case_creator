import React, { useState, useEffect } from 'react';
import { TrendChart } from './TrendChart';
import { useAppContext } from '../contexts/AppContext';
import { Zap, TrendingUp } from 'lucide-react';
import { aiClient } from '../../utils/aiClient';

export function AnalyticsDashboard() {
  const { user } = useAppContext();

  const [stats, setStats] = useState([
    { icon: Zap, label: 'Cases Generated', value: '0', change: '0%', color: '#a78bfa' },
    { icon: TrendingUp, label: 'Active Sessions', value: '0', change: 'Live', color: '#f59e0b' },
  ]);

  const [activityBreakdown, setActivityBreakdown] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;

      try {
        const response = await aiClient.request(`/ai/analytics?userId=${user.id}`);
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid API response');
        }
        if (response?.success && response?.data) {
          const data = response.data;

          setStats([
            {
              icon: Zap,
              label: 'Cases Generated',
              value: data.totalTestCases?.toString() || '0',
              color: '#a78bfa',
              change: data.totalTestCases > 0 ? '+10%' : '0%',
            },
            {
              icon: TrendingUp,
              label: 'Active Sessions',
              value: data.activeSessions?.toString() || '0',
              color: '#f59e0b',
              change: 'Live',
            },
          ]);

          setActivityBreakdown([
            { name: 'Authentication', percentage: 35 },
            { name: 'API', percentage: 25 },
            { name: 'UI/UX', percentage: 20 },
            { name: 'Database', percentage: 20 },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);

        // fallback safe state
        setStats((prev) =>
          prev.map((s) => ({ ...s, value: '0', change: '0%' }))
        );
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  return (
    <div className="p-7">
      <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1.5">
        Analytics
      </h1>
      <p className="text-[13px] text-[#66667a] mb-6">
        Track your test generation activity and insights.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}20` }}
              >
                <stat.icon size={18} color={stat.color} />
              </div>
              <span className="badge badge-green">{stat.change}</span>
            </div>
            <div className="syne text-[28px] font-extrabold text-[#e8e8f0] leading-tight">
              {stat.value}
            </div>
            <div className="text-xs text-[#66667a] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-6">
          <h2 className="syne text-[15px] font-bold text-[#e8e8f0] mb-5">
            Generation Trend (Last 7 Days)
          </h2>
          <TrendChart />
        </div>

        <div className="glass p-6">
          <h2 className="syne text-[15px] font-bold text-[#e8e8f0] mb-4">
            By Module
          </h2>

          <div className="flex flex-col gap-3">
            {activityBreakdown.length === 0 ? (
              <p className="text-[#66667a] text-sm">
                No module breakdown data available yet.
              </p>
            ) : (
              activityBreakdown.map((module) => (
                <div key={module.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#c4c4d4]">{module.name}</span>
                    <span className="text-[#a78bfa] font-bold">
                      {module.percentage}%
                    </span>
                  </div>
                  <div className="prog-bar">
                    <div
                      className="prog-fill"
                      style={{ width: `${module.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}