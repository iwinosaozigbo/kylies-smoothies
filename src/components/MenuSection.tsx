import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Sparkles } from 'lucide-react';
import { FLAVORS, FlavorItem } from '../data/flavors';

gsap.registerPlugin(ScrollTrigger);

interface MenuSectionProps {
  onAddToCart: (flavor: FlavorItem, triggerEl?: HTMLElement | null) => void;
  onInspectFlavor: (flavor: FlavorItem) => void;
}

const FILTERS: { id: 'all' | 'berry' | 'greens' | 'tropical'; label: string }[] = [
  { id: 'all', label: 'All Flavors' },
  { id: 'berry', label: 'Berry Classics' },
  { id: 'greens', label: 'Super Greens' },
  { id: 'tropical', label: 'Tropical Sun' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, onInspectFlavor }) => {
  const [filter, setFilter] = useState<'all' | 'berry' | 'greens' | 'tropical'>('all');
  const sectionRef = useRef<HTMLElement | null>(null);

  const visibleFlavors =
    filter === 'all' ? FLAVORS : FLAVORS.filter((f) => f.category === filter);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-menu-card]'),
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el.querySelector('[data-menu-grid]'),
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [filter]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative bg-white px-5 py-20 sm:px-9 sm:py-28 lg:px-14"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header + Filter Pills */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EF] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#D92B2B]">
              <Sparkles className="h-3.5 w-3.5" />
              The Kylie&apos;s Menu
            </span>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#1D1112] sm:text-5xl">
              Blended for every craving.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((tab) => {
              const active = tab.id === filter;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all duration-300 sm:text-sm ${
                    active
                      ? 'bg-[#1D1112] text-white shadow-md'
                      : 'bg-[#F8F1EE] text-[#574243] hover:bg-[#EFE4DF]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div
          data-menu-grid
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        >
          {visibleFlavors.map((flavor) => {
            const accentFruit = flavor.ingredients[0]?.image || '/assets/fruit-strawberry-whole.webp';
            return (
              <article
                key={flavor.id}
                data-menu-card
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-black/6 bg-[#FFF9F6] p-5 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(29,17,18,0.1)] sm:p-6"
              >
                {/* Colorful Studio Backdrop Stage */}
                <div
                  onClick={() => onInspectFlavor(flavor)}
                  className="relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] transition-transform duration-500"
                  style={{ backgroundColor: flavor.theme.bg }}
                >
                  {/* Organic corner blob */}
                  <div
                    className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-70 transition-transform duration-500 group-hover:scale-125"
                    style={{ backgroundColor: flavor.theme.blob }}
                  />
                  <div
                    className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125"
                    style={{ backgroundColor: flavor.theme.blob }}
                  />

                  {/* Badges */}
                  <div className="absolute left-3.5 top-3.5 z-20 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {flavor.badges[0]}
                    </span>
                  </div>

                  {/* Peeking Fruit Accent */}
                  <img
                    src={accentFruit}
                    alt=""
                    aria-hidden="true"
                    className="fruit-shadow-soft pointer-events-none absolute right-5 top-10 z-10 h-14 w-14 -rotate-12 object-contain opacity-90 transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:rotate-12 group-hover:scale-110"
                  />
                  <img
                    src="/assets/fruit-mint-leaf.webp"
                    alt=""
                    aria-hidden="true"
                    className="fruit-shadow-soft pointer-events-none absolute bottom-6 left-6 z-10 h-11 w-11 rotate-24 object-contain opacity-90 transition-all duration-500 group-hover:-translate-x-2 group-hover:translate-y-1 group-hover:-rotate-12"
                  />

                  {/* Studio Bottle */}
                  <img
                    src={flavor.bottleImage}
                    alt={flavor.name}
                    style={flavor.bottleFilter ? { filter: `${flavor.bottleFilter} drop-shadow(0 18px 20px rgba(0,0,0,0.28))` } : undefined}
                    className={`relative z-20 h-52 w-auto object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-108 ${
                      flavor.bottleFilter ? '' : 'bottle-shadow'
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="mt-5 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl font-bold text-[#1D1112]">
                        {flavor.name}
                      </h3>
                      <span
                        className="font-display text-lg font-bold"
                        style={{ color: flavor.theme.pillText }}
                      >
                        ${flavor.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#614D4E]">
                      {flavor.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 pt-2">
                    <span className="text-xs font-semibold text-[#8A7374]">
                      {flavor.nutrition.calories} kcal • {flavor.nutrition.vitaminC}% Vit C
                    </span>
                    <button
                      type="button"
                      onClick={(e) => onAddToCart(flavor, e.currentTarget)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                      style={{ backgroundColor: flavor.theme.bg }}
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
