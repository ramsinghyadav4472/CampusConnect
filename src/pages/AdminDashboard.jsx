import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Eye, Search, ToggleLeft, ToggleRight, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { usersService } from '../services/users';
import { booksService } from '../services/books';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { TableRowSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const stats = [
  { label: 'Total Users', value: '5,234', change: '+12%', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { label: 'Total Listings', value: '12,891', change: '+8%', icon: BookOpen, color: 'text-green-600 bg-green-50' },
  { label: 'This Month Views', value: '48,230', change: '+23%', icon: Eye, color: 'text-purple-600 bg-purple-50' },
  { label: 'Successful Trades', value: '2,891', change: '+15%', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, booksData] = await Promise.all([
          usersService.getAllUsers(),
          booksService.getAll()
        ]);
        setUsers(usersData);
        setListings(booksData.map(b => ({ ...b, active: b.isAvailable })));
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.university.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredListings = listings.filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.subject.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const toggleListing = (id) => {
    setListings(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.success('Listing status updated');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm ml-13">Manage users, listings, and platform activity</p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                  {s.change} this month
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex border-b border-slate-100 px-2">
            {['users', 'listings'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-4 text-sm font-semibold capitalize transition-colors relative
                  ${activeTab === t ? 'text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'users' ? `Users (${users.length})` : `Listings (${listings.length})`}
                {activeTab === t && (
                  <motion.div layoutId="admin-tab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* Search */}
            <div className="relative mb-5 max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={activeTab === 'users' ? userSearch : bookSearch}
                onChange={e => activeTab === 'users' ? setUserSearch(e.target.value) : setBookSearch(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-primary-400"
              />
            </div>

            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['User', 'Email', 'University', 'Listings', 'Rating', 'Joined', 'Action'].map(h => (
                        <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={u.name} size="sm" />
                            <span className="font-medium text-slate-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-500 text-xs">{u.email}</td>
                        <td className="px-3 py-3 text-slate-500 text-xs truncate max-w-xs">{u.university}</td>
                        <td className="px-3 py-3">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{u.listings?.length || 0}</span>
                        </td>
                        <td className="px-3 py-3 text-amber-600 font-semibold">★ {u.rating || 'N/A'}</td>
                        <td className="px-3 py-3 text-slate-400 text-xs">{u.joinedAt}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-primary-600 hover:underline font-medium">View</button>
                            <span className="text-slate-200">|</span>
                            <button
                              onClick={() => toast.success('User suspended')}
                              className="text-xs text-red-500 hover:underline font-medium"
                            >
                              Suspend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p className="text-sm">No users found</p>
                  </div>
                )}
              </div>
            )}

            {/* Listings Table */}
            {activeTab === 'listings' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Book', 'Seller', 'Subject', 'Price', 'Condition', 'Views', 'Status', 'Action'].map(h => (
                        <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredListings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5 max-w-xs">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                              <img src={b.images[0]} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                            </div>
                            <span className="font-medium text-slate-900 line-clamp-2 text-xs">{b.title}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-500 text-xs">{b.seller.name}</td>
                        <td className="px-3 py-3"><Badge variant="indigo">{b.subject}</Badge></td>
                        <td className="px-3 py-3 font-semibold text-slate-900">₹{b.price}</td>
                        <td className="px-3 py-3"><Badge condition={b.condition}>{b.condition}</Badge></td>
                        <td className="px-3 py-3 text-slate-500">{b.views}</td>
                        <td className="px-3 py-3">
                          {b.active
                            ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={13} />Active</span>
                            : <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={13} />Inactive</span>
                          }
                        </td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => toggleListing(b.id)}
                            className={`flex items-center gap-1 text-xs font-medium transition-colors ${b.active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {b.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {b.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredListings.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p className="text-sm">No listings found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
