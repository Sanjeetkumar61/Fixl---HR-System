import { useState, useEffect } from 'react';
import { Users, Mail, Briefcase, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { usersAPI } from '../../services/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await usersAPI.getAll();
      setEmployees(res.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
        <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
        <p className="text-gray-500 mt-1">View and manage all employees</p>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </div>
        </div>
      </Card>

      {employees.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600">No employees found</h3>
          <p className="text-gray-500 mt-1">Employees will appear here after registration</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <Card key={employee._id}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{employee.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{employee.role}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={16} className="text-gray-400" />
                  <span>{employee.department || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Joined {formatDate(employee.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Leave Balance</p>
                  <p className="font-semibold text-indigo-600">{employee.leaveBalance} days</p>
                </div>
                <Badge status="active" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
