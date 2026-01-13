import React from 'react';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  className?: string;
  icon?: boolean;
}