import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Bell, Heart, MessageSquare, User, LogOut, Plus, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Browse', icon: LayoutDashboard },
        { to: '/sell', label: 'Sell Book', icon: Plus, highlight: true },
        { to: '/chat', label: 'Messages', icon: MessageSquare },
      ]
    : [];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isLanding && !scrolled
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-700 rounded-xl flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className={`font-bold text-lg hidden sm:block ${isLanding && !scrolled ? 'text-white' : 'text-slate-900'}`}>
              Campus<span className="text-primary-500">Connect</span>
            </span>
          </Link>

          {/* Search bar - desktop */}
          {user && (
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search books, subjects, notes..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </form>
          )}

          <div className="flex-1" />

          {/* Nav links desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                  ${link.highlight
                    ? 'bg-primary-700 text-white hover:bg-primary-800'
                    : isLanding && !scrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <Link to="/profile" className={`relative p-2 rounded-xl transition-colors ${isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { to: '/profile', icon: User, label: 'My Profile' },
                          { to: '/dashboard', icon: LayoutDashboard, label: 'Browse Books' },
                          { to: '/admin', icon: Shield, label: 'Admin Panel' },
                        ].map(item => (
                          <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <item.icon size={16} className="text-slate-400" />
                            {item.label}
                          </Link>
                        ))}
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => { logout(); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}>
                Login
              </Link>
              <Link to="/auth?mode=register" className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-700 text-white hover:bg-primary-800 transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className={`md:hidden p-2 rounded-xl transition-colors ${isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {user && (
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search books..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                    />
                  </div>
                </form>
              )}
              {user ? (
                <>
                  {navLinks.map(link => (
                    <Link key={link.to} to={link.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  ))}
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <User size={18} />My Profile
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                    <LogOut size={18} />Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">Login</Link>
                  <Link to="/auth?mode=register" className="block px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary-700 text-white hover:bg-primary-800 text-center">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
