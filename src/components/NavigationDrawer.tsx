import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { FlavorItem, HERO_FLAVORS } from '../data/flavors';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  activeFlavor: FlavorItem;
  onSelectFlavor: (flavor: FlavorItem) => void;
}

const LINKS = [
  { label: 'Home & Hero', href: '#hero' },
  { label: 'Ingredients Lab', href: '#ingredients' },
  { label: 'Full Smoothie Menu', href: '#menu' },
  { label: "Kylie's Craft Story", href: '#story' },
  { label: 'Build a 6-Pack', href: '#bundle' },
  { label: 'Flagship Bars & Club', href: '#footer' },
];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  activeFlavor,
  onSelectFlavor,
}) => {
  if (!open) return null;

  const navigate = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      <aside
        className="relative z-10 flex h-full w-full max-w-sm flex-col justify-between p-7 text-white shadow-2xl sm:p-9"
        style={{ backgroundColor: activeFlavor.theme.bg }}
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="font-display text-3xl font-bold tracking-tight">kylie&apos;s</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-[#1D1112] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-10 space-y-2">
            {LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => navigate(link.href)}
                className="group flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-left font-display text-2xl font-bold text-white/90 transition-all hover:bg-white/15 hover:pl-5 hover:text-white"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            ))}
          </nav>
        </div>

        {/* Signature Flavor Quick Switcher */}
        <div className="border-t border-white/20 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">
            Switch Hero Flavor
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {HERO_FLAVORS.map((flav) => {
              const selected = flav.id === activeFlavor.id;
              return (
                <button
                  key={flav.id}
                  type="button"
                  onClick={() => {
                    onSelectFlavor(flav);
                    onClose();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex cursor-pointer flex-col items-center rounded-2xl p-2.5 transition-all ${
                    selected
                      ? 'bg-white/28 ring-2 ring-white'
                      : 'bg-black/15 hover:bg-white/20'
                  }`}
                >
                  <img
                    src={flav.bottleImage}
                    alt={flav.name}
                    className="h-14 w-auto object-contain drop-shadow"
                  />
                  <span className="mt-1.5 text-[11px] font-bold">{flav.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};
