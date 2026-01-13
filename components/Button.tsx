import React from 'react';
import { ButtonProps } from '../types';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  icon = true
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer select-none overflow-hidden group";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-transparent",
    // Ultra Glossy Glass Variant
    secondary: "backdrop-blur-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50 hover:before:opacity-100",
    ghost: "bg-transparent text-white border border-white/10 hover:border-white/30 hover:bg-white/5",
    glass: "backdrop-blur-md bg-white/10 border border-white/10 text-white hover:bg-white/20"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`}>
      {/* Shine effect animation for secondary */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};