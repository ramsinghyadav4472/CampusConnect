import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 hover:shadow-lg active:scale-95 disabled:opacity-50',
  secondary: 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-400 active:scale-95',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-95',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg active:scale-95',
  outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-95',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'lg' || size === 'xl' ? 20 : 16} />
      ) : null}
      {children}
      {!loading && IconRight && <IconRight size={16} />}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
