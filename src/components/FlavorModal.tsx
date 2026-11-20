import React from 'react';
import { Plus, X } from 'lucide-react';
import { FlavorItem } from '../data/flavors';

interface FlavorModalProps {
  flavor: FlavorItem | null;
  onClose: () => void;
  onAddToCart: (flavor: FlavorItem, triggerEl?: HTMLElement | null) => void;
}

export const FlavorModal: React.FC<FlavorModalProps> = ({ flavor, onClose, onAddToCart }) => {
  if (!flavor) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-xs" />

      <div className="relative z-10 grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close flavor details"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#1D1112] shadow-md transition-transform hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Stage */}
        <div
          className="relative flex items-center justify-center py-10 sm:col-span-5"
          style={{ backgroundColor: flavor.theme.bg }}
        >
          <img
            src={flavor.bottleImage}
            alt={flavor.name}
            style={
              flavor.bottleFilter
                ? { filter: `${flavor.bottleFilter} drop-shadow(0 18px 22px rgba(0,0,0,0.3))` }
                : undefined
            }
            className={`h-60 w-auto -rotate-8 object-contain ${flavor.bottleFilter ? '' : 'bottle-shadow'}`}
          />
        </div>

        {/* Right Info */}
        <div className="flex flex-col justify-between p-6 sm:col-span-7 sm:p-8">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {flavor.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: flavor.theme.softBg,
                    color: flavor.theme.pillText,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            <h3 className="font-display mt-3 text-2xl font-bold text-[#1D1112]">{flavor.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5E4A4B]">{flavor.description}</p>

            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8F7677]">
                Key Ingredients
              </p>
              {flavor.ingredients.map((ing) => (
                <div key={ing.name} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D1112]">{ing.name}</span>
                  <span className="font-bold" style={{ color: flavor.theme.pillText }}>
                    {ing.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-[#FFF9F6] p-3 text-center">
              <div>
                <p className="font-display text-base font-bold text-[#1D1112]">
                  {flavor.nutrition.calories}
                </p>
                <p className="text-[10px] font-semibold uppercase text-[#8A7374]">Calories</p>
              </div>
              <div>
                <p className="font-display text-base font-bold text-[#1D1112]">
                  {flavor.nutrition.vitaminC}%
                </p>
                <p className="text-[10px] font-semibold uppercase text-[#8A7374]">Vit C</p>
              </div>
              <div>
                <p className="font-display text-base font-bold text-[#1D1112]">
                  {flavor.nutrition.addedSugar}
                </p>
                <p className="text-[10px] font-semibold uppercase text-[#8A7374]">Added Sugar</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span
              className="font-display text-2xl font-bold"
              style={{ color: flavor.theme.pillText }}
            >
              ${flavor.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={(e) => {
                onAddToCart(flavor, e.currentTarget);
                onClose();
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-transform hover:scale-103 active:scale-95"
              style={{ backgroundColor: flavor.theme.bg }}
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
