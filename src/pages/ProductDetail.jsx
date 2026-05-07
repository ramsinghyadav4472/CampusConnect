import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Eye, Star, MapPin, ArrowLeft, Shield, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { booksService } from '../services/books';
import { chatService } from '../services/chats';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import BookCard from '../components/features/BookCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [contactModal, setContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isOwner = user && book?.seller && (
    book.seller._id === (user._id || user.id) || 
    book.seller.id === (user._id || user.id)
  );

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const fetchedBook = await booksService.getById(id);
        setBook(fetchedBook);
        setCurrentImg(0);
        
        if (fetchedBook) {
          const allBooks = await booksService.getAll();
          setRelated(allBooks.filter(b => b.id !== fetchedBook.id && b.subject === fetchedBook.subject).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex justify-center">
        <p className="text-slate-500 mt-20">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-5 text-slate-300">
          <BookOpen size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Book Not Found</h3>
        <p className="text-slate-500 mb-6 text-center max-w-sm">The book you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/dashboard')} icon={ArrowLeft}>Back to listings</Button>
      </div>
    );
  }

  const wishlisted = isWishlisted(book.id);

  const handleContact = () => {
    if (!user) { navigate('/auth'); return; }
    setContactModal(true);
    setMessage(`Hi! I'm interested in your book "${book.title}". Is it still available?`);
  };

  const handleSendMessage = async () => {
    setSending(true);
    try {
      await chatService.sendMessage(book.seller?._id || book.seller?.id, message, book._id || book.id);
      toast.success('Message sent! The seller will respond soon.');
      setContactModal(false);
      navigate('/chat');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async () => {
    setUpdating(true);
    try {
      const updatedBook = await booksService.update(book._id || book.id, {
        isAvailable: !book.isAvailable
      });
      setBook({ ...book, isAvailable: updatedBook.isAvailable });
      toast.success(updatedBook.isAvailable ? 'Book marked as available!' : 'Book marked as sold!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const discount = book.originalPrice ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-card aspect-[4/3]">
              {book.images && book.images.length > 0 ? (
                <img
                  src={book.images[currentImg]}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <BookOpen size={48} />
                </div>
              )}
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge condition={book.condition}>{book.condition}</Badge>
                {!book.isAvailable && (
                  <span className="px-2.5 py-0.5 bg-slate-800/80 text-white text-xs rounded-full font-semibold backdrop-blur-sm">Sold</span>
                )}
              </div>

              {/* Navigation arrows */}
              {book.images && book.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg(i => (i - 1 + book.images.length) % book.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentImg(i => (i + 1) % book.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                <Eye size={12} />
                {book.views} views
              </div>
            </div>

            {/* Thumbnail strip */}
            {book.images && book.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {book.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentImg === i ? 'border-primary-500 scale-105' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="indigo">{book.subject}</Badge>
              <Badge variant="slate">{book.semester}</Badge>
              <Badge variant="purple">{book.category}</Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{book.title}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-black text-slate-900">₹{book.price}</span>
              {book.originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">₹{book.originalPrice}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-5">{book.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: Clock, label: 'Posted', value: book.postedAt },
                { icon: Heart, label: 'Wishlisted', value: `${book.wishlistCount} times` },
                { icon: Eye, label: 'Views', value: book.views },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <Icon size={16} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Seller card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={book.seller?.name || 'Unknown Seller'} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{book.seller?.name || 'Unknown Seller'}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <MapPin size={11} />{book.seller?.university || 'University not specified'}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-sm font-bold">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  {book.seller?.rating || 0}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield size={12} className="text-green-500" />
                <span>Campus verified seller</span>
                <span className="mx-1">•</span>
                <span>{book.seller?.totalSales || 0} successful sales</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isOwner ? (
                <Button
                  onClick={handleToggleStatus}
                  size="lg"
                  loading={updating}
                  icon={book.isAvailable ? Shield : BookOpen}
                  className="flex-1"
                  variant={book.isAvailable ? "secondary" : "primary"}
                >
                  {book.isAvailable ? 'Mark as Sold' : 'Mark as Available'}
                </Button>
              ) : (
                <Button
                  onClick={handleContact}
                  size="lg"
                  icon={MessageCircle}
                  className="flex-1"
                  disabled={!book.isAvailable}
                >
                  {book.isAvailable ? 'Contact Seller' : 'Book Sold'}
                </Button>
              )}
              <button
                onClick={() => {
                  if (!user) { navigate('/auth'); return; }
                  toggleWishlist(book.id);
                  toast.success(isWishlisted(book.id) ? 'Removed from wishlist' : 'Added to wishlist ❤️');
                }}
                className={`p-3.5 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95
                  ${wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400'}`}
              >
                <Heart size={22} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="p-3.5 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all"
              >
                <Share2 size={22} />
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
              <Shield size={12} className="text-green-500" />
              Always meet on campus for a safe transaction
            </p>
          </motion.div>
        </div>

        {/* Related books */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-5">More in {book.subject}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Modal isOpen={contactModal} onClose={() => setContactModal(false)} title="Contact Seller">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Avatar name={book.seller?.name || 'Unknown Seller'} size="md" />
            <div>
              <p className="font-semibold text-slate-900">{book.seller?.name || 'Unknown Seller'}</p>
              <p className="text-xs text-slate-500">{book.seller?.university || 'University not specified'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Your message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setContactModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSendMessage} loading={sending} icon={MessageCircle} className="flex-1">
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
