import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Droplets, Leaf, Sparkles } from 'lucide-react';
import { FlavorItem, HERO_FLAVORS } from '../data/flavors';

gsap.registerPlugin(ScrollTrigger);

interface IngredientsSectionProps {
  activeFlavor: FlavorItem;
  onSelectFlavor: (flavor: FlavorItem) => void;
  onAddToCart: (flavor: FlavorItem, triggerEl?: HTMLElement | null) => void;
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  activeFlavor,
  onSelectFlavor,
  onAddToCart,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bottleStageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Reveal heading
      gsap.fromTo(
        el.querySelectorAll('[data-ing-head]'),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            once: true,
          },
        }
      );

      // Bottle glide & subtle un-tilt on scroll
      if (bottleStageRef.current) {
        gsap.fromTo(
          bottleStageRef.current.querySelector('[data-center-bottle]'),
          { y: 55, rotation: -10, scale: 0.9 },
          {
            y: -18,
            rotation: 4,
            scale: 1.03,
            ease: 'none',
            scrollTrigger: {
              trigger: bottleStageRef.current,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: 0.8,
            },
          }
        );

        // Orbiting fruit satellites expand outward on scroll!
        const satellites = bottleStageRef.current.querySelectorAll('[data-orbit-fruit]');
        satellites.forEach((sat, i) => {
          const dirX = i % 2 === 0 ? -1 : 1;
          const dirY = i < 2 ? -1 : 1;
          gsap.fromTo(
            sat,
            { x: -dirX * 32, y: -dirY * 26, scale: 0.65, rotation: dirX * -25 },
            {
              x: dirX * 26,
              y: dirY * 22,
              scale: 1.08,
              rotation: dirX * 22,
              ease: 'none',
              scrollTrigger: {
                trigger: bottleStageRef.current,
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 0.7,
              },
            }
          );
        });
      }

      // Ingredient cards stagger in
      gsap.fromTo(
        el.querySelectorAll('[data-ing-card]'),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el.querySelector('[data-ing-grid]'),
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Animated percentage bars
      el.querySelectorAll<HTMLElement>('[data-pct-bar]').forEach((bar) => {
        const pct = bar.dataset.pct || '50';
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: `${pct}%`,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [activeFlavor.id]);

  const leftIngredients = activeFlavor.ingredients.slice(0, 2);
  const rightIngredients = activeFlavor.ingredients.slice(2, 4);

  return (
    <section
      id="ingredients"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FFF9F6] px-5 py-20 sm:px-9 sm:py-28 lg:px-14 lg:py-32"
    >
      {/* Subtle tinted radial aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-3xl transition-colors duration-700"
        style={{ backgroundColor: activeFlavor.theme.bg }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div
            data-ing-head
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500"
            style={{
              backgroundColor: activeFlavor.theme.softBg,
              color: activeFlavor.theme.pillText,
            }}
          >
            <Leaf className="h-3.5 w-3.5" />
            Inside Every Glass Bottle
          </div>
          <h2
            data-ing-head
            className="font-display mt-4 text-3xl font-bold tracking-tight text-[#1D1112] sm:text-5xl"
          >
            Real fruit. Zero shortcuts.
          </h2>
          <p data-ing-head className="mt-3 text-base text-[#5E4B4C] sm:text-lg">
            Every bottle of Kylie&apos;s is cold-blended within hours of harvest. Explore exactly what goes into{' '}
            <span className="font-semibold text-[#1D1112]">{activeFlavor.name}</span>.
          </p>

          {/* Interactive Flavor Selector Tabs */}
          <div
            data-ing-head
            className="mt-7 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-black/8 bg-white p-1.5 shadow-sm"
          >
            {HERO_FLAVORS.map((flav) => {
              const selected = flav.id === activeFlavor.id;
              return (
                <button
                  key={flav.id}
                  type="button"
                  onClick={() => onSelectFlavor(flav)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all duration-300 sm:px-5 sm:text-sm ${
                    selected
                      ? 'text-white shadow-md'
                      : 'text-[#4D3B3C] hover:bg-black/5'
                  }`}
                  style={selected ? { backgroundColor: flav.theme.bg } : undefined}
                >
                  {flav.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exploded 3-Column Stage: Left Ingredients | Center Bottle + Orbiting Fruits | Right Ingredients */}
        <div
          data-ing-grid
          className="mt-14 grid grid-cols-1 items-center gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-6"
        >
          {/* Left Column */}
          <div className="order-2 space-y-5 lg:order-1 lg:col-span-4">
            {leftIngredients.map((ing) => (
              <div
                key={ing.name}
                data-ing-card
                className="group rounded-3xl border border-black/6 bg-white p-5 shadow-[0_10px_30px_rgba(29,17,18,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(29,17,18,0.09)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl p-2 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: activeFlavor.theme.softBg }}
                  >
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="h-full w-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display truncate text-base font-bold text-[#1D1112]">
                        {ing.name}
                      </h3>
                      <span
                        className="font-display text-lg font-bold"
                        style={{ color: activeFlavor.theme.pillText }}
                      >
                        {ing.percentage}%
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#8C7273]">{ing.origin}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#5A4748]">{ing.benefit}</p>
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    data-pct-bar
                    data-pct={ing.percentage}
                    className="h-full rounded-full transition-colors duration-500"
                    style={{ backgroundColor: activeFlavor.theme.bg, width: `${ing.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Center Bottle + Orbiting Real Fruits */}
          <div
            ref={bottleStageRef}
            className="relative order-1 mx-auto flex h-[340px] w-full max-w-[340px] items-center justify-center sm:h-[420px] sm:max-w-[400px] lg:order-2 lg:col-span-4"
          >
            {/* Soft circular halo */}
            <div
              className="absolute h-64 w-64 rounded-full transition-colors duration-700 sm:h-76 sm:w-76"
              style={{ backgroundColor: activeFlavor.theme.softBg }}
            />
            <div
              className="absolute h-52 w-52 rounded-full border-2 border-dashed opacity-30 transition-colors duration-700 sm:h-64 sm:w-64"
              style={{ borderColor: activeFlavor.theme.bg }}
            />

            {/* 4 Orbiting Photorealistic Fruit Satellites */}
            {activeFlavor.ingredients.slice(0, 4).map((ing, i) => {
              const positions = [
                'left-2 top-6',
                'right-2 top-8',
                'left-3 bottom-8',
                'right-3 bottom-6',
              ];
              return (
                <div
                  key={`${activeFlavor.id}-sat-${i}`}
                  data-orbit-fruit
                  className={`pointer-events-none absolute z-20 h-16 w-16 sm:h-20 sm:w-20 ${positions[i]}`}
                >
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className="fruit-shadow-soft h-full w-full object-contain"
                  />
                </div>
              );
            })}

            {/* Centerpiece Studio Bottle */}
            <img
              data-center-bottle
              key={activeFlavor.bottleImage}
              src={activeFlavor.bottleImage}
              alt={activeFlavor.name}
              className="bottle-shadow relative z-10 h-[275px] w-auto object-contain sm:h-[345px]"
            />
          </div>

          {/* Right Column */}
          <div className="order-3 space-y-5 lg:col-span-4">
            {rightIngredients.map((ing) => (
              <div
                key={ing.name}
                data-ing-card
                className="group rounded-3xl border border-black/6 bg-white p-5 shadow-[0_10px_30px_rgba(29,17,18,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(29,17,18,0.09)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl p-2 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: activeFlavor.theme.softBg }}
                  >
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="h-full w-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display truncate text-base font-bold text-[#1D1112]">
                        {ing.name}
                      </h3>
                      <span
                        className="font-display text-lg font-bold"
                        style={{ color: activeFlavor.theme.pillText }}
                      >
                        {ing.percentage}%
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#8C7273]">{ing.origin}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#5A4748]">{ing.benefit}</p>
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    data-pct-bar
                    data-pct={ing.percentage}
                    className="h-full rounded-full transition-colors duration-500"
                    style={{ backgroundColor: activeFlavor.theme.bg, width: `${ing.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Strip */}
        <div
          data-ing-card
          className="mt-12 grid grid-cols-2 gap-3 rounded-3xl border border-black/6 bg-white p-5 shadow-sm sm:grid-cols-4 sm:gap-6 sm:p-7"
        >
          <div className="text-center">
            <p
              className="font-display text-2xl font-bold sm:text-3xl"
              style={{ color: activeFlavor.theme.pillText }}
            >
              {activeFlavor.nutrition.calories}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#7A6465]">
              Calories / Bottle
            </p>
          </div>
          <div className="text-center">
            <p
              className="font-display text-2xl font-bold sm:text-3xl"
              style={{ color: activeFlavor.theme.pillText }}
            >
              {activeFlavor.nutrition.vitaminC}%
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#7A6465]">
              Daily Vitamin C
            </p>
          </div>
          <div className="text-center">
            <p
              className="font-display text-2xl font-bold sm:text-3xl"
              style={{ color: activeFlavor.theme.pillText }}
            >
              {activeFlavor.nutrition.potassium}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#7A6465]">
              Natural Potassium
            </p>
          </div>
          <div className="text-center">
            <p
              className="font-display text-2xl font-bold sm:text-3xl"
              style={{ color: activeFlavor.theme.pillText }}
            >
              {activeFlavor.nutrition.addedSugar}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#7A6465]">
              Added Cane Sugar
            </p>
          </div>
        </div>

        {/* Bottom quick CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#665152] sm:gap-6 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600" /> Non-GMO Certified
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-sky-600" /> Never Heat-Pasteurized
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" /> Reusable Glass Bottles
          </span>
          <button
            type="button"
            onClick={(e) => onAddToCart(activeFlavor, e.currentTarget)}
            className="ml-1 cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-transform hover:-translate-y-0.5 active:scale-95"
            style={{ backgroundColor: activeFlavor.theme.bg }}
          >
            Add {activeFlavor.shortName} — ${activeFlavor.price.toFixed(2)}
          </button>
        </div>
      </div>
    </section>
  );
};
