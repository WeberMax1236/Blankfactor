'use client';

import { GameCard, type GameCardItem } from './GameCard';

type TrendingGamesSectionProps = {
  games: GameCardItem[];
};

export function TrendingGamesSection({ games }: TrendingGamesSectionProps) {
  return (
    <>
      <h2 className="font-bold text-white text-sm sm:text-base mb-3 sm:mb-4">Trending Games</h2>
      <hr className="border-0 h-px bg-white/10 mb-4 sm:mb-6" aria-hidden />
      <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 mb-8 sm:mb-10 items-center pl-3 pr-3">
        {games.map((game, i) => (
          <GameCard key={i} game={game} />
        ))}
      </div>
    </>
  );
}
