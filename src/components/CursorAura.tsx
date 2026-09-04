import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const CursorAura: React.FC = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);

  // Coordenadas objetivo (mouse real) y coordenadas interpoladas (fluido suave)
  const targetPos = useRef<{ x: number; y: number }>({ x: -200, y: -200 });
  const currentPos = useRef<{ x: number; y: number }>({ x: -200, y: -200 });
  const auraRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Si es un dispositivo táctil (móvil o tablet sin cursor fino), no montar la animación
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Bucle de animación fluida con interpolación (Lerp)
    const animate = () => {
      const ease = 0.14; // Factor de inercia suave
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      if (auraRef.current) {
        const size = isClicking ? 230 : 280;
        auraRef.current.style.transform = `translate3d(${currentPos.current.x - size / 2}px, ${currentPos.current.y - size / 2}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isVisible, isClicking]);

  return (
    <div
      ref={auraRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-[280px] h-[280px] rounded-full z-40 transition-opacity duration-300 will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        // En Modo Oscuro: haz de luz suave / linterna nocturna
        // En Modo Claro: silueta de tinta aguada / mancha sutil sobre papel
        background: isDark
          ? 'radial-gradient(circle, rgba(255, 255, 255, 0.085) 0%, rgba(255, 255, 255, 0.025) 45%, transparent 70%)'
          : 'radial-gradient(circle, rgba(20, 20, 20, 0.055) 0%, rgba(30, 25, 20, 0.02) 48%, transparent 72%)',
        filter: isDark ? 'blur(10px)' : 'blur(8px)',
      }}
    />
  );
};
