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
  const displayedRef = useRef<string>(text);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (text === displayedRef.current) {
      return;
    }

    const targetText = text;
    let currentText = displayedRef.current;
    let mode: 'erasing' | 'typing' = currentText.length > 0 ? 'erasing' : 'typing';
    let lastTime = performance.now();
    let started = false;

    const animate = (time: number) => {
      if (!started) {
        setIsTyping(true);
        started = true;
      }
      const delta = time - lastTime;

      if (mode === 'erasing') {
        if (delta >= erasingSpeed) {
          lastTime = time;
          const step = Math.max(1, Math.ceil(currentText.length / 15));
          currentText = currentText.slice(0, Math.max(0, currentText.length - step));
          displayedRef.current = currentText;
          setDisplayedText(currentText);

          if (currentText.length === 0) {
            mode = 'typing';
          }
        }
      } else if (mode === 'typing') {
        if (delta >= typingSpeed) {
          lastTime = time;
          const step = Math.max(1, Math.ceil((targetText.length - currentText.length) / 25));
          const nextLength = Math.min(targetText.length, currentText.length + step);
          currentText = targetText.slice(0, nextLength);
          displayedRef.current = currentText;
          setDisplayedText(currentText);

          if (currentText.length >= targetText.length) {
            setIsTyping(false);
            return;
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
  }, [text, typingSpeed, erasingSpeed]);

  return (
    <Component className={className}>
      <span>{displayedText}</span>
      {showCursor && isTyping && (
        <span className="inline-block ml-0.5 w-[2px] h-[0.9em] align-middle bg-fg animate-pulse font-normal" />
      )}
    </Component>
  );
};
