import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, BookOpen, Grid3X3, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { booksService } from '../services/books';
import BookCard from '../components/features/BookCard';
import FilterPanel from '../components/features/FilterPanel';
import { BookCardSkeleton } from '../components/ui/Skeleton';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const EmptyState = ({ query }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-5">
      <BookOpen size={40} className="text-slate-300" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">No books found</h3>
    <p className="text-slate-500 max-w-xs">
      {query ? `No results for "${query}". Try different keywords or remove filters.` : 'No books available at the moment. Check back later!'}
    </p>
  </div>
);

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({ subjects: [], semesters: [], conditions: [], maxPrice: 2000 });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const fetchedBooks = await booksService.getAll({ search, ...filters, sortBy });
        
        // Since the backend returns empty currently, we just set the empty array
        // Once backend is hooked up, it will return the filtered books
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [search, filters, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
  };

  const activeFilterCount = filters.subjects.length + filters.semesters.length + filters.conditions.length + (filters.maxPrice < 2000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Browse Books</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {loading ? 'Loading...' : `${books.length} book${books.length !== 1 ? 's' : ''} available`}
                {search && <span className="ml-1">for "<strong>{search}</strong>"</span>}
              </p>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, subject..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); setSearchParams({}); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium">
                    Clear
                  </button>
                )}
              </div>
              <button type="submit" className="px-4 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar filter */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} onChange={setFilters} />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="md:hidden">
                <FilterPanel filters={filters} onChange={setFilters} />
              </div>

              <div className="flex-1" />

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-primary-400 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary-700 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-primary-700 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.subjects.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {s}
                    <button onClick={() => setFilters(f => ({ ...f, subjects: f.subjects.filter(x => x !== s) }))} className="hover:text-primary-900">×</button>
                  </span>
                ))}
                {filters.semesters.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {s}
                    <button onClick={() => setFilters(f => ({ ...f, semesters: f.semesters.filter(x => x !== s) }))} className="hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Books grid */}
            {loading ? (
              <div className={`grid gap-5 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}
              </div>
            ) : books.length === 0 ? (
              <EmptyState query={search} />
            ) : (
              <div className={`grid gap-5 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl'}`}>
                {books.map((book, i) => <BookCard key={book._id || book.id || i} book={book} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
