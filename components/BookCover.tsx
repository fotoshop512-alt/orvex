import React from 'react';

export interface BookCoverStyle {
  id: string;
  bgGradient: string;
  pattern?: string;
  textColor: string;
  accentColor: string;
  decorationType: 'lines' | 'circles' | 'dots' | 'geometric' | 'minimal' | 'classic' | 'modern' | 'vintage';
}

// Pre-defined cover styles
export const COVER_STYLES: Record<string, BookCoverStyle> = {
  ocean: {
    id: 'ocean',
    bgGradient: 'from-cyan-900 via-blue-800 to-indigo-900',
    textColor: 'text-cyan-100',
    accentColor: 'cyan-400',
    decorationType: 'lines'
  },
  sunset: {
    id: 'sunset',
    bgGradient: 'from-orange-600 via-rose-600 to-purple-800',
    textColor: 'text-orange-100',
    accentColor: 'orange-300',
    decorationType: 'circles'
  },
  forest: {
    id: 'forest',
    bgGradient: 'from-emerald-900 via-green-800 to-teal-900',
    textColor: 'text-emerald-100',
    accentColor: 'emerald-400',
    decorationType: 'dots'
  },
  midnight: {
    id: 'midnight',
    bgGradient: 'from-slate-900 via-indigo-950 to-black',
    textColor: 'text-slate-200',
    accentColor: 'indigo-400',
    decorationType: 'geometric'
  },
  golden: {
    id: 'golden',
    bgGradient: 'from-amber-700 via-yellow-600 to-orange-700',
    textColor: 'text-amber-100',
    accentColor: 'yellow-300',
    decorationType: 'classic'
  },
  crimson: {
    id: 'crimson',
    bgGradient: 'from-red-900 via-rose-800 to-pink-900',
    textColor: 'text-rose-100',
    accentColor: 'rose-400',
    decorationType: 'minimal'
  },
  arctic: {
    id: 'arctic',
    bgGradient: 'from-sky-200 via-blue-300 to-indigo-400',
    textColor: 'text-sky-900',
    accentColor: 'sky-600',
    decorationType: 'modern'
  },
  mystic: {
    id: 'mystic',
    bgGradient: 'from-purple-900 via-violet-800 to-fuchsia-900',
    textColor: 'text-purple-100',
    accentColor: 'violet-400',
    decorationType: 'circles'
  },
  earth: {
    id: 'earth',
    bgGradient: 'from-stone-800 via-amber-900 to-stone-900',
    textColor: 'text-stone-200',
    accentColor: 'amber-500',
    decorationType: 'vintage'
  },
  neon: {
    id: 'neon',
    bgGradient: 'from-gray-900 via-slate-900 to-zinc-900',
    textColor: 'text-cyan-400',
    accentColor: 'pink-500',
    decorationType: 'modern'
  },
  royal: {
    id: 'royal',
    bgGradient: 'from-indigo-900 via-purple-900 to-blue-900',
    textColor: 'text-indigo-100',
    accentColor: 'amber-400',
    decorationType: 'classic'
  },
  autumn: {
    id: 'autumn',
    bgGradient: 'from-orange-800 via-red-700 to-amber-800',
    textColor: 'text-orange-100',
    accentColor: 'yellow-400',
    decorationType: 'dots'
  },
  spring: {
    id: 'spring',
    bgGradient: 'from-pink-400 via-rose-400 to-fuchsia-500',
    textColor: 'text-white',
    accentColor: 'pink-200',
    decorationType: 'minimal'
  },
  storm: {
    id: 'storm',
    bgGradient: 'from-slate-700 via-gray-800 to-zinc-900',
    textColor: 'text-slate-200',
    accentColor: 'blue-400',
    decorationType: 'lines'
  },
  jade: {
    id: 'jade',
    bgGradient: 'from-teal-800 via-emerald-700 to-cyan-800',
    textColor: 'text-teal-100',
    accentColor: 'teal-300',
    decorationType: 'geometric'
  }
};

interface BookCoverProps {
  title: string;
  author: string;
  style: BookCoverStyle;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  image?: string;
}

const BookCover: React.FC<BookCoverProps> = ({ title, author, style, size = 'medium', className = '', image }) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    small: 'w-16 h-24 text-[8px]',
    medium: 'w-20 h-28 text-[10px]',
    large: 'w-32 h-44 text-xs'
  };

  const renderDecoration = () => {
    switch (style.decorationType) {
      case 'lines':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute h-px bg-${style.accentColor}`}
                style={{
                  top: `${15 + i * 10}%`,
                  left: '10%',
                  right: '10%',
                  transform: `rotate(${-5 + i * 2}deg)`
                }}
              />
            ))}
          </div>
        );
      case 'circles':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-15">
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full border-2 border-${style.accentColor}`} />
            <div className={`absolute -bottom-8 -left-8 w-24 h-24 rounded-full border border-${style.accentColor}`} />
            <div className={`absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-${style.accentColor}/50`} />
          </div>
        );
      case 'dots':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: '12px 12px'
            }} />
          </div>
        );
      case 'geometric':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-15">
            <div className={`absolute top-4 right-4 w-12 h-12 border border-${style.accentColor} rotate-45`} />
            <div className={`absolute bottom-4 left-4 w-8 h-8 border border-${style.accentColor}`} />
            <div className={`absolute top-1/2 left-2 w-6 h-6 border border-${style.accentColor} rotate-12`} />
          </div>
        );
      case 'minimal':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent`} />
            <div className={`absolute top-4 left-4 right-4 h-px bg-${style.accentColor}/30`} />
            <div className={`absolute bottom-4 left-4 right-4 h-px bg-${style.accentColor}/30`} />
          </div>
        );
      case 'classic':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className={`absolute inset-2 border border-${style.accentColor}/50 rounded-sm`} />
            <div className={`absolute inset-4 border border-${style.accentColor}/30 rounded-sm`} />
            <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-${style.accentColor}/40`} />
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-${style.accentColor}/40`} />
          </div>
        );
      case 'modern':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-25">
            <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent`} />
            <div className={`absolute bottom-0 right-0 w-2/3 h-px bg-${style.accentColor}`} />
            <div className={`absolute top-1/4 left-0 w-1 h-1/2 bg-${style.accentColor}`} />
          </div>
        );
      case 'vintage':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className={`absolute inset-3 border-2 border-${style.accentColor}/40`} />
            <div className={`absolute top-6 left-3 right-3 h-px bg-${style.accentColor}/60`} />
            <div className={`absolute bottom-6 left-3 right-3 h-px bg-${style.accentColor}/60`} />
            <div className="absolute top-3 bottom-3 left-6 w-px bg-current opacity-20" />
            <div className="absolute top-3 bottom-3 right-6 w-px bg-current opacity-20" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${style.bgGradient} rounded-lg shadow-xl overflow-hidden flex flex-col ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '4px 4px 12px rgba(0,0,0,0.4), inset -1px -1px 0 rgba(255,255,255,0.1), inset 1px 1px 0 rgba(255,255,255,0.05)'
      }}
    >
      {/* Background Image if present and loaded */}
      {image && !imageError && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.bgGradient} opacity-60 mix-blend-multiply`} />
        </div>
      )}

      {/* Book spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />

      {/* Decorative elements - show if NO image OR if image FAILED */}
      {(!image || imageError) && renderDecoration()}

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-between p-2 z-10">
        {/* Title area */}
        <div className="flex-1 flex items-center justify-center">
          <h3 className={`${style.textColor} font-bold text-center leading-tight line-clamp-3 drop-shadow-md`}
            style={{
              fontSize: size === 'large' ? '0.75rem' : size === 'medium' ? '0.6rem' : '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {title}
          </h3>
        </div>

        {/* Author */}
        <p className={`${style.textColor} opacity-90 text-center truncate mt-1 drop-shadow-sm font-medium`}
          style={{ fontSize: size === 'large' ? '0.6rem' : '0.45rem' }}
        >
          {author}
        </p>
      </div>

      {/* Glossy effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20" />
    </div>
  );
};

export default BookCover;

