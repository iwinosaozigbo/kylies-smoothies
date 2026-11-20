import React from 'react';
import { FlavorItem } from '../data/flavors';

interface MarqueeStripProps {
  activeFlavor: FlavorItem;
}

const ITEMS = [
  "KYLIE'S COLD-BLENDED",
  '100% REAL FRUIT',
  'ZERO ADDED SUGAR',
  'BOTTLED IN GLASS DAILY',
  'FARM TO BOTTLE IN 6 HOURS',
  'HANDCRAFTED IN SMALL BATCHES',
];

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({ activeFlavor }) => {
  return (
    <div
      className="relative z-20 overflow-hidden border-y border-white/15 py-3.5 text-white transition-colors duration-700 sm:py-4"
      style={{ backgroundColor: activeFlavor.theme.blobDeep }}
    >
      <div className="animate-marquee flex items-center gap-8 sm:gap-12">
        {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12">
            <span className="font-display text-xs font-semibold tracking-[0.22em] text-white/95 sm:text-sm">
              {text}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        ))}
      </div>
    </div>
  );
};
