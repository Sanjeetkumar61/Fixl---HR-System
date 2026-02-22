import { useState } from 'react';
import { User, Mail, Briefcase, Calendar, CheckCircle, Edit3, Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 mt-2">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="text-center sticky top-20">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 text-white">
                <span className="text-6xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 capitalize text-lg mt-2 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
              {user?.role}
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-4">
              {/* Email */}
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Mail size={20} className="text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <Briefcase size={20} className="text-violet-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-semibold text-gray-800 text-sm">{user?.department || 'Not assigned'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant={editing ? "success" : "secondary"}
              className="mt-6 w-full justify-center gap-2"
              onClick={() => setEditing(!editing)}
            >
              <Edit3 size={18} />
              {editing ? 'Viewing' : 'Edit Profile'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full"></span>
                Profile Information
              </h3>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
              
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/50 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 
                             text-gray-800 placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100/50 border border-gray-200/50 
                             text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">Email address cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200/50 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 
                             text-gray-800 placeholder-gray-400"
                    placeholder="Enter your department"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 justify-center gap-2">
                    <Save size={18} />
                    Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="flex-1 justify-center"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50">
                    <label className="block text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-indigo-500" />
                      <span className="font-semibold text-gray-800 text-lg">{user?.name}</span>
                    </div>
                  </div>
                  
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/50">
                    <label className="block text-xs font-semibold text-violet-600 mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-violet-500" />
                      <span className="font-semibold text-gray-800 text-sm">{user?.email}</span>
                    </div>
                  </div>
                  
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
                    <label className="block text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                      Department
                    </label>
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-purple-500" />
                      <span className="font-semibold text-gray-800">{user?.department || 'Not assigned'}</span>
                    </div>
                  </div>
                  
                 
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
                    <label className="block text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">
                      Leave Balance
                    </label>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="font-semibold text-gray-800 text-lg">{user?.leaveBalance} days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          
          <Card>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-violet-500 rounded-full"></span>
              Account Information
            </h3>
            
            <div className="space-y-4">
          
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 rounded-xl border border-gray-200/30">
                <span className="text-gray-600 font-medium">Account Type</span>
                <span className="inline-block px-4 py-2 font-semibold text-indigo-600 bg-indigo-100/50 rounded-lg capitalize">
                  {user?.role}
                </span>
              </div>

             
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-xl border border-gray-200/30">
                <span className="text-gray-600 font-medium">Member Since</span>
                <span className="font-semibold text-gray-800">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-gray-200/30">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-semibold text-green-600">Active</span>
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
