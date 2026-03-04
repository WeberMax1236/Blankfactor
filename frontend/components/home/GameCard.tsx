'use client';

import Image from 'next/image';

export type GameCardItem = {
  name: string;
  image: string;
  count?: number;
  comingSoon?: boolean;
};

type GameCardProps = {
  game: GameCardItem;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="shrink-0 pt-2 pb-2 flex items-center justify-center">
      <div
        className="w-[140px] h-[186px] sm:w-[173px] sm:h-[232px] rounded-[10px] overflow-hidden border border-[#4cc360] bg-white relative cursor-pointer transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_20px_rgba(76,195,96,0.22)]"
      >
        <Image
          src={game.image}
          alt={game.name}
          width={173}
          height={232}
          className="w-full h-full object-cover"
          sizes="(max-width: 640px) 140px, 173px"
        />
        {game.comingSoon ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
              Coming soon
            </span>
          </div>
        ) : game.count != null ? (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="font-semibold text-xs tabular-nums">{game.count}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
