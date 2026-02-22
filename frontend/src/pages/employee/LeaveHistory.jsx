import { useState, useEffect } from 'react';
import { History, Calendar, Trash2, Edit, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { leavesAPI } from '../../services/api';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLeave, setEditingLeave] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await leavesAPI.getMy();
      setLeaves(res.data.leaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;
    
    try {
      await leavesAPI.cancel(id);
      setMessage({ type: 'success', text: 'Leave cancelled successfully' });
      fetchLeaves();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to cancel leave';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave._id);
    setFormData({
      leaveType: leave.leaveType,
      startDate: new Date(leave.startDate).toISOString().split('T')[0],
      endDate: new Date(leave.endDate).toISOString().split('T')[0],
      reason: leave.reason
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await leavesAPI.update(editingLeave, formData);
      setMessage({ type: 'success', text: 'Leave updated successfully' });
      setEditingLeave(null);
      fetchLeaves();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update leave';
      setMessage({ type: 'error', text: errorMsg });
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
        <h1 className="text-3xl font-bold text-gray-800">Leave History</h1>
        <p className="text-gray-500 mt-1">View and manage your leave requests</p>
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

      {leaves.length === 0 ? (
        <Card className="text-center py-12">
          <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600">No leave requests yet</h3>
          <p className="text-gray-500 mt-1">Apply for leave to see your history here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <Card key={leave._id}>
              {editingLeave === leave._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Edit Leave Request</h3>
                    <button
                      type="button"
                      onClick={() => setEditingLeave(null)}
                      className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave Type
                      </label>
                      <select
                        value={formData.leaveType}
                        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/20"
                      >
                        <option value="casual">Casual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="paid">Paid Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Days
                      </label>
                      <p className="px-4 py-2 bg-white/30 rounded-xl">{leave.totalDays} days</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/20"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button type="submit">Save Changes</Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setEditingLeave(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getLeaveTypeLabel(leave.leaveType)}
                      </h3>
                      <Badge status={leave.status} />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-white/30 rounded-full">
                        {leave.totalDays} day(s)
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-500">
                      {leave.reason}
                    </p>
                    
                    {leave.status === 'rejected' && leave.rejectionReason && (
                      <p className="mt-2 text-sm text-red-600">
                        Rejection reason: {leave.rejectionReason}
                      </p>
                    )}
                  </div>
                  
                  {leave.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(leave)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(leave._id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
