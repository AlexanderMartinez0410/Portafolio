import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '../context/NavigationContext';

interface AstroStar {
  x: number; // Coordenada X base en porcentaje (0 - 100%)
  y: number; // Coordenada Y base en porcentaje (0 - 100%)
  size: number;
  alpha: number;
  type: 'single' | 'cross-astro' | 'ring-astro'; // Variedad de astros pequeños
  depth: number; // Factor de paralaje (velocidad de cambio según la sección)
}

export const InteractiveBackground: React.FC = () => {
  const { isDark, frenzyCount } = useTheme();
  const { currentNavIndex } = useNavigation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetOffset = useRef<number>(0);
  const currentOffset = useRef<number>(0);
  const starsRef = useRef<AstroStar[]>([]);
  const frenzyCountRef = useRef(frenzyCount);

  useEffect(() => {
    frenzyCountRef.current = frenzyCount;
  }, [frenzyCount]);

  // Actualizar objetivo de desplazamiento al cambiar de sección
  useEffect(() => {
    targetOffset.current = currentNavIndex * 140; // Desplazamiento de 140px por sala/sección
  }, [currentNavIndex]);

  // Inyección de estrellas adicionales en tiempo real cuando sube el nivel de frenesí
  useEffect(() => {
    if (!isDark) return;
    if (frenzyCount > 0) {
      const extraStarsCount = 28;
      const extraStars: AstroStar[] = [];
      for (let i = 0; i < extraStarsCount; i++) {
        const rand = Math.random();
        let type: 'single' | 'cross-astro' | 'ring-astro' = 'single';
        if (rand > 0.75) type = 'cross-astro';
        else if (rand > 0.55) type = 'ring-astro';

        extraStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: type === 'single' ? Math.random() * 1.6 + 0.8 : Math.random() * 2.2 + 1.6,
          alpha: Math.random() * 0.6 + 0.4,
          type,
          depth: Math.random() * 0.8 + 0.2,
        });
      }
      starsRef.current = [...starsRef.current, ...extraStars];
    } else if (frenzyCount === 0 && starsRef.current.length > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        const baseCount = Math.floor((canvas.width * canvas.height) / 12000);
        if (starsRef.current.length > baseCount) {
          starsRef.current = starsRef.current.slice(0, baseCount);
        }
      }
    }
  }, [frenzyCount, isDark]);

  // Renderizado del canvas y ciclo de animación de estrellas
  useEffect(() => {
    // Si no está en modo oscuro, no renderizar nada (modo claro 100% limpio)
    if (!isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initAstros();
    };

    window.addEventListener('resize', handleResize);

    const initAstros = () => {
      const astros: AstroStar[] = [];
      const baseCount = Math.floor((width * height) / 12000);
      const count = Math.floor(baseCount * (1 + frenzyCountRef.current * 0.45));

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let type: 'single' | 'cross-astro' | 'ring-astro' = 'single';
        if (rand > 0.88) type = 'cross-astro'; // Astro brillante con destello en cruz
        else if (rand > 0.78) type = 'ring-astro'; // Astro con tenue halo de anillo

        astros.push({
          x: Math.random() * 100, // Porcentaje X del canvas
          y: Math.random() * 100, // Porcentaje Y del canvas
          size: type === 'single' ? Math.random() * 1.4 + 0.6 : Math.random() * 2 + 1.5,
          alpha: Math.random() * 0.5 + 0.35,
          type,
          depth: Math.random() * 0.75 + 0.25, // Diferente profundidad de movimiento
        });
      }

      starsRef.current = astros;
    };

    if (starsRef.current.length === 0) {
      initAstros();
    }

    // Dibujar un astro en cruz (+)
    const drawCrossAstro = (x: number, y: number, size: number, alpha: number) => {
      ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 0.8})`;
      ctx.lineWidth = 0.8;
      const len = size * 2.5;

      ctx.beginPath();
      ctx.moveTo(x - len, y);
      ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len);
      ctx.lineTo(x, y + len);
      ctx.stroke();

      // Centro brillante
      ctx.beginPath();
      ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    };

    // Dibujar un astro con halo/anillo tenue
    const drawRingAstro = (x: number, y: number, size: number, alpha: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${alpha * 0.35})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
      ctx.fill();
    };

    let isLoopRunning = false;
    let isMounted = true;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
        isLoopRunning = false;
      } else if (isMounted) {
        startAnimationLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isMounted || document.hidden) {
        isLoopRunning = false;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Interpolación suave (Lerp) del desplazamiento entre secciones
      const diff = targetOffset.current - currentOffset.current;
      if (Math.abs(diff) > 0.05) {
        currentOffset.current += diff * 0.08;
      } else {
        currentOffset.current = targetOffset.current;
      }

      const astros = starsRef.current;

      for (let i = 0; i < astros.length; i++) {
        const astro = astros[i];

        // Coordenada base en px
        const baseX = (astro.x / 100) * width;
        // Desplazamiento suave solo al cambiar de página/sección en Y
        let posY = ((astro.y / 100) * height - currentOffset.current * astro.depth) % height;
        if (posY < 0) posY += height;

        if (astro.type === 'cross-astro') {
          drawCrossAstro(baseX, posY, astro.size, astro.alpha);
        } else if (astro.type === 'ring-astro') {
          drawRingAstro(baseX, posY, astro.size, astro.alpha);
        } else {
          ctx.beginPath();
          ctx.arc(baseX, posY, astro.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${astro.alpha})`;
          ctx.fill();
        }
      }

      // Si el desplazamiento se completó y no hay frenesí activo, pausar el loop para 0% uso de CPU
      const hasSettled = Math.abs(targetOffset.current - currentOffset.current) < 0.05;
      if (hasSettled && frenzyCountRef.current === 0) {
        isLoopRunning = false;
        return;
      }

      animFrameId = requestAnimationFrame(render);
    };

    const startAnimationLoop = () => {
      if (!isLoopRunning && !document.hidden) {
        isLoopRunning = true;
        animFrameId = requestAnimationFrame(render);
      }
    };

    // Iniciar loop
    startAnimationLoop();

    // Reanudar loop cuando cambie targetOffset o frenesí
    const observerInterval = setInterval(() => {
      if (Math.abs(targetOffset.current - currentOffset.current) > 0.05 || frenzyCountRef.current > 0) {
        startAnimationLoop();
      }
    }, 100);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(observerInterval);
      cancelAnimationFrame(animFrameId);
    };
  }, [isDark]);

  // En modo claro no renderizamos nada (100% limpio)
  if (!isDark) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    />
  );
};
