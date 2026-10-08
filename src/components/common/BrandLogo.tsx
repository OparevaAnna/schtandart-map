import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-9 px-3 py-1.5',
    md: 'h-12 px-4 py-2',
    lg: 'h-16 px-6 py-3',
  };

  return (
    <div
      className={`inline-flex items-center justify-center bg-slate-950 text-white rounded-lg shadow-sm border border-slate-800/80 transition-all ${sizeClasses[size]} ${className}`}
      title="SCHTANDART — гарантия качества"
    >
      <div className="flex flex-col items-center justify-center leading-none select-none">
        <div className="flex items-center gap-1.5 font-black tracking-[0.2em] uppercase text-white font-sans text-sm md:text-base">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-slate-950 rounded text-xs font-black mr-0.5">
            S
          </span>
          <span>SCHTANDART</span>
        </div>
        <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-slate-300 font-normal uppercase mt-0.5">
          гарантия качества
        </span>
      </div>
    </div>
  );
};
