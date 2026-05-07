const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
};

const colorMap = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'];

const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getColor = (name = '') => {
  const idx = name.charCodeAt(0) % colorMap.length;
  return colorMap[idx];
};

const Avatar = ({ name, src, size = 'md', className = '', online = false }) => {
  const initials = getInitials(name);
  const bg = getColor(name);

  return (
    <div className={`relative inline-flex flex-shrink-0 rounded-full ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div className={`${sizeMap[size]} ${bg} rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white`}>
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

export default Avatar;
