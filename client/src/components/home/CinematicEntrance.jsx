import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, ChevronDown } from 'lucide-react';

export const CinematicEntrance = ({ onComplete }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const threadPathRef = useRef(null);
  const scrollCueRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if user already saw intro in current session
    const seen = sessionStorage.getItem('dt_intro_viewed');
    if (seen) {
      setIsCompleted(true);
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Keep active until user scrolls or clicks skip
        },
      });

      // 1. Initial State
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(logoRef.current, { scale: 0.85, opacity: 0, filter: 'blur(10px)' });
      gsap.set(titleRef.current, { y: 30, opacity: 0 });
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      gsap.set(scrollCueRef.current, { opacity: 0, y: 10 });

      // Thread Path setup
      if (threadPathRef.current) {
        const length = threadPathRef.current.getTotalLength();
        gsap.set(threadPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });

        // 2. Animate elements sequentially
        tl.to(threadPathRef.current, {
          opacity: 0.8,
          duration: 0.4,
          ease: 'power2.out',
        })
          .to(
            threadPathRef.current,
            {
              strokeDashoffset: 0,
              duration: 2.2,
              ease: 'power2.inOut',
            },
            '-=0.2'
          )
          .to(
            logoRef.current,
            {
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.4,
              ease: 'power3.out',
            },
            '-=1.5'
          )
          .to(
            titleRef.current,
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
            },
            '-=0.8'
          )
          .to(
            subtitleRef.current,
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: 'power2.out',
            },
            '-=0.6'
          )
          .to(scrollCueRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          });
      }
    }, containerRef);

    // Scroll-to-enter handler
    const handleScrollOrWheel = (e) => {
      if (e.deltaY > 20 || e.touches) {
        handleEnter();
      }
    };

    window.addEventListener('wheel', handleScrollOrWheel, { passive: true });
    window.addEventListener('touchmove', handleScrollOrWheel, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('wheel', handleScrollOrWheel);
      window.removeEventListener('touchmove', handleScrollOrWheel);
    };
  }, []);

  const handleEnter = () => {
    if (isCompleted) return;
    sessionStorage.setItem('dt_intro_viewed', 'true');

    gsap.timeline({
      onComplete: () => {
        setIsCompleted(true);
        if (onComplete) onComplete();
      },
    })
      .to(logoRef.current, { scale: 1.15, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0)
      .to([titleRef.current, subtitleRef.current, scrollCueRef.current], { opacity: 0, y: -20, duration: 0.5 }, 0)
      .to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        duration: 0.9,
        ease: 'power3.inOut',
      }, 0.2);
  };

  if (isCompleted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070707] text-white select-none overflow-hidden"
    >
      {/* Subtle luxury ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,rgba(0,0,0,0.95)_75%)] pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleEnter}
        className="absolute top-8 right-8 z-30 flex items-center gap-2 px-4 py-2 border border-luxury-gold/40 text-luxury-gold text-xs uppercase tracking-[0.25em] hover:bg-luxury-gold hover:text-black transition-all duration-300 backdrop-blur-md"
      >
        <span>Skip Intro</span>
      </button>

      {/* Golden Thread SVG Path (Cinematic Needle & Thread unspooling) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          ref={threadPathRef}
          d="M -100,450 C 300,100 450,750 720,450 C 990,150 1140,800 1540,450"
          stroke="url(#threadGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6B0D" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFF4D0" stopOpacity="1" />
            <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8A6B0D" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Brand Emblem & Reveal */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-2xl">
        {/* Crest Logo */}
        <div ref={logoRef} className="relative mb-6">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border border-luxury-gold/30 p-2 shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-sm bg-black/40 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Dazzling Threads Dulha Dulhan House"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
            />
          </div>
          {/* Subtle spinning outer orbit */}
          <div className="absolute -inset-2 rounded-full border border-dashed border-luxury-gold/20 animate-[spin_30s_linear_infinite]" />
        </div>

        {/* Brand Name with Gold Shimmer */}
        <h1
          ref={titleRef}
          className="font-display text-3xl md:text-5xl lg:text-6xl tracking-[0.25em] uppercase font-light text-transparent bg-clip-text bg-gradient-to-r from-[#C5A880] via-[#FDF4D4] to-[#C5A880] mb-3 drop-shadow-lg"
        >
          DAZZLING THREADS
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-serif italic text-base md:text-xl text-[#D4AF37]/80 tracking-widest uppercase mb-10"
        >
          Dulha Dulhan House &bull; Haute Couture &bull; Est. Heritage
        </p>

        {/* Scroll To Enter Indicator */}
        <div
          ref={scrollCueRef}
          onClick={handleEnter}
          className="cursor-pointer flex flex-col items-center gap-2 text-white/50 hover:text-luxury-gold transition-colors duration-300"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans">
            Scroll or Click to Enter
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-luxury-gold/80" />
        </div>
      </div>
    </div>
  );
};
