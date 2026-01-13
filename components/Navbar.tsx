import React from 'react';
import { Button } from './Button';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', href: '#', active: true },
  { label: 'Solutions', href: '#' },
  { label: 'How it Works', href: '#' },
  { label: 'Insights', href: '#' },
];

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-16 md:h-20 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-between px-3 sm:px-5 md:px-8 transition-all hover:bg-white/[0.04]">
      
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-sm tracking-[0.2em] font-semibold text-gray-200">AURAMIX</span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center space-x-10">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`relative text-sm font-medium transition-colors duration-300 ${
              item.active ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
            {item.active && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_8px_2px_rgba(168,85,247,0.6)]"></span>
            )}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div>
        <Button variant="secondary" className="px-6 py-2.5 text-xs group">
          Free Demo 
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Button>
      </div>
    </nav>
  );
};
