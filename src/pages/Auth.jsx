import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building2, Eye, EyeOff, BookOpen, ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useUniversities } from '../hooks/useUniversities';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import toast from 'react-hot-toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [otpMode, setOtpMode] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { login, register, googleLogin, user } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', otp: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { universities, loading: loadingUnis, error: uniError } = useUniversities();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (!otpMode && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && !form.university) e.university = 'Please select your university';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back! 👋');
        navigate('/dashboard');
      } else {
        await register({ 
          name: form.name, 
          email: form.email, 
          university: form.university,
          password: form.password
        });
        toast.success('Account created! Welcome to CampusConnect 🎉');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
            <BookOpen size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            {mode === 'login' ? 'Welcome back!' : 'Join CampusConnect'}
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            {mode === 'login'
              ? 'Your campus book marketplace awaits. Find amazing deals or reach thousands of students instantly.'
              : 'Connect with students from your campus. Buy and sell books, notes, and more.'}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { num: '12K+', label: 'Books' },
              { num: '5K+', label: 'Students' },
              { num: '80%', label: 'Savings' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-black text-white">{s.num}</div>
                <div className="text-blue-200 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-700 rounded-xl flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Campus<span className="text-primary-600">Connect</span></span>
          </Link>

          {/* Mode tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setErrors({}); setOtpMode(false); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200
                  ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode + (otpMode ? '-otp' : '')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-slate-900">
                  {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }} className="text-primary-600 font-medium hover:underline">
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {mode === 'register' && (
                <Input
                  label="Full Name"
                  required
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Your full name"
                  iconLeft={User}
                  error={errors.name}
                />
              )}

              <Input
                label="Primary Email Address"
                required
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder={mode === 'register' ? 'your.name@gmail.com' : 'Enter your email'}
                iconLeft={Mail}
                error={errors.email}
              />

              {mode === 'register' && (
                <Dropdown
                  label="University / College"
                  required
                  options={universities}
                  value={form.university}
                  onChange={v => update('university', v)}
                  placeholder={loadingUnis ? 'Loading universities...' : 'Search and select your college'}
                  searchable
                  loading={loadingUnis}
                  error={errors.university || uniError}
                />
              )}

              {!otpMode ? (
                <div className="relative">
                  <Input
                    label="Password"
                    required
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder={mode === 'register' ? 'Create a strong password' : 'Enter your password'}
                    iconLeft={Lock}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    iconLeft={Smartphone}
                  />
                  <div className="flex gap-3">
                    <Input
                      label="OTP"
                      value={form.otp}
                      onChange={e => update('otp', e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1"
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700 invisible">Send</label>
                      <button type="button" className="px-4 py-3 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors whitespace-nowrap">
                        Send OTP
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => setOtpMode(o => !o)} className="text-primary-600 hover:underline font-medium">
                    {otpMode ? '← Use Password' : 'Login with OTP'}
                  </button>
                  <button type="button" className="text-slate-500 hover:text-slate-700">Forgot password?</button>
                </div>
              )}

              <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-slate-50 text-slate-400">or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const rawToken = credentialResponse.credential;
                    const decoded = jwtDecode(rawToken);
                    googleLogin(rawToken).then(() => {
                      toast.success(`Welcome ${decoded.name}! 🎉`);
                      navigate('/dashboard');
                    }).catch(err => {
                      toast.error(err.message || 'Google Sign-In Failed');
                    });
                  }}
                  onError={() => {
                    toast.error('Google Sign-In Failed');
                  }}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
