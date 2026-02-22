import { useState } from 'react';
import { CalendarPlus, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { leavesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ApplyLeave = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const leaveTypes = [
    { value: 'casual', label: ' Casual Leave', description: 'General purpose leave' },
    { value: 'sick', label: ' Sick Leave', description: 'For illness or medical reasons' },
    { value: 'paid', label: ' Paid Leave', description: 'Earned paid time off' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start > end) return 0;
    
    let totalDays = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        totalDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return totalDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await leavesAPI.apply({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });

      setMessage({ 
        type: 'success', 
        text: '✓ Leave application submitted successfully! It will be reviewed by your admin.' 
      });
      
    
      const res = await leavesAPI.getMy();
      const updatedUser = { ...user, leaveBalance: user.leaveBalance };
      updateUser(updatedUser);

    
      setTimeout(() => {
        setFormData({
          leaveType: 'casual',
          startDate: '',
          endDate: '',
          reason: ''
        });
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit leave application';
      setMessage({ type: 'error', text: '✗ ' + errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const totalDays = calculateDays();
  const selectedLeaveType = leaveTypes.find(t => t.value === formData.leaveType);
  const sufficientBalance = totalDays <= (user?.leaveBalance || 0);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Apply for Leave</h1>
        <p className="text-gray-500 mt-2">Submit a new leave request to your administrator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {message.text && (
                <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                  )}
                  <p className="font-medium text-sm">{message.text}</p>
                </div>
              )}

             
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {leaveTypes.map(type => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="leaveType"
                        value={type.value}
                        checked={formData.leaveType === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all ${
                        formData.leaveType === type.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
                      }`}>
                        <p className="font-semibold text-gray-800">{type.label}</p>
                        <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide ">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/50 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 
                             text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    min={formData.startDate}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/50 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 
                             text-gray-800"
                  />
                </div>
              </div>

              {totalDays > 0 && (
                <div className={`p-4 rounded-xl border-2 ${
                  sufficientBalance
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <Info className={`w-5 h-5 mt-0.5 ${sufficientBalance ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="text-sm">
                      <p className={`font-semibold ${sufficientBalance ? 'text-green-800' : 'text-red-800'}`}>
                        {totalDays} working day{totalDays !== 1 ? 's' : ''} requested
                      </p>
                      <p className={`text-xs mt-1 ${sufficientBalance ? 'text-green-700' : 'text-red-700'}`}>
                        {sufficientBalance 
                          ? `✓ Sufficient balance. You'll have ${(user?.leaveBalance || 0) - totalDays} days remaining.`
                          : `✗ Insufficient balance. You only have ${user?.leaveBalance || 0} days available.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/50 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 
                           text-gray-800 placeholder-gray-400 resize-none"
                  placeholder="Please provide a reason for your leave request..."
                />
                <p className="text-xs text-gray-500 mt-2">Minimum 10 characters recommended</p>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={totalDays === 0 || !sufficientBalance}
                className="w-full justify-center gap-2"
                size="lg"
              >
                <CalendarPlus size={20} />
                Submit Leave Application
              </Button>
            </form>
          </Card>
        </div>

      
        <div className="lg:col-span-1 space-y-6">
      
          <Card className="text-center sticky top-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 mx-auto shadow-lg">
              <CalendarPlus className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Leave Balance</h3>
            <p className="text-5xl font-bold text-indigo-600 mt-4 mb-2">
              {user?.leaveBalance || 0}
            </p>
            <p className="text-sm text-gray-500 mb-4">days remaining</p>
            
            <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-3">
              <div className="flex items-center gap-2 text-left">
                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                <p className="text-sm text-gray-600">
                  Deducted only after <span className="font-semibold">approval</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-left">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full"></span>
                <p className="text-sm text-gray-600">
                  Admin will review your request
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Info size={18} />
              Quick Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Weekends are excluded from calculation</li>
              <li>✓ Submit requests in advance</li>
              <li>✓ Check admin approval status regularly</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
