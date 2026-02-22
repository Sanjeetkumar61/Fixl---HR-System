import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, CheckCircle, XCircle, User } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { leavesAPI } from '../../services/api';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await leavesAPI.getAll(params);
      setLeaves(res.data.leaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);
    setMessage({ type: '', text: '' });

    try {
      await leavesAPI.updateStatus(id, { status });
      setMessage({ 
        type: 'success', 
        text: `Leave ${status} successfully` 
      });
      fetchLeaves();
    } catch (error) {
      const errorMsg = error.response?.data?.message || `Failed to ${status} leave`;
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      casual: 'Casual Leave',
      sick: 'Sick Leave',
      paid: 'Paid Leave'
    };
    return labels[type] || type;
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
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
        <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
        <p className="text-gray-500 mt-1">Review and manage leave requests</p>
      </div>

      
      {message.text && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-100/80 text-green-700 border border-green-200/50' 
            : 'bg-red-100/80 text-red-700 border border-red-200/50'
        }`}>
          {message.text}
        </div>
      )}

      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

    
      {leaves.length === 0 ? (
        <Card className="text-center py-12">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600">No leave requests</h3>
          <p className="text-gray-500 mt-1">Leave requests will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <Card key={leave._id}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Leave Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                      {leave.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{leave.userId?.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <User size={14} />
                        {leave.userId?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                      {leave.totalDays} day(s)
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                      {getLeaveTypeLabel(leave.leaveType)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 bg-white/30 p-3 rounded-xl">
                    Reason: {leave.reason}
                  </p>

                  <div className="mt-2">
                    <Badge status={leave.status} />
                  </div>
                </div>

              
                {leave.status === 'pending' && (
                  <div className="flex gap-2 lg:flex-col">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(leave._id, 'approved')}
                      loading={processing === leave._id}
                      className="flex-1"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                      loading={processing === leave._id}
                      className="flex-1"
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
