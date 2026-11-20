import React from 'react';
import { FlavorItem } from '../data/flavors';

interface HeroBackdropProps {
  flavor: FlavorItem;
  blobRef: React.RefObject<HTMLDivElement | null>;
}

export const HeroBackdrop: React.FC<HeroBackdropProps> = ({ flavor, blobRef }) => {
  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Subtle radial studio spotlight behind bottle */}
      <div
        className="absolute left-1/2 top-[43%] h-[62vw] w-[62vw] min-h-[380px] min-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* Main sweeping organic crimson/theme wave behind "Smoothie" — faithful to reference */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="animate-blob absolute inset-0 h-full w-full"
      >
        <path
          d="M210,270 C290,150 470,190 595,245 C725,302 840,210 995,145 C1155,78 1315,175 1300,340 C1285,505 1140,655 940,645 C760,636 675,540 505,495 C345,453 130,390 210,270 Z"
          fill={flavor.theme.blob}
          className="transition-colors duration-700 ease-out"
        />

        {/* Bottom-left rounded organic wave (behind banana & INGREDIENTS) */}
        <path
          d="M-60,635 C45,580 180,610 250,705 C315,792 315,875 295,940 L-60,940 Z"
          fill={flavor.theme.blob}
          className="transition-colors duration-700 ease-out"
        />

        {/* Bottom-right rounded organic wave (behind social icons) */}
        <path
          d="M1140,940 C1120,835 1175,725 1280,695 C1365,670 1445,700 1500,760 L1500,940 Z"
          fill={flavor.theme.blob}
          className="transition-colors duration-700 ease-out"
        />
      </svg>
    </div>
  );
};
