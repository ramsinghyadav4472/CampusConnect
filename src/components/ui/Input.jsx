import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = '',
  inputClassName = '',
  required,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {IconLeft && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconLeft size={18} />
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border text-slate-900 text-sm placeholder-slate-400
            outline-none transition-all duration-200 bg-white
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
            }
            ${IconLeft ? 'pl-10' : ''}
            ${IconRight ? 'pr-10' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {IconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconRight size={18} />
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, hint, required, className = '', ...props }, ref) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      className={`
        w-full px-4 py-3 rounded-xl border text-slate-900 text-sm placeholder-slate-400
        outline-none transition-all duration-200 bg-white resize-none
        ${error
          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
          : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
        }
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
));

Textarea.displayName = 'Textarea';

export default Input;
