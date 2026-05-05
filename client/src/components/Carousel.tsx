import React, { useState, useEffect, useCallback } from "react";
import { useCarousel } from "../hooks/useCarousel";
import type { CarouselProps } from "../utils/types";
import { ChevronLeftIcon, ChevronRightIcon } from "./shared/Icons";
import DataFetchError from "./shared/DataFetchError";
import FallbackImage from '../assets/News_Placeholder.webp';

const AUTO_PLAY_DELAY = 6000;

const Carousel: React.FC<CarouselProps> = ({ country, onSummarize }) => {
  const { articles, isLoading, error }  = useCarousel(country, 30);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const fallbackimg = FallbackImage;
  const dotsContainerRef = React.useRef<HTMLDivElement>(null);

  // Reset slide when country changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [country]);

  // Keep active dot fully in center view
  useEffect(() => {
    if (dotsContainerRef.current) {
      const container = dotsContainerRef.current;
      const activeDot = container.children[currentIndex] as HTMLElement | undefined;
      if (activeDot) {
        const scrollTarget = activeDot.offsetLeft - container.clientWidth / 2 + activeDot.clientWidth / 2;
        container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (!articles.length) return;
    setCurrentIndex((i) => (i + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    if (!articles.length) return;
    setCurrentIndex((i) => (i - 1 + articles.length) % articles.length);
  }, [articles.length]);

  /*  Auto play */
 useEffect(() => {
  if (!isPaused && articles.length) {
    const timer = setInterval(nextSlide, AUTO_PLAY_DELAY);
    return () => clearInterval(timer);
  }
}, [articles.length, isPaused, nextSlide]);

  /*  Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  /*  Touch swipe */
  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStartX(e.touches[0].clientX);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStartX(null);
  };

  /*  Loading Skeleton */
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="h-112 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <DataFetchError message={error} />
      </section>
    );
  }

  if (!articles.length) return null;

  return (
    <section
      className="mb-12 relative min-h-[50vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* SLIDES */}
      <div className="relative h-112 sm:h-120 lg:h-140 overflow-hidden rounded-xl shadow-lg">
        {articles.map((article, index) => (
          <div
            key={`${article.id}-${index}`}
            className={`
              absolute inset-0 transition-all duration-700 ease-in-out
              ${
                index === currentIndex
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105"
              }
              `}
              title={article.title}
            >
           <div className="absolute inset-0 overflow-hidden">
                <img
                  src={article.imageUrl ?? fallbackimg}
                  alt={article.title}
                  className={`w-full h-full will-change-transformtransition-transform duration-6000 ease-in 
                  `}
                />
              </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            {/* Video Badge */}
            {article.isVideo && (
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2 bg-black/40 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium border border-white/20 shadow-lg">
                <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500"></span>
                </div>
                <span className="tracking-wide">Watch Video</span>
              </div>
            )}

            {/* CONTENT */}
            <div className="absolute bottom-6 left-0 p-6 lg:p-10 text-white max-w-4xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-violet-600 rounded-full shadow-lg">
                Discover
              </span>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                {article.title}
              </h2>

              <p className="text-sm opacity-80 mb-5">
                {article.source}
              </p>

              <div className="flex gap-4">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={article.title}
                  className="flex items-center gap-2 bg-white text-[#120C1F] hover:bg-slate-100 px-4 py-2 rounded-md font-bold text-sm shadow-xl transition-transform active:scale-95"
                >
                  Read More
                </a>

                <button
                  onClick={() => onSummarize(article)}
                  title="Summarize this Feed"
                  className="relative group p-[1.5px] rounded-md overflow-hidden active:scale-95 transition-transform shadow-lg cursor-pointer flex items-center justify-center shrink-0"
                >
                  {/* Continuous AI Spinning Glow */}
                  <div 
                    className="absolute w-[300%] h-[300%] animate-spin opacity-90" 
                    style={{ 
                       animationDuration: '4s',
                       background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, #F59E0B 85%, #8B5CF6 100%)' 
                    }} 
                  />
                  {/* Premium Frosted Glass Core */}
                  <div className="relative flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/5 text-white hover:bg-black/60 transition-colors font-semibold rounded-[4.5px] text-sm w-full h-full z-10">
                    Summarize ✨
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ARROWS */}
      <CarouselButton onClick={prevSlide} position="left">
        <ChevronLeftIcon className="w-6 h-6" />
      </CarouselButton>

      <CarouselButton onClick={nextSlide} position="right">
        <ChevronRightIcon className="w-6 h-6" />
      </CarouselButton>

      {/* DOT INDICATORS */}
      <div 
        ref={dotsContainerRef}
        className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-oled-surface/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(2,1,10,0.6)] rounded-full z-20 max-w-[65vw] sm:max-w-[40vw] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {articles.map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={` relative h-1.5 sm:h-2 shrink-0 rounded-full overflow-hidden transition-all duration-300 ease-out
                ${isActive
                  ? "w-6 sm:w-10 bg-white/20"
                  : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/60"
                }
              `}
            >
              {isActive && (
                <div
                  className="absolute inset-0 gradient-primary rounded-full origin-left"
                  style={{
                    animation: isPaused
                      ? "none"
                      : `progress ${AUTO_PLAY_DELAY}ms linear`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

const CarouselButton = ({
  onClick,
  position,
  children,
}: {
  onClick: () => void;
  position: "left" | "right";
  children: React.ReactNode;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`
      absolute top-1/2 -translate-y-1/2 z-20
      p-3 rounded-full
      bg-oled-surface/50 backdrop-blur-xl border border-white/10 text-white
      hover:bg-oled-border/80 hover:border-violet-500/50 hover:text-fuchsia-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]
      hover:scale-110 active:scale-95
      transition-all duration-300
      hidden sm:flex items-center justify-center
      ${position === "left" ? "left-4" : "right-4"}
    `}
  >
    {children}
  </button>
);

export default Carousel;
