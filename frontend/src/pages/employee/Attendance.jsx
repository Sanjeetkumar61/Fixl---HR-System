import { useState, useEffect } from 'react';
import { CalendarCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { attendanceAPI } from '../../services/api';

const Attendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        attendanceAPI.checkToday(),
        attendanceAPI.getMy()
      ]);
      
      setTodayAttendance(todayRes.data);
      setAttendanceHistory(historyRes.data.attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    setMarking(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await attendanceAPI.mark();
      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      fetchAttendance();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to mark attendance';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setMarking(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
        <p className="text-gray-500 mt-1">Mark and track your daily attendance</p>
      </div>

      <Card className="text-center py-8">
        {todayAttendance?.marked ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">You're Marked Present!</h2>
            <p className="text-gray-500">
              Marked at {formatTime(todayAttendance.attendance?.markedAt)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
              <CalendarCheck className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Mark Your Attendance</h2>
            <p className="text-gray-500">
              Today: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            
            {message.text && (
              <div className={`p-3 rounded-xl text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100/80 text-green-700' 
                  : 'bg-red-100/80 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            <Button 
              onClick={handleMarkAttendance} 
              loading={marking}
              size="lg"
              className="mx-auto"
            >
              Mark Present
            </Button>
          </div>
        )}
      </Card>

      {todayAttendance?.marked && (
        <Card className="bg-green-50/50 border-green-200/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">
              You have already marked your attendance for today.
            </p>
          </div>
        </Card>
      )}

     
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Attendance History
        </h3>
        
        {attendanceHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No attendance records yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Day</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.slice(0, 10).map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 text-gray-800">{formatDate(record.date)}</td>
                    <td className="py-3 text-gray-600">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td className="py-3">
                      <Badge status={record.status} />
                    </td>
                    <td className="py-3 text-gray-600">
                      {formatTime(record.markedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Attendance;
