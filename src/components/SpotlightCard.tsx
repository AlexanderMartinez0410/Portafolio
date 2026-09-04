import React, { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Resplandor radial interactivo que sigue al mouse */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 -z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(120, 120, 120, 0.08), transparent 70%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
