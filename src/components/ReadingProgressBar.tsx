import React, { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ containerRef }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const target = containerRef?.current || document.querySelector('div.overflow-y-auto');
    if (!target) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = target as HTMLElement;
      const total = scrollHeight - clientHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const current = Math.min(100, Math.max(0, (scrollTop / total) * 100));
      setProgress(current);
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => target.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  return (
    <div className="fixed top-0 left-0 lg:left-[22%] xl:left-[24%] right-0 h-[2px] z-50 bg-transparent pointer-events-none">
      <div
        className="h-full bg-fg transition-all duration-75 ease-out opacity-80"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
