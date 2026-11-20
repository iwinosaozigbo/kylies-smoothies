import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles } from 'lucide-react';
import { FlavorItem, HERO_FLAVORS } from '../data/flavors';
import { HeroBackdrop } from './HeroBackdrop';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  activeFlavor: FlavorItem;
  onSelectFlavor: (flavor: FlavorItem) => void;
  onAddToCart: (flavor: FlavorItem, triggerEl?: HTMLElement | null) => void;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
  cartBtnRef: React.RefObject<HTMLButtonElement | null>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeFlavor,
  onSelectFlavor,
  onAddToCart,
  onOpenMenu,
  onOpenCart,
  cartCount,
  cartBtnRef,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);
  const bottleWrapRef = useRef<HTMLDivElement | null>(null);
  const bottleImgRef = useRef<HTMLImageElement | null>(null);
  const scriptRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const fruitLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fruitInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fruitFloatRefs = useRef<(HTMLImageElement | null)[]>([]);
  const buyBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [burstTick, setBurstTick] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const currentIdx = HERO_FLAVORS.findIndex((f) => f.id === activeFlavor.id);
  const otherFlavors = HERO_FLAVORS.filter((f) => f.id !== activeFlavor.id);

  const goPrev = () => {
    const nextIdx = (currentIdx - 1 + HERO_FLAVORS.length) % HERO_FLAVORS.length;
    onSelectFlavor(HERO_FLAVORS[nextIdx]);
  };

  const goNext = () => {
    const nextIdx = (currentIdx + 1) % HERO_FLAVORS.length;
    onSelectFlavor(HERO_FLAVORS[nextIdx]);
  };

  // Trigger a playful bottle shake & berry re-pop when user taps the bottle!
  const handleBottleTap = () => {
    if (bottleImgRef.current) {
      gsap.fromTo(
        bottleImgRef.current,
        { rotation: -22, scale: 0.94 },
        { rotation: -16, scale: 1, duration: 0.65, ease: 'elastic.out(1.2, 0.45)' }
      );
    }
    setBurstTick((t) => t + 1);
  };

  // Swipe gestures on mobile for effortless flavor switching
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 55) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  // Entrance Berry Explosion + Continuous Floating + Scroll-Driven Fly-Out Choreography
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const rect = section.getBoundingClientRect();
      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.41;

      // 1. Center bottle spring entrance + gentle zero-g levitation
      if (bottleWrapRef.current && bottleImgRef.current) {
        gsap.fromTo(
          bottleImgRef.current,
          {
            y: prefersReduced ? 0 : 75,
            scale: prefersReduced ? 1 : 0.72,
            rotation: prefersReduced ? -16 : -28,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            rotation: -16,
            opacity: 1,
            duration: prefersReduced ? 0.2 : 0.95,
            ease: 'back.out(1.45)',
          }
        );

        if (!prefersReduced) {
          gsap.to(bottleWrapRef.current, {
            y: -12,
            duration: 2.9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.8,
          });
        }
      }

      // 2. Giant "Smoothie" calligraphy entrance
      if (scriptRef.current) {
        gsap.fromTo(
          scriptRef.current,
          { scale: prefersReduced ? 1 : 0.88, opacity: 0, y: prefersReduced ? 0 : 22 },
          { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.08 }
        );
      }

      // 3. Copy & CTA staggered rise
      if (copyRef.current) {
        const items = copyRef.current.querySelectorAll('[data-hero-stagger]');
        gsap.fromTo(
          items,
          { y: prefersReduced ? 0 : 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.25,
          }
        );
      }

      // 4. EXPLOSIVE BERRIES FLY-OUT ON LOAD / FLAVOR CHANGE
      activeFlavor.floatingFruits.forEach((fruit, idx) => {
        const outer = fruitLayerRefs.current[idx];
        const inner = fruitInnerRefs.current[idx];
        const img = fruitFloatRefs.current[idx];
        if (!outer || !inner || !img) return;

        const pos = isMobile ? fruit.mobilePos : fruit.desktopPos;
        const px = (parseFloat(pos.left) / 100) * rect.width;
        const py = (parseFloat(pos.top) / 100) * rect.height;
        const dxToCenter = centerX - px;
        const dyToCenter = centerY - py;

        // Burst radially outward from behind the smoothie bottle!
        gsap.fromTo(
          inner,
          {
            x: prefersReduced ? 0 : dxToCenter * 0.86,
            y: prefersReduced ? 0 : dyToCenter * 0.86,
            scale: prefersReduced ? 1 : 0.16,
            rotation: prefersReduced ? fruit.rotation : fruit.rotation + (idx % 2 === 0 ? -95 : 95),
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: fruit.rotation,
            opacity: 1,
            duration: prefersReduced ? 0.2 : 1.05,
            delay: prefersReduced ? 0 : 0.16 + idx * 0.042,
            ease: 'back.out(1.65)',
          }
        );

        // Independent organic zero-gravity levitation after burst
        if (!prefersReduced) {
          gsap.to(img, {
            y: (idx % 2 === 0 ? -1 : 1) * fruit.floatAmp,
            x: (idx % 3 === 0 ? 1 : -1) * (fruit.floatAmp * 0.42),
            rotation: idx % 2 === 0 ? 7 : -7,
            duration: fruit.floatDur,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.9 + idx * 0.12,
          });
        }

        // 5. SCROLL-DRIVEN BERRY FLY-OUT (berries accelerate radially outward as you scroll!)
        if (!prefersReduced) {
          gsap.to(outer, {
            x: `${fruit.flyOut.x}vw`,
            y: `${fruit.flyOut.y}vh`,
            rotation: fruit.flyOut.rot,
            scale: fruit.flyOut.scale,
            opacity: fruit.plane === 'bokeh' ? 0.15 : 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65,
            },
          });
        }
      });

      // Scroll parallax on bottle & calligraphy script
      if (!prefersReduced) {
        if (bottleImgRef.current) {
          gsap.to(bottleImgRef.current, {
            y: 120,
            rotation: -3,
            scale: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          });
        }
        if (scriptRef.current) {
          gsap.to(scriptRef.current, {
            y: -75,
            scale: 1.08,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          });
        }
      }
    }, section);

    return () => ctx.revert();
  }, [activeFlavor.id, isMobile, burstTick]);

  // Smooth desktop pointer parallax across depth planes
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (bottleWrapRef.current) {
        gsap.to(bottleWrapRef.current, {
          x: nx * -22,
          duration: 0.7,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      if (scriptRef.current) {
        gsap.to(scriptRef.current, {
          x: nx * 16,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      activeFlavor.floatingFruits.forEach((fruit, idx) => {
        const inner = fruitInnerRefs.current[idx];
        if (!inner) return;
        const dir = fruit.plane === 'bokeh' ? -1 : 1;
        gsap.to(inner, {
          x: nx * fruit.parallax * dir,
          y: ny * fruit.parallax * dir,
          duration: 0.85,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    section.addEventListener('mousemove', handleMove, { passive: true });
    return () => section.removeEventListener('mousemove', handleMove);
  }, [activeFlavor.id, activeFlavor.floatingFruits, isMobile]);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden px-5 pb-6 pt-5 text-white transition-colors duration-700 ease-out sm:px-9 sm:pb-8 sm:pt-7 lg:px-14 lg:pb-10 lg:pt-9"
      style={{ backgroundColor: activeFlavor.theme.bg }}
    >
      {/* Animated Organic Crimson/Theme Blobs */}
      <HeroBackdrop flavor={activeFlavor} blobRef={blobRef} />

      {/* TOP BAR — Faithful Circular Hamburger + Kylie's Brand Mark + Circular Cart */}
      <header className="relative z-50 flex items-center justify-between">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg shadow-black/15 transition-transform duration-300 hover:scale-108 active:scale-95 sm:h-12 sm:w-12"
          >
            <span className="flex flex-col gap-[4.5px]">
              <span
                className="block h-[2.2px] w-4 rounded-full transition-all duration-300 group-hover:w-5"
                style={{ backgroundColor: activeFlavor.theme.pillText }}
              />
              <span
                className="block h-[2.2px] w-4 rounded-full transition-all duration-300"
                style={{ backgroundColor: activeFlavor.theme.pillText }}
              />
              <span
                className="block h-[2.2px] w-3 rounded-full transition-all duration-300 group-hover:w-5"
                style={{ backgroundColor: activeFlavor.theme.pillText }}
              />
            </span>
          </button>

          <a
            href="#hero"
            className="group flex items-baseline gap-2 focus:outline-none"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              kylie&apos;s
            </span>
            <span className="hidden rounded-full border border-white/30 bg-white/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm md:inline-block">
              Fresh Cold-Blended
            </span>
          </a>
        </div>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 lg:flex">
          <button
            type="button"
            onClick={() => scrollToSection('#ingredients')}
            className="cursor-pointer transition-opacity hover:opacity-100 opacity-85"
          >
            Ingredients
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('#menu')}
            className="cursor-pointer transition-opacity hover:opacity-100 opacity-85"
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('#story')}
            className="cursor-pointer transition-opacity hover:opacity-100 opacity-85"
          >
            Our Craft
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('#bundle')}
            className="cursor-pointer transition-opacity hover:opacity-100 opacity-85"
          >
            Build a 6-Pack
          </button>
        </nav>

        <button
          ref={cartBtnRef}
          type="button"
          onClick={onOpenCart}
          aria-label={`Open shopping bag (${cartCount} items)`}
          className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg shadow-black/15 transition-transform duration-300 hover:scale-108 active:scale-95 sm:h-12 sm:w-12"
        >
          <ShoppingCart
            className="h-[19px] w-[19px] sm:h-5 sm:w-5"
            style={{ color: activeFlavor.theme.pillText }}
            strokeWidth={2.3}
          />
          {cartCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white shadow-md ring-2 ring-white"
              style={{ backgroundColor: '#1D1112' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* FLOATING FRUIT LAYER — MID & SOFT PLANES (BEHIND FOREGROUND BOKEH, FLY OUT ON LOAD & SCROLL!) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 overflow-visible"
      >
        {activeFlavor.floatingFruits.map((fruit, idx) => {
          if (fruit.hideOnMobile && isMobile) return null;
          const pos = isMobile ? fruit.mobilePos : fruit.desktopPos;
          const dim = isMobile ? fruit.size.mobile : fruit.size.desktop;
          const isBokeh = fruit.plane === 'bokeh';
          const filterClass =
            fruit.plane === 'bokeh'
              ? idx % 2 === 0
                ? 'bokeh-front'
                : 'bokeh-front-heavy'
              : fruit.plane === 'soft'
                ? 'bokeh-mid'
                : 'fruit-shadow';

          return (
            <div
              key={`${activeFlavor.id}-${fruit.id}`}
              ref={(el) => {
                fruitLayerRefs.current[idx] = el;
              }}
              className={`absolute will-change-transform ${isBokeh ? 'z-45' : 'z-30'}`}
              style={{
                left: pos.left,
                top: pos.top,
                width: `${dim}px`,
                height: `${dim}px`,
              }}
            >
              <div
                ref={(el) => {
                  fruitInnerRefs.current[idx] = el;
                }}
                className="h-full w-full will-change-transform"
              >
                <img
                  ref={(el) => {
                    fruitFloatRefs.current[idx] = el;
                  }}
                  src={fruit.src}
                  alt={fruit.alt}
                  draggable={false}
                  className={`h-full w-full select-none object-contain will-change-transform ${filterClass}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CENTERPIECE STAGE: Giant White "Smoothie" Script + Tilted Bottle + Copy + Flavor Switcher */}
      <div className="relative z-20 mx-auto my-auto flex w-full max-w-6xl flex-col items-center justify-center py-2 sm:py-4">
        {/* Script + Tilted Bottle Lockup */}
        <div className="relative flex w-full items-center justify-center py-4 sm:py-6 md:py-8">
          {/* GIANT HANDWRITTEN WHITE "Smoothie" CALLIGRAPHY BEHIND THE BOTTLE */}
          <div
            ref={scriptRef}
            aria-hidden="true"
            className="pointer-events-none select-none text-center will-change-transform"
          >
            <span className="font-script block -rotate-3 whitespace-nowrap text-[clamp(5.8rem,23vw,18rem)] leading-[0.82] font-normal tracking-wide text-white drop-shadow-[0_10px_28px_rgba(120,10,16,0.18)]">
              Smoothie
            </span>
          </div>

          {/* TILTED GLASS SMOOTHIE BOTTLE SITTING RIGHT IN FRONT OF THE "oo" */}
          <div
            ref={bottleWrapRef}
            className="absolute left-1/2 top-1/2 z-30 -translate-x-[53%] -translate-y-[53%] will-change-transform"
          >
            <button
              type="button"
              onClick={handleBottleTap}
              title="Tap to burst berries!"
              aria-label={`${activeFlavor.name} smoothie bottle — tap to replay berry burst`}
              className="group relative cursor-pointer focus:outline-none"
            >
              <img
                ref={bottleImgRef}
                key={activeFlavor.bottleImage}
                src={activeFlavor.bottleImage}
                alt={`Kylie's ${activeFlavor.name} bottle`}
                draggable={false}
                className="bottle-shadow h-[245px] w-auto select-none object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-[310px] md:h-[360px] lg:h-[405px]"
              />
            </button>
          </div>

          {/* RIGHT-SIDE FLAVOR SWITCHER (Desktop) — Positioned cleanly below "Smoothie", faithful to reference! */}
          <div className="absolute right-0 top-[96%] z-40 hidden -translate-y-1/2 items-center gap-4 md:flex lg:right-4">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous flavor"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/85 transition-all hover:bg-white/15 hover:text-white active:scale-90"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next flavor"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/85 transition-all hover:bg-white/15 hover:text-white active:scale-90"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-end gap-3.5">
              {otherFlavors.map((flav) => (
                <button
                  key={flav.id}
                  type="button"
                  onClick={() => onSelectFlavor(flav)}
                  title={`Switch to ${flav.name}`}
                  aria-label={`Switch to ${flav.name}`}
                  className="group relative flex cursor-pointer flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:scale-110 active:scale-95"
                >
                  <img
                    src={flav.bottleImage}
                    alt={flav.name}
                    draggable={false}
                    className="h-[74px] w-auto object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.28)] lg:h-[86px]"
                  />
                  <span className="mt-1.5 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    {flav.shortName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FLAVOR TITLE, SUBTITLE & PILL BUY NOW BUTTON */}
        <div
          ref={copyRef}
          className="relative z-40 mt-10 flex flex-col items-center text-center sm:mt-12 md:mt-14"
        >
          <p
            data-hero-stagger
            className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/95 backdrop-blur-sm sm:text-[11px]"
          >
            <Sparkles className="h-3 w-3" />
            Kylie&apos;s Signature Series
          </p>

          <h1
            data-hero-stagger
            className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-[2.85rem]"
          >
            {activeFlavor.name}
          </h1>

          <p
            data-hero-stagger
            className="mt-1.5 max-w-md px-4 text-sm font-normal text-white/90 sm:mt-2 sm:text-base"
          >
            {activeFlavor.tagline}
          </p>

          <div data-hero-stagger className="mt-5 flex flex-col items-center gap-4 sm:mt-6">
            <button
              ref={buyBtnRef}
              type="button"
              onClick={() => onAddToCart(activeFlavor, buyBtnRef.current)}
              className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-[0.12em] shadow-[0_14px_30px_rgba(70,8,12,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(70,8,12,0.36)] active:scale-95 sm:px-8 sm:py-4 sm:text-[13px]"
              style={{ color: activeFlavor.theme.pillText }}
            >
              <span>$ {activeFlavor.price.toFixed(2)}</span>
              <span className="h-3.5 w-[1.5px] opacity-35" style={{ backgroundColor: activeFlavor.theme.pillText }} />
              <span>BUY NOW</span>
            </button>

            {/* Mobile Flavor Switcher (touch-friendly + swipe supported) */}
            <div className="flex items-center gap-3 rounded-full bg-black/15 px-3 py-1.5 backdrop-blur-md md:hidden">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous flavor"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white active:scale-90"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5">
                {HERO_FLAVORS.map((flav) => {
                  const active = flav.id === activeFlavor.id;
                  return (
                    <button
                      key={flav.id}
                      type="button"
                      onClick={() => onSelectFlavor(flav)}
                      aria-label={`Select ${flav.name}`}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                        active
                          ? 'scale-110 bg-white/30 ring-2 ring-white'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={flav.bottleImage}
                        alt={flav.name}
                        className="h-8 w-auto object-contain"
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next flavor"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white active:scale-90"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO BOTTOM BAR — Faithful `INGREDIENTS —` Left + Scroll Cue + Social Icons Right */}
      <div className="relative z-40 flex items-center justify-between pt-2 text-xs font-semibold tracking-[0.2em] text-white/95">
        <button
          type="button"
          onClick={() => scrollToSection('#ingredients')}
          className="group inline-flex cursor-pointer items-center gap-2.5 uppercase transition-opacity hover:opacity-100 opacity-90"
        >
          <span>Ingredients</span>
          <span className="inline-block h-[1.5px] w-4 bg-white transition-all duration-300 group-hover:w-8" />
        </button>

        {/* Center subtle scroll indicator (desktop) */}
        <button
          type="button"
          onClick={() => scrollToSection('#ingredients')}
          aria-label="Scroll down to explore"
          className="hidden cursor-pointer items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/75 transition-colors hover:text-white sm:flex"
        >
          <span className="relative flex h-5 w-3.5 justify-center rounded-full border border-white/55">
            <span className="mt-1 h-1.5 w-1 animate-bounce rounded-full bg-white" />
          </span>
          <span>Scroll</span>
        </button>

        {/* Crisp Social Icons (Instagram, Facebook, X) matching reference */}
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href="#footer"
            aria-label="Kylie's on Instagram"
            className="opacity-90 transition-transform duration-200 hover:scale-115 hover:opacity-100"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="#footer"
            aria-label="Kylie's on Facebook"
            className="opacity-90 transition-transform duration-200 hover:scale-115 hover:opacity-100"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
          <a
            href="#footer"
            aria-label="Kylie's on X"
            className="opacity-90 transition-transform duration-200 hover:scale-115 hover:opacity-100"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
