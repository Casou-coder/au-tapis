'use client';

import { motion } from 'framer-motion';
import { Card } from '@/lib/poker-data';

interface PokerCardProps {
  card: Card;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  animate?: boolean;
}

export default function PokerCard({ card, faceDown = false, size = 'md', delay = 0, animate = true }: PokerCardProps) {
  const sizes = {
    sm: 'w-10 h-14 text-xs',
    md: 'w-14 h-20 text-sm',
    lg: 'w-20 h-28 text-base',
  };

  const cornerSizes = {
    sm: 'text-[10px] leading-none',
    md: 'text-xs leading-none',
    lg: 'text-sm leading-none',
  };

  const suitSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const isRed = card.isRed;

  const cardContent = faceDown ? (
    <div className={`${sizes[size]} relative rounded-lg overflow-hidden cursor-pointer`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 border border-blue-500/30">
        <div className="absolute inset-1 border border-blue-400/20 rounded">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-blue-300 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={`${sizes[size]} relative rounded-lg bg-white border border-gray-200 shadow-lg flex flex-col justify-between p-1`}
      style={{ boxShadow: isRed ? '0 4px 12px rgba(231,76,60,0.2)' : '0 4px 12px rgba(0,0,0,0.3)' }}>
      <div className={`${cornerSizes[size]} font-bold ${isRed ? 'text-red-500' : 'text-gray-900'} leading-none`}>
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
      <div className={`${suitSize[size]} text-center ${isRed ? 'text-red-500' : 'text-gray-900'}`}>
        {card.suit}
      </div>
      <div className={`${cornerSizes[size]} font-bold ${isRed ? 'text-red-500' : 'text-gray-900'} rotate-180 leading-none`}>
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
    </div>
  );

  if (!animate) return cardContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, rotate: -10 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -4, scale: 1.05 }}
    >
      {cardContent}
    </motion.div>
  );
}

export function CardGroup({ cards, faceDown = false, size = 'md' }: { cards: Card[]; faceDown?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex gap-1 items-end">
      {cards.map((card, i) => (
        <PokerCard key={i} card={card} faceDown={faceDown} size={size} delay={i * 0.1} />
      ))}
    </div>
  );
}
