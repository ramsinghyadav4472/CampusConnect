import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

const Dropdown = ({ label, options = [], value, onChange, placeholder = 'Select...', searchable = false, error, required, loading = false, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Limit filtered options to top 100 for performance when the array is huge
  const filtered = searchable
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())).slice(0, 100)
    : options;

  const selected = typeof value === 'string' ? value : '';

  return (
    <div ref={ref} className={`relative flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm bg-white
          outline-none transition-all duration-200 text-left
          ${error ? 'border-red-400' : open ? 'border-primary-500 ring-2 ring-primary-100' : 'border-slate-200 hover:border-slate-300'}
          ${!selected ? 'text-slate-400' : 'text-slate-900'}
          ${loading ? 'opacity-70 cursor-wait bg-slate-50' : ''}
        `}
      >
        <span className="truncate">{loading ? 'Loading...' : (selected || placeholder)}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 rounded-lg outline-none border border-slate-200 focus:border-primary-400"
                />
              </div>
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400 text-center">No options found</p>
            ) : (
              filtered.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { onChange(option); setOpen(false); setSearch(''); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-primary-50
                    ${selected === option ? 'text-primary-700 bg-primary-50 font-medium' : 'text-slate-700'}`}
                >
                  <span className="truncate">{option}</span>
                  {selected === option && <Check size={14} className="text-primary-600 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Dropdown;
