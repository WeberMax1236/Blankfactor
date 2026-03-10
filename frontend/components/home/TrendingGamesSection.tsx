'use client';

import { GameCard, type GameCardItem } from './GameCard';

type TrendingGamesSectionProps = {
  games: GameCardItem[];
  showAll: boolean;
  onShowAllChange: (show: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function TrendingGamesSection({
  games,
  showAll,
  onShowAllChange,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: TrendingGamesSectionProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
        <h2 className="font-bold text-white text-sm sm:text-base">Trending Games</h2>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onShowAllChange(true)}
            className={`h-9 px-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 ${
              showAll
                ? 'bg-[#4cc360] text-white'
                : 'bg-[#323435] text-white/80 hover:bg-[#3d4041]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              onShowAllChange(false);
              onPrevPage();
            }}
            disabled={currentPage === 0}
            className="h-9 w-9 rounded-lg bg-[#323435] text-white/80 hover:bg-[#3d4041] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              onShowAllChange(false);
              onNextPage();
            }}
            disabled={currentPage >= totalPages - 1}
            className="h-9 w-9 rounded-lg bg-[#323435] text-white/80 hover:bg-[#3d4041] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
      <hr className="border-0 h-px bg-white/10 mb-4 sm:mb-6" aria-hidden />
      <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 mb-8 sm:mb-10 items-center pl-3 pr-3">
        {games.map((game, i) => (
          <GameCard key={i} game={game} />
        ))}
      </div>
    </>
  );
}
