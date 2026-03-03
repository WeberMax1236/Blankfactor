'use client';

import Image from 'next/image';

export type LiveMatch = {
  team1: string;
  team2: string;
  logo1: string;
  logo2: string;
  date: string;
  time: string;
  odds: { '1': number; draw: number; '2': number };
};

type MatchCardProps = {
  match: LiveMatch;
  index?: number;
};

export function MatchCard({ match, index = 0 }: MatchCardProps) {
  return (
    <div
      className="shrink-0 w-[min(100%,320px)] sm:w-[359px] min-h-[200px] bg-[#292d2e] rounded-[10px] p-4 sm:p-5 flex flex-col overflow-visible cursor-pointer animate-live-sports-card-in transition-transform duration-200 hover:scale-[1.02]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-1.5 mb-1 shrink-0">
        <span className="font-bold text-white text-xs">Soccer</span>
        <span className="w-1.5 h-1.5 bg-white rounded-full" />
        <span className="font-bold text-white text-xs">Premier League</span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-3 shrink-0">
        <span>{match.date}</span>
        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
        <span className="text-white">{match.time}</span>
      </div>
      <div className="grid grid-cols-3 flex-1 gap-x-4 gap-y-3 min-h-0 auto-rows-auto">
        <div className="flex justify-center items-center min-h-[48px]">
          <Image
            src={match.logo1}
            alt={match.team1}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[48px]">
          <span className="font-bold text-white text-xl leading-tight">0 : 0</span>
          <span className="text-white/50 text-[11px] leading-tight">Not started</span>
        </div>
        <div className="flex justify-center items-center min-h-[48px]">
          <Image
            src={match.logo2}
            alt={match.team2}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-center min-h-5 overflow-visible">
          <span className="text-white text-xs text-center truncate max-w-full leading-normal">
            {match.team1}
          </span>
        </div>
        <div className="min-h-5" aria-hidden />
        <div className="flex items-center justify-center min-h-5 overflow-visible">
          <span className="text-white text-xs text-center truncate max-w-full leading-normal">
            {match.team2}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4cc360] rounded-[5px] justify-center cursor-pointer">
          <span className="text-black text-sm font-normal">1</span>
          <span className="text-[#07622b] text-sm font-normal">{match.odds['1']}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4cc360] rounded-[5px] justify-center cursor-pointer">
          <span className="text-black text-sm font-normal">draw</span>
          <span className="text-[#07622b] text-sm font-normal">{match.odds.draw}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4cc360] rounded-[5px] justify-center cursor-pointer">
          <span className="text-black text-sm font-normal">2</span>
          <span className="text-[#07622b] text-sm font-normal">{match.odds['2']}</span>
        </div>
      </div>
    </div>
  );
}
