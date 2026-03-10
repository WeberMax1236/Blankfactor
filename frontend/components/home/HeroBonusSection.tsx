'use client';

import Image from 'next/image';
import { useState } from 'react';

export type BonusCardItem = {
  percentage: number;
  subtext: string;
  image: string;
  imageAlt: string;
};

type HeroBonusSectionProps = {
  items?: BonusCardItem[];
};

const DEFAULT_BONUS_CARDS: BonusCardItem[] = [
  {
    percentage: 80,
    subtext: '+5 FREE BETS IN SPORTS',
    image: '/assets/bonus/bonus-1.png',
    imageAlt: 'Sports bonus',
  },
  {
    percentage: 120,
    subtext: '+5 FREE BETS IN SPORTS',
    image: '/assets/bonus/bonus-2.png',
    imageAlt: 'Casino bonus',
  },
  {
    percentage: 80,
    subtext: '+5 FREE BETS IN SPORTS',
    image: '/assets/bonus/bonus-3.png',
    imageAlt: 'Sports bonus',
  },
];

function BonusCard({
  percentage,
  subtext,
  image,
  imageAlt,
  onDeposit,
}: BonusCardItem & { onDeposit?: () => void }) {
  return (
    <div
      className="relative flex flex-col h-full min-h-[204px] md:min-h-[240px] xl:min-h-[290px] rounded-[10px] overflow-hidden shadow-lg"
      style={{
        background: 'linear-gradient(to right, #585757, #A09595)',
      }}
    >
      <div className="absolute top-3 left-3 z-10 rounded-md" style={{background: 'linear-gradient(to right, #FFFFFF, #999999)'}}>
        <span className="inline-block px-2.5 py-1 rounded-md bg-white/20 text-black text-xs font-medium uppercase tracking-wide">
          EXCLUSIVE
        </span>
      </div>
      <div className="relative flex flex-1 min-h-0">
        <div className="flex flex-col justify-between p-4 sm:p-5 flex-1 min-w-0 z-10">
          <div className="flex flex-col gap-2 pt-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight leading-tight whitespace-nowrap">
              {percentage}% Bonus
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-black/65 font-bold uppercase tracking-wide">
              {subtext}
            </p>
            <button
              type="button"
              onClick={onDeposit}
              className="mt-14 w-fit px-4 py-2.5 rounded-[10px] bg-[#149145] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#5dd471] active:scale-[0.98] transition-all cursor-pointer"
            >
              Deposit Now
            </button>
          </div>
        </div>
        <div className="relative w-[61%] p-2 min-w-[120px] sm:min-w-[140px] shrink-0 self-stretch min-h-[140px]">
          <Image
            src={image}
            alt={imageAlt}
            width={100}
            height={100}
            className="object-cover object-center object-right w-full"
          />
        </div>
      </div>
    </div>
  );
}

function PromoAndReferralSection({
  onRedeemPromo,
  onRedeemReferral,
}: {
  onRedeemPromo?: (code: string) => void;
  onRedeemReferral?: (code: string) => void;
}) {
  const [promoCode, setPromoCode] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const inputClass =
    'flex-1 min-w-0 h-10 px-3 rounded-[10px] bg-[#252829] border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#4cc360]/50 focus:ring-1 focus:ring-[#4cc360]/30';
  const buttonClass =
    'shrink-0 px-4 py-2.5 h-10 rounded-[10px] bg-[#149145] text-white text-sm font-semibold hover:bg-[#5dd471] active:scale-[0.98] transition-all cursor-pointer';

  return (
    <div className="mt-6 lg:mt-8 p-4 sm:p-5 rounded-xl bg-[#2d3134] border border-white/10 shadow-lg flex flex-col sm:flex-row gap-6 sm:gap-10 lg:gap-16">
      {/* Promo code */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-sm text-white/60">Already have a promo code?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter a promo code..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onRedeemPromo?.(promoCode)}
            className={buttonClass}
          >
            Redeem
          </button>
        </div>
      </div>
      {/* Referral code */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-sm text-white/60">Use a Referral Code and Earn Instant Rewards!</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter someone's code..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onRedeemReferral?.(referralCode)}
            className={buttonClass}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}

export function HeroBonusSection({ items = DEFAULT_BONUS_CARDS }: HeroBonusSectionProps) {
  function handleDeposit() {
    // TODO: open deposit flow
  }

  function handleRedeemPromo(code: string) {
    // TODO: submit promo code
    console.log('Redeem promo:', code);
  }

  function handleRedeemReferral(code: string) {
    // TODO: submit referral code
    console.log('Redeem referral:', code);
  }

  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full min-w-0 items-stretch">
        {items.map((card, index) => (
          <div key={index} className="flex flex-col min-w-0 min-h-0">
            <div className="flex-1 min-h-0 flex flex-col">
              <BonusCard
                percentage={card.percentage}
                subtext={card.subtext}
                image={card.image}
                imageAlt={card.imageAlt}
                onDeposit={handleDeposit}
              />
            </div>
          </div>
        ))}
      </div>
      <PromoAndReferralSection
        onRedeemPromo={handleRedeemPromo}
        onRedeemReferral={handleRedeemReferral}
      />
    </div>
  );
}
