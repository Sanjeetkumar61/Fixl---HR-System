import { useState, useEffect } from 'react';
import { Users, CalendarCheck, ClipboardList, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import { usersAPI, attendanceAPI, leavesAPI } from '../../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    approvedLeaves: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStats, attendanceStats, leaveStats] = await Promise.all([
        usersAPI.getStats(),
        attendanceAPI.getStats(),
        leavesAPI.getStats()
      ]);

      setStats({
        totalEmployees: userStats.data.stats.totalEmployees,
        presentToday: attendanceStats.data.stats.presentToday,
        pendingLeaves: leaveStats.data.stats.pendingCount,
        approvedLeaves: leaveStats.data.stats.approvedCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: CalendarCheck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: ClipboardList,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Approved Leaves',
      value: stats.approvedLeaves,
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of the HR system</p>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
          </Card>
        ))}
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            System Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-semibold text-gray-800">{stats.totalEmployees}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-gray-600">Present Today</span>
              <span className="font-semibold text-green-600">{stats.presentToday}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-gray-600">Absent Today</span>
              <span className="font-semibold text-red-600">
                {stats.totalEmployees - stats.presentToday}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Leave Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-gray-600">Pending Requests</span>
              <span className="font-semibold text-yellow-600">{stats.pendingLeaves}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-gray-600">Approved This Month</span>
              <span className="font-semibold text-green-600">{stats.approvedLeaves}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
