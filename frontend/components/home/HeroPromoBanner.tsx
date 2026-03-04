'use client';

import Image from 'next/image';

export function HeroPromoBanner() {
  return (
    <div
      className="flex-1 min-w-0 min-h-[280px] sm:min-h-[360px] lg:h-[469px] rounded-[10px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(120deg, #575758 0%, #bfb8b8 100%)',
        opacity: 0.95,
      }}
    >
      <Image
        src="/assets/logo.png"
        alt=""
        width={396}
        height={309}
        className="absolute -top-1/2 -left-1/3 -right-1/3 bottom-1/2 translate-x-1/2 translate-y-1/2 w-[496px] h-[409px] -rotate-45 object-cover blur-[12px] opacity-[0.6]"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6">
        <h2 className="hero-title-win-global text-2xl sm:text-[2.5rem] lg:text-[3.5rem] font-extrabold tracking-tight text-center uppercase">
          WIN GLOBAL
        </h2>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-3 sm:p-3 lg:p-4 w-full max-w-[520px] rounded-2xl bg-[#4D4D4D]/35 border border-white/35 shadow-2xl shadow-black/600">
          <p className="text-center text-lg sm:text-xl lg:text-3xl font-semibold leading-relaxed tracking-tight">
            <span className="block">Experience fast payouts</span>
            <span className="block font-extrabold text-[#4cc360]">and premium online</span>
            <span className="block">betting.</span>
          </p>
          
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-2">
          <button
            type="button"
            className="min-h-[44px] sm:min-h-[52px] px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#14191A] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#14191A]/25 hover:bg-[#5dd471] hover:shadow-[#14191A]/35 active:scale-[0.98] transition-all cursor-pointer"
          >
            Start Playing
          </button>
          <button
            type="button"
            className="min-h-[44px] sm:min-h-[52px] px-5 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-[#14191A] font-bold text-sm sm:text-base text-[#14191A] hover:border-[#14191A]/80 active:scale-[0.98] transition-all cursor-pointer"
          >
            View Games
          </button>
        </div>
      </div>
    </div>
  );
}
