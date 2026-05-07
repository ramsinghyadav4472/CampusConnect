import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, BookOpen, Heart, Star, MapPin, Calendar, Package, Plus, Settings, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { booksService } from '../services/books';
import Avatar from '../components/ui/Avatar';
import BookCard from '../components/features/BookCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Dropdown from '../components/ui/Dropdown';
import { subjects, semesters } from '../data/mockData';
import { useUniversities } from '../hooks/useUniversities';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const TABS = ['My Listings', 'Wishlist', 'Reviews'];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { wishlist } = useWishlist();
  const [tab, setTab] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', university: user?.university || '', branch: user?.branch || '', semester: user?.semester || '' });
  const [saving, setSaving] = useState(false);
  const { universities, loading: loadingUnis, error: uniError } = useUniversities();
  
  const [myBooks, setMyBooks] = useState([]);
  const [wishlistedBooks, setWishlistedBooks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const allBooks = await booksService.getAll();
        setMyBooks(allBooks.filter(b => {
          const sellerId = typeof b.seller === 'object' ? b.seller?._id : b.seller;
          return sellerId === user?._id;
        }));
        setWishlistedBooks(allBooks.filter(b => wishlist.includes(b._id || b.id)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };
    if (user) fetchData();
  }, [user, wishlist]);

  const reviews = [
    { id: 1, reviewer: 'Priya Patel', rating: 5, text: 'Great seller! Book was exactly as described. Very responsive.', date: '2026-04-20' },
    { id: 2, reviewer: 'Amit Kumar', rating: 4, text: 'Good condition, fair price. Would recommend.', date: '2026-04-10' },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateProfile(editForm);
    toast.success('Profile updated!');
    setEditModal(false);
    setSaving(false);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500 mb-4">Please log in to view your profile</p>
        <Link to="/auth"><Button>Sign In</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Cover */}
      <div className="h-48 md:h-64 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Profile header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <Avatar name={user.name} size="xl" className="ring-4 ring-white" />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-700 text-white rounded-full flex items-center justify-center hover:bg-primary-800 transition-colors shadow-lg">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1 sm:pb-2">
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
                <MapPin size={13} />{user.university || 'No university set'}
              </p>
              {user.branch && (
                <p className="text-slate-400 text-xs mt-0.5">{user.branch} • {user.semester}</p>
              )}
            </div>
            <Button icon={Edit3} variant="secondary" onClick={() => setEditModal(true)} size="sm">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Listed', value: myBooks.length, icon: Package },
            { label: 'Sold', value: user.totalSales || 0, icon: BookOpen },
            { label: 'Wishlist', value: wishlist.length, icon: Heart },
            { label: 'Rating', value: user.rating ? `${user.rating}★` : 'New', icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-card">
              <div className="flex justify-center mb-1.5">
                <Icon size={18} className="text-primary-600" />
              </div>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2.5 text-slate-600">
              <Calendar size={16} className="text-slate-400" />
              <span>Joined {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <BookOpen size={16} className="text-slate-400" />
              <span>{user.branch || 'Branch not set'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Star size={16} className="text-amber-400" />
              <span>{user.rating > 0 ? `${user.rating}/5.0 rating` : 'No reviews yet'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex border-b border-slate-100">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors relative
                  ${tab === i ? 'text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
                {tab === i && (
                  <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {tab === 0 && (
                <motion.div key="listings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {myBooks.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={28} className="text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">No listings yet</h3>
                      <p className="text-slate-400 text-sm mb-4">List your first book and start earning!</p>
                      <Link to="/sell"><Button icon={Plus} size="sm">List a Book</Button></Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {myBooks.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === 1 && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {wishlistedBooks.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart size={28} className="text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">Your wishlist is empty</h3>
                      <p className="text-slate-400 text-sm mb-4">Save books you're interested in by clicking the heart icon.</p>
                      <Link to="/dashboard"><Button size="sm">Browse Books</Button></Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {wishlistedBooks.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === 2 && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {reviews.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-slate-400">No reviews yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map(r => (
                        <div key={r.id} className="border border-slate-100 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar name={r.reviewer} size="sm" />
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{r.reviewer}</p>
                              <div className="flex gap-0.5">
                                {Array.from({ length: r.rating }).map((_, j) => (
                                  <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <span className="ml-auto text-xs text-slate-400">{r.date}</span>
                          </div>
                          <p className="text-sm text-slate-600">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Profile" size="md">
        <div className="space-y-4">
          <Input label="Full Name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
          <Dropdown 
            label="University" 
            options={universities} 
            value={editForm.university} 
            onChange={v => setEditForm(f => ({ ...f, university: v }))} 
            placeholder={loadingUnis ? 'Loading universities...' : 'Search your college'}
            searchable 
            loading={loadingUnis}
            error={uniError}
          />
          <Dropdown label="Branch" options={subjects} value={editForm.branch} onChange={v => setEditForm(f => ({ ...f, branch: v }))} />
          <Dropdown label="Current Semester" options={semesters} value={editForm.semester} onChange={v => setEditForm(f => ({ ...f, semester: v }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
