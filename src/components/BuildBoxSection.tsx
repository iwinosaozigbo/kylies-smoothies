import React, { useState } from 'react';
import { PackageCheck, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import { FLAVORS, FlavorItem } from '../data/flavors';

interface BuildBoxSectionProps {
  onAddBundleToCart: (flavors: FlavorItem[]) => void;
}

const BOX_CAPACITY = 6;
const BUNDLE_DISCOUNT = 0.15;

export const BuildBoxSection: React.FC<BuildBoxSectionProps> = ({ onAddBundleToCart }) => {
  const [slots, setSlots] = useState<FlavorItem[]>([
    FLAVORS[0],
    FLAVORS[0],
    FLAVORS[1],
    FLAVORS[2],
  ]);

  const addBottle = (flavor: FlavorItem) => {
    if (slots.length >= BOX_CAPACITY) return;
    setSlots((prev) => [...prev, flavor]);
  };

  const removeBottle = (idx: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  const autoFill = () => {
    const curated = [FLAVORS[0], FLAVORS[0], FLAVORS[1], FLAVORS[2], FLAVORS[3], FLAVORS[4]];
    setSlots(curated);
  };

  const rawTotal = slots.reduce((sum, f) => sum + f.price, 0);
  const isComplete = slots.length === BOX_CAPACITY;
  const discountedTotal = isComplete ? rawTotal * (1 - BUNDLE_DISCOUNT) : rawTotal;
  const savings = isComplete ? rawTotal - discountedTotal : 0;

  return (
    <section
      id="bundle"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-9 sm:py-28 lg:px-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EF] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#D92B2B]">
            <PackageCheck className="h-3.5 w-3.5" />
            Save 15% On Custom 6-Packs
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#1D1112] sm:text-5xl">
            Build your Kylie&apos;s box.
          </h2>
          <p className="mt-3 text-base text-[#5E4B4C]">
            Mix and match any 6 chilled glass bottles for doorstep delivery. Tap a bottle below to drop it straight into your carrier.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Flavor Picker Palette */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-6">
            {FLAVORS.map((flavor) => {
              const countInBox = slots.filter((s) => s.id === flavor.id).length;
              return (
                <button
                  key={flavor.id}
                  type="button"
                  disabled={isComplete}
                  onClick={() => addBottle(flavor)}
                  className={`group relative flex flex-col items-center rounded-3xl border border-black/8 bg-[#FFF9F6] p-4 text-center transition-all duration-300 ${
                    isComplete
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:-translate-y-1 hover:border-black/15 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {countInBox > 0 && (
                    <span
                      className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white shadow"
                      style={{ backgroundColor: flavor.theme.bg }}
                    >
                      {countInBox}
                    </span>
                  )}

                  <div
                    className="flex h-28 w-24 items-center justify-center rounded-2xl p-2 transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: flavor.theme.softBg }}
                  >
                    <img
                      src={flavor.bottleImage}
                      alt={flavor.name}
                      style={flavor.bottleFilter ? { filter: flavor.bottleFilter } : undefined}
                      className="h-24 w-auto object-contain drop-shadow-md"
                    />
                  </div>
                  <p className="font-display mt-3 text-sm font-bold text-[#1D1112]">
                    {flavor.shortName}
                  </p>
                  <p className="text-xs font-semibold text-[#7A6364]">${flavor.price.toFixed(2)}</p>
                  <span
                    className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: flavor.theme.bg }}
                  >
                    <Plus className="h-3 w-3" /> Add
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Live 6-Slot Bottle Carrier Tray */}
          <div className="rounded-[2rem] border border-black/8 bg-[#FFF6F2] p-6 shadow-[0_20px_50px_rgba(29,17,18,0.06)] sm:p-8 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-bold text-[#1D1112]">
                  Your Chilled 6-Pack
                </h3>
                <p className="text-xs font-medium text-[#755F60]">
                  {isComplete
                    ? 'Box complete! 15% bundle savings unlocked.'
                    : `Pick ${BOX_CAPACITY - slots.length} more bottle${BOX_CAPACITY - slots.length === 1 ? '' : 's'} to unlock 15% off.`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={autoFill}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1D1112] shadow-sm transition-colors hover:bg-black/5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#EC3E3D]" />
                  Auto-Fill
                </button>
                {slots.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSlots([])}
                    aria-label="Clear box"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-[#6D5859] shadow-sm transition-colors hover:text-[#EC3E3D]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-black/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#EC3E3D] via-[#F39C12] to-[#249956] transition-all duration-500"
                style={{ width: `${(slots.length / BOX_CAPACITY) * 100}%` }}
              />
            </div>

            {/* 6 Physical Slots */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: BOX_CAPACITY }).map((_, idx) => {
                const bottle = slots[idx];
                return (
                  <div
                    key={idx}
                    className={`relative flex h-32 flex-col items-center justify-center rounded-2xl border-2 transition-all sm:h-36 ${
                      bottle
                        ? 'border-transparent bg-white shadow-sm'
                        : 'border-dashed border-black/12 bg-white/50'
                    }`}
                  >
                    {bottle ? (
                      <>
                        <button
                          type="button"
                          onClick={() => removeBottle(idx)}
                          aria-label={`Remove ${bottle.name}`}
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/8 text-[#4D3B3C] transition-colors hover:bg-[#EC3E3D] hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <img
                          key={`${bottle.id}-${idx}`}
                          src={bottle.bottleImage}
                          alt={bottle.name}
                          style={bottle.bottleFilter ? { filter: bottle.bottleFilter } : undefined}
                          className="animate-bottle-drop h-22 w-auto object-contain drop-shadow-md sm:h-24"
                        />
                        <span className="mt-1 max-w-full truncate px-2 text-[11px] font-bold text-[#1D1112]">
                          {bottle.shortName}
                        </span>
                      </>
                    ) : (
                      <span className="font-display text-xs font-semibold text-[#A99293]">
                        Slot {idx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pricing & Submit */}
            <div className="mt-6 flex flex-col gap-4 border-t border-black/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-2xl font-bold text-[#1D1112]">
                    ${discountedTotal.toFixed(2)}
                  </span>
                  {isComplete && (
                    <span className="text-sm font-medium text-[#8C7475] line-through">
                      ${rawTotal.toFixed(2)}
                    </span>
                  )}
                </div>
                {isComplete ? (
                  <p className="text-xs font-bold text-emerald-700">
                    You save ${savings.toFixed(2)} (15% off) + Free Chilled Shipping!
                  </p>
                ) : (
                  <p className="text-xs text-[#786263]">
                    {slots.length} / {BOX_CAPACITY} bottles selected
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={slots.length === 0}
                onClick={() => onAddBundleToCart(slots)}
                className={`cursor-pointer rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-lg transition-all duration-300 ${
                  slots.length === 0
                    ? 'cursor-not-allowed bg-black/20 shadow-none'
                    : 'bg-[#EC3E3D] hover:-translate-y-0.5 hover:bg-[#D62831] active:scale-95'
                }`}
              >
                {isComplete ? 'Add 6-Pack to Bag' : `Add ${slots.length || ''} Bottles to Bag`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
