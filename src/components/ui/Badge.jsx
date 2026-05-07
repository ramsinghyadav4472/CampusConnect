const variantMap = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  slate: 'bg-slate-100 text-slate-600',
  indigo: 'bg-indigo-100 text-indigo-700',
};

const conditionColors = {
  'Like New': 'green',
  'Good': 'blue',
  'Acceptable': 'amber',
};

const Badge = ({ children, variant = 'slate', condition, dot = false, className = '' }) => {
  const colorVariant = condition ? conditionColors[condition] || 'slate' : variant;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantMap[colorVariant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  );
};

export default Badge;
