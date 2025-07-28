import React, { useEffect, useRef, useState } from 'react';

const ParallaxSection = ({ children, className = '', speed = 0.5, background = false }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  if (background) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${offset}px)`,
            willChange: 'transform'
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translateY(${offset}px)`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection; 