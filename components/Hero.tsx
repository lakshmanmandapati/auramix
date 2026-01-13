import React from 'react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6 sm:space-y-8 max-w-xl">
      <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.15] font-medium tracking-tight text-white/95">
        AI-Powered<br />
        Platform for Cancer<br />
        Care Providers.
      </h1>

      <p className="text-gray-400 text-base sm:text-lg font-light leading-relaxed max-w-md">
        Accelerating Research, Enhancing Quality,<br />
        and Streamlining Operations for Oncology Providers.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button variant="primary" className="!px-6 sm:!px-8 !py-3 sm:!py-4 group">
          Request Demo 
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Button>
        <Button variant="secondary" className="!px-6 sm:!px-8 !py-3 sm:!py-4 group">
          Learn More
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Button>
      </div>
    </div>
  );
};
