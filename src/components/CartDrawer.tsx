import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Sparkles, Tag, Trash2, X } from 'lucide-react';
import { FlavorItem } from '../data/flavors';

export interface CartEntry {
  flavor: FlavorItem;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartEntry[];
  onUpdateQty: (flavorId: string, delta: number) => void;
  onRemove: (flavorId: string) => void;
  onClear: () => void;
  accentColor: string;
}

const FREE_SHIPPING_THRESHOLD = 45;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
  accentColor,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const subtotal = items.reduce((sum, entry) => sum + entry.flavor.price * entry.quantity, 0);
  const totalBottles = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const autoSixPackDiscount = totalBottles >= 6 ? subtotal * 0.15 : 0;
  const promoDiscount = promoApplied && !autoSixPackDiscount ? subtotal * 0.15 : 0;
  const totalDiscount = autoSixPackDiscount + promoDiscount;
  const finalTotal = Math.max(0, subtotal - totalDiscount);
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - finalTotal);

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'KYLIE15') {
      setPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      onClear();
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => {
          setCheckedOut(false);
          onClose();
        }}
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FFF9F6] text-[#1D1112] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5" style={{ color: accentColor }} />
            <h2 className="font-display text-xl font-bold">
              Your Kylie&apos;s Bag ({totalBottles})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setCheckedOut(false);
              onClose();
            }}
            aria-label="Close bag"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/6 transition-colors hover:bg-black/12"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free shipping meter */}
        {!checkedOut && items.length > 0 && (
          <div className="border-b border-black/6 bg-white px-6 py-3.5">
            <p className="text-xs font-semibold text-[#574243]">
              {toFreeShipping === 0
                ? 'Unlocked: Free insulated chilled delivery!'
                : `Add $${toFreeShipping.toFixed(2)} more for free chilled delivery`}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (finalTotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {checkedOut ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-bold text-[#1D1112]">
                Blending your order!
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[#614D4E]">
                Your Kylie&apos;s chilled glass bottles are queued for cold-blending. Thank you for sipping real fruit!
              </p>
              <button
                type="button"
                onClick={() => {
                  setCheckedOut(false);
                  onClose();
                }}
                className="mt-6 cursor-pointer rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                Back to Kylie&apos;s
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <img
                src="/assets/fruit-strawberry-whole.webp"
                alt=""
                className="fruit-shadow-soft h-20 w-20 object-contain opacity-90"
              />
              <h3 className="font-display mt-4 text-xl font-bold text-[#1D1112]">
                Your bag is empty
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-[#6E595A]">
                Start with our signature Strawberry Fantasy or build a custom 6-pack for 15% off.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 cursor-pointer rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                Explore Smoothies
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ flavor, quantity }) => (
                <div
                  key={flavor.id}
                  className="flex items-center gap-4 rounded-2xl border border-black/6 bg-white p-3.5 shadow-xs"
                >
                  <div
                    className="flex h-18 w-16 shrink-0 items-center justify-center rounded-xl p-1.5"
                    style={{ backgroundColor: flavor.theme.softBg }}
                  >
                    <img
                      src={flavor.bottleImage}
                      alt={flavor.name}
                      style={flavor.bottleFilter ? { filter: flavor.bottleFilter } : undefined}
                      className="h-15 w-auto object-contain drop-shadow"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display truncate text-sm font-bold text-[#1D1112]">
                      {flavor.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#7A6364]">
                      ${flavor.price.toFixed(2)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(flavor.id, -1)}
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/6 hover:bg-black/12"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-5 text-center text-xs font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(flavor.id, 1)}
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/6 hover:bg-black/12"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button
                      type="button"
                      onClick={() => onRemove(flavor.id)}
                      aria-label={`Remove ${flavor.name}`}
                      className="cursor-pointer text-[#9E8485] hover:text-[#EC3E3D]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="font-display text-sm font-bold text-[#1D1112]">
                      ${(flavor.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {!checkedOut && items.length > 0 && (
          <div className="border-t border-black/8 bg-white px-6 py-5">
            {/* Promo Code */}
            <form onSubmit={handlePromo} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9B8283]" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (try KYLIE15)"
                  className="w-full rounded-full border border-black/12 bg-[#FFF9F6] py-2 pl-8 pr-3 text-xs font-semibold uppercase placeholder:normal-case focus:border-[#EC3E3D] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#1D1112] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                Apply
              </button>
            </form>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6A5556]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    {autoSixPackDiscount > 0 ? '6-Pack 15% Bundle Savings' : 'Promo KYLIE15 (15%)'}
                  </span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6A5556]">
                <span>Chilled Delivery</span>
                <span>{toFreeShipping === 0 ? 'FREE' : '$5.95'}</span>
              </div>
              <div className="flex justify-between border-t border-black/8 pt-2.5 font-display text-lg font-bold text-[#1D1112]">
                <span>Total</span>
                <span>${(finalTotal + (toFreeShipping === 0 ? 0 : 5.95)).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 w-full cursor-pointer rounded-full py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-98"
              style={{ backgroundColor: accentColor }}
            >
              Checkout Now
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
