import { useSprings, animated } from '@react-spring/web';
import { useRef, useEffect, useState } from 'react';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: {
        opacity: 0,
        transform: `translate3d(0,${direction === 'top' ? -20 : 20}px,0)`,
        filter: 'blur(8px)',
      },
      to: {
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0,0px,0)' : `translate3d(0,${direction === 'top' ? -20 : 20}px,0)`,
        filter: inView ? 'blur(0px)' : 'blur(8px)',
      },
      delay: i * delay,
      config: {
        mass: 1,
        tension: 280,
        friction: 18,
      },
      onRest: () => {
        animatedCount.current += 1;
        if (animatedCount.current === elements.length && onAnimationComplete) {
          onAnimationComplete();
        }
      },
    }))
  );

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity, filter',
            ...props,
          }}
        >
          {elements[index]}
        </animated.span>
      ))}
    </p>
  );
};

export default BlurText;
