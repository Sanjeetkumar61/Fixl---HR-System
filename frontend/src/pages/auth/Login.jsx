 import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react'; // ShieldCheck icon add kiya admin ke liye
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false); 
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location.state]);

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative animate-in fade-in duration-500">
        
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg transition-all duration-500 ${isAdminMode ? 'bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-500/30' : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30'} mb-4`}>
            {isAdminMode ? <ShieldCheck className="w-8 h-8 text-white" /> : <LogIn className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent transition-all">
            {isAdminMode ? 'Admin Login' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isAdminMode ? 'Access the Fixl Management Panel' : 'Sign in to HR Management System'}
          </p>
        </div>

      
        <div className="bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100/80 border border-red-200/50 text-red-600 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100/80 border border-green-200/50 text-green-700 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isAdminMode ? 'Admin Email' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/20 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                         focus:border-transparent transition-all"
                placeholder={isAdminMode ? "admin@fixl.com" : "you@example.com"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/20 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                           focus:border-transparent transition-all pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className={`w-full ${isAdminMode ? 'bg-slate-800 hover:bg-slate-900' : ''}`}
              size="lg"
            >
              {isAdminMode ? 'Login as Admin' : 'Sign In'}
            </Button>
          </form>

      
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Register here
              </Link>
            </p>
            
            <div className="pt-2 border-t border-gray-200/30">
              <button 
                type="button"
                onClick={toggleMode}
                className="text-indigo-600 font-bold text-sm hover:text-indigo-800 flex items-center justify-center gap-2 mx-auto transition-all active:scale-95 cursor-pointer"
              >
                {isAdminMode ? (
                  <>Back to Employee Login</>
                ) : (
                  <>Admin Login here</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;