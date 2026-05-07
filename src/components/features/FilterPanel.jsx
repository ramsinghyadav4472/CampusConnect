import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { subjects, semesters, conditions } from '../../data/mockData';

const FilterPanel = ({ filters, onChange, className = '' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const hasFilters = Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v);

  const FilterSection = ({ title, options, filterKey }) => (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => {
          const active = (filters[filterKey] || []).includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(filterKey, opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                ${active
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  const PriceSection = () => (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Price Range</h4>
      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={2000}
          step={50}
          value={filters.maxPrice || 2000}
          onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-primary-600"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>₹0</span>
          <span className="font-semibold text-primary-700">Up to ₹{filters.maxPrice || 2000}</span>
          <span>₹2000</span>
        </div>
      </div>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-5">
      <FilterSection title="Subject" options={subjects} filterKey="subjects" />
      <hr className="border-slate-100" />
      <FilterSection title="Semester" options={semesters} filterKey="semesters" />
      <hr className="border-slate-100" />
      <FilterSection title="Condition" options={conditions} filterKey="conditions" />
      <hr className="border-slate-100" />
      <PriceSection />
      {hasFilters && (
        <button
          onClick={() => onChange({ subjects: [], semesters: [], conditions: [], maxPrice: 2000 })}
          className="w-full text-xs text-red-500 hover:text-red-700 font-medium py-1.5 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasFilters && <span className="w-5 h-5 bg-primary-700 text-white text-xs rounded-full flex items-center justify-center">
            {Object.values(filters).reduce((acc, v) => acc + (Array.isArray(v) ? v.length : 0), 0)}
          </span>}
        </button>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="relative ml-auto w-80 bg-white h-full shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Filters</h3>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden md:block bg-white rounded-2xl shadow-card p-5 ${className}`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900">Filters</h3>
          {hasFilters && (
            <button
              onClick={() => onChange({ subjects: [], semesters: [], conditions: [], maxPrice: 2000 })}
              className="text-xs text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        <FilterContent />
      </div>
    </>
  );
};

export default FilterPanel;
