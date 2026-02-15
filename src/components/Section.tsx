import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  icon?: React.ReactNode; 
  children: ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, children, className = "" }) => {
  return (
    <section className={`break-inside-avoid ${className}`}>
      <div className="flex items-center mb-6">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-dark shrink-0">
          {title}
        </h2>
        <div className="flex-grow h-px bg-gray-800 ml-4 opacity-20"></div>
      </div>
      <div>
        {children}
      </div>
    </section>
  );
};