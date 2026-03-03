'use client';

import Image from 'next/image';

export type HeroSlide = {
  team1: string;
  team2: string;
  logo1: string;
  logo2: string;
  league: string;
  player1: string;
  player2: string;
  alt1: string;
  alt2: string;
  background?: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
};

export function HeroCarousel({ slides, currentIndex, onSlideChange }: HeroCarouselProps) {
  return (
    <div className="flex-1 min-w-0 min-h-[280px] sm:min-h-[360px] lg:h-[469px] rounded-[10px] overflow-hidden relative bg-[#1a1a1a]">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-row gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSlideChange(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 cursor-pointer ${
              i === currentIndex ? 'bg-[#4cc360] scale-110' : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-[transform] duration-500 ease-out"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${(100 / slides.length) * currentIndex}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative shrink-0 h-full w-full overflow-hidden"
              style={{
                width: `${100 / slides.length}%`,
                minWidth: `${100 / slides.length}%`,
              }}
            >
              <Image
                src={slide.background ?? '/assets/hero-stadium-bg.png'}
                alt=""
                fill
                className={`object-cover opacity-50 ${slide.background ? '' : 'grayscale'}`}
              />
              <Image
                src={slide.player1}
                alt={slide.alt1}
                width={840}
                height={1000}
                sizes="(max-width: 640px) 38vw, (max-width: 1024px) 42vw, 420px"
                quality={95}
                className={`absolute bottom-0 object-contain object-bottom
                  left-0 sm:-left-8 md:-left-16
                  lg:-left-25
                  w-[38vw] max-w-[180px] sm:w-[42vw] sm:max-w-[220px] md:w-[380px]
                  lg:w-[420px] lg:max-w-[54vw]
                  h-[min(85%,420px)] sm:h-[min(90%,460px)] max-h-[380px] sm:max-h-[420px]
                  lg:h-[min(92%,500px)] lg:max-h-[440px]
                  ${index === 2 ? 'z-0' : 'z-10'}`}
              />
              <Image
                src={slide.player2}
                alt={slide.alt2}
                width={680}
                height={880}
                sizes="(max-width: 640px) 38vw, (max-width: 1024px) 42vw, 340px"
                quality={95}
                className={`absolute bottom-0 object-contain object-bottom
                  right-0 sm:right-4 md:left-[42%] md:right-auto
                  lg:left-10 lg:right-auto
                  w-[38vw] max-w-[180px] sm:w-[42vw] sm:max-w-[220px] md:w-[320px]
                  lg:w-[340px] lg:max-w-[44vw]
                  h-[min(82%,400px)] sm:h-[min(88%,420px)] max-h-[360px] sm:max-h-[400px]
                  lg:h-[min(90%,440px)] lg:max-h-[400px]
                  ${index === 2 ? 'z-10' : 'z-0'}`}
              />
              <div
                className="absolute bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 lg:-translate-x-[calc(25%-3rem)] flex flex-col items-center justify-end gap-1 sm:gap-1.5 lg:gap-2 text-center w-[92%] sm:w-full max-w-md px-2 sm:px-4 lg:px-4 pb-0"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-8">
                  <Image
                    src={slide.logo1}
                    alt={slide.team1}
                    width={88}
                    height={73}
                    className="shrink-0 object-contain w-10 h-8 sm:w-14 sm:h-11 md:w-[72px] md:h-[60px] lg:w-[88px] lg:h-[73px]"
                  />
                  <Image
                    src={slide.logo2}
                    alt={slide.team2}
                    width={96}
                    height={67}
                    className="shrink-0 object-contain w-10 h-8 sm:w-16 sm:h-11 md:w-[80px] md:h-[56px] lg:w-[96px] lg:h-[67px]"
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5 sm:gap-2 lg:gap-2">
                  <span className="text-intrepid-white-outline text-sm sm:text-xl md:text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight text-balance uppercase">
                    {slide.team1}
                  </span>
                  <span className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-bold text-[#4cc360] tracking-tight">
                    VS
                  </span>
                  <span className="text-intrepid-white-outline text-sm sm:text-xl md:text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight text-balance uppercase">
                    {slide.team2}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-0.5 sm:mt-1 lg:mt-1 px-4 sm:px-8 py-1.5 sm:py-2 rounded-[10px] bg-transparent border border-white text-white text-xs sm:text-base font-bold tracking-wide hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                >
                  BET NOW
                </button>
                <div className="text-[10px] sm:text-base lg:text-lg text-white tracking-wide uppercase">
                  {slide.league}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
