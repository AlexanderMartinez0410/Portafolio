import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  typingSpeed?: number;
  erasingSpeed?: number;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
  typingSpeed = 14,
  erasingSpeed = 8,
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState<string>(text);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const targetTextRef = useRef<string>(text);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Si el texto es igual al que ya se muestra, no hacer nada
    if (text === displayedText && !isTyping) {
      targetTextRef.current = text;
      return;
    }

    targetTextRef.current = text;
    setIsTyping(true);

    let currentText = displayedText;
    let mode: 'erasing' | 'typing' = currentText.length > 0 ? 'erasing' : 'typing';
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;

      if (mode === 'erasing') {
        if (delta >= erasingSpeed) {
          lastTime = time;
          // Borrar de a 2-3 caracteres para un ritmo ágil y perceptible
          const step = Math.max(1, Math.ceil(currentText.length / 15));
          currentText = currentText.slice(0, Math.max(0, currentText.length - step));
          setDisplayedText(currentText);

          if (currentText.length === 0) {
            mode = 'typing';
          }
        }
      } else if (mode === 'typing') {
        if (delta >= typingSpeed) {
          lastTime = time;
          const target = targetTextRef.current;
          const step = Math.max(1, Math.ceil((target.length - currentText.length) / 25));
          const nextLength = Math.min(target.length, currentText.length + step);
          currentText = target.slice(0, nextLength);
          setDisplayedText(currentText);

          if (currentText.length >= target.length) {
            setIsTyping(false);
            return; // Fin de la animación
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text]);

  return (
    <Component className={className}>
      <span>{displayedText}</span>
      {showCursor && isTyping && (
        <span className="inline-block ml-0.5 w-[2px] h-[0.9em] align-middle bg-fg animate-pulse font-normal" />
      )}
    </Component>
  );
};
