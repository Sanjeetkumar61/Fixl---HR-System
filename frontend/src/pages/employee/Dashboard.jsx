import { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, XCircle, CalendarCheck, TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { leavesAPI, attendanceAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [leaveStats, setLeaveStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [leaveRes, attendanceRes, todayRes] = await Promise.all([
        leavesAPI.getMy(),
        attendanceAPI.getMy(),
        attendanceAPI.checkToday()
      ]);
      
      setLeaveStats(leaveRes.data.stats);
      setAttendanceStats(attendanceRes.data.stats);
      setTodayAttendance(todayRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Leave Balance',
      value: user?.leaveBalance || 0,
      unit: 'days',
      icon: CalendarDays,
      color: 'from-indigo-500 to-violet-600',
      bgColor: 'from-indigo-50 to-indigo-100/50',
      textColor: 'text-indigo-600',
      border: 'border-indigo-200/50'
    },
    {
      title: 'Pending Requests',
      value: leaveStats?.pendingLeaves || 0,
      unit: 'pending',
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-yellow-100/50',
      textColor: 'text-yellow-600',
      border: 'border-yellow-200/50'
    },
    {
      title: 'Leaves Taken',
      value: leaveStats?.totalDaysTaken || 0,
      unit: 'days',
      icon: CalendarCheck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-green-100/50',
      textColor: 'text-green-600',
      border: 'border-green-200/50'
    },
    {
      title: 'Attendance Today',
      value: todayAttendance?.marked ? 'Present' : 'Absent',
      unit: todayAttendance?.marked ? '✓' : '✗',
      icon: todayAttendance?.marked ? CheckCircle : XCircle,
      color: todayAttendance?.marked 
        ? 'from-green-500 to-emerald-600' 
        : 'from-red-500 to-rose-600',
      bgColor: todayAttendance?.marked ? 'from-green-50 to-green-100/50' : 'from-red-50 to-red-100/50',
      textColor: todayAttendance?.marked ? 'text-green-600' : 'text-red-600',
      border: todayAttendance?.marked ? 'border-green-200/50' : 'border-red-200/50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Welcome, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Here's your attendance and leave overview
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 w-fit">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.bgColor} border ${stat.border} overflow-hidden group hover:shadow-lg transition-all`}>
            <div className="relative">
              
              <div className="pt-1">
              
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">{stat.title}</p>
                  <div className={`p-3 rounded-lg bg-white/50 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">{stat.unit}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-indigo-500 rounded-full"></span>
              Leave Summary
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Pending</span>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm">
                  {leaveStats?.pendingLeaves || 0}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Approved</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                  {leaveStats?.approvedLeaves || 0}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Rejected</span>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm">
                  {leaveStats?.rejectedLeaves || 0}
                </span>
              </div>
            </div>
          </div>

          <Link to="/apply-leave" className="block mt-6">
            <Button className="w-full justify-center gap-2 text-sm sm:text-base cursor-pointer">
              <CalendarDays size={18} />
              Apply Leave
            </Button>
          </Link>
        </Card>

        <Card className="lg:col-span-1 bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-violet-500 rounded-full"></span>
              Attendance Summary
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Total Days</span>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                  {attendanceStats?.totalDays || 0}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Present</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                  {attendanceStats?.presentDays || 0}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Late</span>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
                  {attendanceStats?.lateDays || 0}
                </span>
              </div>
            </div>
          </div>

          <Link to="/attendance" className="block mt-6">
            <Button className="w-full justify-center gap-2 text-sm sm:text-base cursor-pointer" variant="secondary">
              Check Attendance
            </Button>
          </Link>
        </Card>

        <Card className="lg:col-span-1 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-purple-500 rounded-full"></span>
            Quick Stats
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Attendance Rate</p>
              </div>
              <div className="flex items-baseline gap-2 ml-12">
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {attendanceStats?.totalDays > 0 ? Math.round((attendanceStats?.presentDays / attendanceStats?.totalDays) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Days Remaining</p>
              </div>
              <div className="flex items-baseline gap-2 ml-12">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{user?.leaveBalance || 0}</p>
              </div>
            </div>


            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs sm:text-sm font-semibold text-green-700">All Systems Active</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
