import React from 'react';
import { authorProfile } from '../data/manifesto';

export const Colophon: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-12 pb-16 border-t border-border font-mono text-[11px] text-fg-subtle space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-fg font-semibold">{currentYear} © {authorProfile.name}</span>
          <span className="text-fg-subtle"> // {authorProfile.tagline}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{authorProfile.location}</span>
          <span>•</span>
          <span>{authorProfile.timezone}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-fg-subtle pt-2 border-t border-border/60">
        <span>TECNOLOGÍAS: REACT + NEXT.JS + TYPESCRIPT + TAILWIND CSS</span>
        <span>DESARROLLO WEB & FULL STACK</span>
      </div>
    </footer>
  );
};
