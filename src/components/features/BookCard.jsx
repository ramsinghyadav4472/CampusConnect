import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, Eye, MapPin, Tag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

const conditionColor = { 'Like New': 'green', 'Good': 'blue', 'Acceptable': 'amber' };

const BookCard = ({ book, index = 0 }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const bookId = book._id || book.id;
  const wishlisted = isWishlisted(bookId);
  const discount = book.originalPrice ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    toggleWishlist(bookId);
  };

  const handleContact = (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    navigate('/chat');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/book/${bookId}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
          {/* Image */}
          <div className="relative overflow-hidden h-48 bg-slate-100">
            {!imgError ? (
              <img
                src={book.images[0]}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}

            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge condition={book.condition}>{book.condition}</Badge>
              {!book.isAvailable && (
                <span className="px-2 py-0.5 bg-slate-800/80 text-white text-xs rounded-full font-semibold">Sold</span>
              )}
            </div>

            {discount >= 50 && (
              <div className="absolute top-3 right-10 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {discount}% OFF
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200
                ${wishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white text-slate-400 hover:text-red-400 hover:scale-110'}`}
            >
              <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Views */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              <Eye size={11} />
              {book.views}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-primary-700 transition-colors">
              {book.title}
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant="indigo" className="text-xs">{book.subject}</Badge>
              <Badge variant="slate" className="text-xs">{book.semester}</Badge>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
              <MapPin size={11} />
              <span className="truncate">{book.seller.university}</span>
              <span className="flex items-center gap-0.5 ml-auto">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                {book.seller.rating}
              </span>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-900">₹{book.price}</span>
                  {book.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{book.originalPrice}</span>
                  )}
                </div>
              </div>

              <button
                onClick={handleContact}
                className="flex items-center gap-1.5 bg-primary-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-primary-800 transition-colors active:scale-95"
              >
                <MessageCircle size={13} />
                Contact
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
