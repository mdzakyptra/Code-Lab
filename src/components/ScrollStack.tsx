'use client';

import { useLayoutEffect, useRef, useCallback, ReactNode, useState, useEffect } from 'react';
import Lenis from 'lenis';

interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack = ({
  children,
  className = '',
  useWindowScroll = true,
}: ScrollStackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [numCards, setNumCards] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setNumCards(containerRef.current.querySelectorAll('.scroll-stack-card').length);
    }
  }, [children]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Progress goes from 0 (stacked) to (numCards - 1) (fully spread out)
    // We want the spreading to happen as we scroll through the container.
    // Let's make the container slightly taller so we have room to scroll.
    // The container height is already natural (flex column).
    // We'll map the scrolling through the container to 0 -> numCards - 1
    
    // startY: when the top of the container is near the bottom of the screen
    const startY = windowHeight * 0.9; 
    
    // We want the last card to finish opening when it is in the middle of the screen.
    // The container has 30rem (~480px) padding at the bottom.
    // To ensure the last card opens in the center of the screen, we adjust endY.
    const endY = windowHeight * 0.6 - rect.height + 600; 
    
    const currentY = rect.top;
    
    // p = 0 at startY, p = 1 at endY
    let p = 1 - (currentY - endY) / (startY - endY);
    p = Math.max(0, Math.min(1, p));
    
    // map p to 0 -> N - 1
    const totalProgress = p * (numCards - 1);
    
    setProgress(totalProgress);
  }, [numCards]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      try {
        const lenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });
        lenis.on('scroll', handleScroll);
        const raf = (time: number) => {
          lenis.raf(time);
          animationFrameRef.current = requestAnimationFrame(raf);
        };
        animationFrameRef.current = requestAnimationFrame(raf);
        lenisRef.current = lenis;
      } catch {}
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    setupLenis();
    handleScroll();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      if (useWindowScroll) window.removeEventListener('scroll', handleScroll);
    };
  }, [setupLenis, handleScroll, useWindowScroll]);

  // Apply parallax spread transforms (Separating DOWNWARDS)
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const cards = Array.from(containerRef.current.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    
    cards.forEach((card, i) => {
      card.style.willChange = 'transform';
      card.style.position = 'relative'; // Normal document flow! No sticky.
      
      if (i === 0) {
        card.style.transform = `translateY(0px)`;
        card.style.zIndex = `${cards.length}`;
        return;
      }

      // Calculate how far this card should be shifted UP
      // If progress is 0, card 1 has shift=1, card 2 has shift=2.
      // If progress is 1, card 1 has shift=0 (in place), card 2 has shift=1 (tucked under card 1).
      const shift = Math.max(0, i - progress);
      
      const translateYPercent = -100 * shift;
      const translateYGapPx = -160 * shift; // 160px is roughly 10rem gap
      
      // Rotations that straighten out as it spreads
      const maxRot = (i % 2 === 0 ? -1 : 1) * 3 * i;
      // Only rotate the cards that are still tucked
      const rot = maxRot * (shift / i || 0);

      card.style.transform = `translateY(calc(${translateYPercent}% + ${translateYGapPx}px)) rotate(${rot}deg)`;
      
      // The cards behind should have lower z-index
      card.style.zIndex = `${cards.length - i}`;
      
      // Shadow for depth when stacked
      card.style.boxShadow = `0 ${15 * (shift/i || 0)}px ${30 * (shift/i || 0)}px rgba(0,0,0,0.25)`;
    });
  }, [progress]);

  return (
    <div 
      className={`scroll-stack-container ${className}`.trim()} 
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10rem', // Made the gap much larger
        padding: '1rem 1rem 30rem', // Massive padding at bottom to make section long
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollStack;
