import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Menu, ShoppingCart } from 'lucide-react';
import { FlavorItem, HERO_FLAVORS } from './data/flavors';
import { HeroSection } from './components/HeroSection';
import { MarqueeStrip } from './components/MarqueeStrip';
import { IngredientsSection } from './components/IngredientsSection';
import { MenuSection } from './components/MenuSection';
import { CraftStorySection } from './components/CraftStorySection';
import { BuildBoxSection } from './components/BuildBoxSection';
import { TestimonialsFooter } from './components/TestimonialsFooter';
import { CartDrawer, CartEntry } from './components/CartDrawer';
import { NavigationDrawer } from './components/NavigationDrawer';
import { FlavorModal } from './components/FlavorModal';

gsap.registerPlugin(ScrollTrigger);

interface FlyingBerry {
  id: number;
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function App() {
  const [activeFlavor, setActiveFlavor] = useState<FlavorItem>(HERO_FLAVORS[0]);
  const [cart, setCart] = useState<CartEntry[]>([
    { flavor: HERO_FLAVORS[0], quantity: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inspectedFlavor, setInspectedFlavor] = useState<FlavorItem | null>(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [flyingBerries, setFlyingBerries] = useState<FlyingBerry[]>([]);

  const heroCartBtnRef = useRef<HTMLButtonElement | null>(null);
  const floatingCartBtnRef = useRef<HTMLButtonElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Silky Lenis Smooth Scroll synced cleanly to GSAP ScrollTrigger
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Show sleek compact floating header bar once scrolled past hero
  useEffect(() => {
    const onScroll = () => {
      setShowFloatingBar(window.scrollY > window.innerHeight * 0.72);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync theme-color meta tag with active flavor
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', activeFlavor.theme.bg);
  }, [activeFlavor.theme.bg]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 2600);
  };

  // Launch a real flying berry/fruit straight into the shopping cart icon!
  const triggerFlyingBerry = (flavor: FlavorItem, triggerEl?: HTMLElement | null) => {
    const targetBtn = showFloatingBar ? floatingCartBtnRef.current : heroCartBtnRef.current;
    if (!triggerEl || !targetBtn) return;

    const startRect = triggerEl.getBoundingClientRect();
    const endRect = targetBtn.getBoundingClientRect();

    const berrySrc =
      flavor.category === 'greens'
        ? '/assets/fruit-kiwi-slice.webp'
        : flavor.category === 'tropical'
          ? '/assets/fruit-mango-slice.webp'
          : '/assets/fruit-strawberry-whole.webp';

    const id = Date.now() + Math.random();
    const particle: FlyingBerry = {
      id,
      src: berrySrc,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: endRect.left + endRect.width / 2,
      endY: endRect.top + endRect.height / 2,
    };

    setFlyingBerries((prev) => [...prev, particle]);

    // Bounce the cart button when berry arrives
    setTimeout(() => {
      if (targetBtn) {
        gsap.fromTo(
          targetBtn,
          { scale: 1 },
          { scale: 1.24, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
      }
      setFlyingBerries((prev) => prev.filter((b) => b.id !== id));
    }, 680);
  };

  const handleAddToCart = (flavor: FlavorItem, triggerEl?: HTMLElement | null) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.flavor.id === flavor.id);
      if (existing) {
        return prev.map((e) =>
          e.flavor.id === flavor.id ? { ...e, quantity: e.quantity + 1 } : e
        );
      }
      return [...prev, { flavor, quantity: 1 }];
    });
    triggerFlyingBerry(flavor, triggerEl);
    showToast(`Added ${flavor.name} to your Kylie's bag`);
  };

  const handleAddBundleToCart = (flavors: FlavorItem[]) => {
    setCart((prev) => {
      const next = [...prev];
      for (const f of flavors) {
        const idx = next.findIndex((e) => e.flavor.id === f.id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          next.push({ flavor: f, quantity: 1 });
        }
      }
      return next;
    });
    setCartOpen(true);
    showToast(`Added ${flavors.length} bottles to your Kylie's bag!`);
  };

  const handleUpdateQty = (flavorId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((e) =>
          e.flavor.id === flavorId ? { ...e, quantity: e.quantity + delta } : e
        )
        .filter((e) => e.quantity > 0)
    );
  };

  const handleRemove = (flavorId: string) => {
    setCart((prev) => prev.filter((e) => e.flavor.id !== flavorId));
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F6] text-[#1D1112]">
      {/* Persistent Compact Floating Pill Header (appears smoothly once scrolled past Hero) */}
      <div
        className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transition-all duration-400 ${
          showFloatingBar
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-6 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between rounded-full border border-black/8 bg-white/88 px-3 py-2 shadow-[0_14px_34px_rgba(29,17,18,0.12)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/5 text-[#1D1112] transition-colors hover:bg-black/10"
          >
            <Menu className="h-4 w-4" />
          </button>

          <a
            href="#hero"
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: activeFlavor.theme.pillText }}
          >
            kylie&apos;s
          </a>

          <button
            ref={floatingCartBtnRef}
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping bag"
            className="relative flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
            style={{ backgroundColor: activeFlavor.theme.bg }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{totalCount}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <HeroSection
          activeFlavor={activeFlavor}
          onSelectFlavor={setActiveFlavor}
          onAddToCart={handleAddToCart}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartCount={totalCount}
          cartBtnRef={heroCartBtnRef}
        />

        <MarqueeStrip activeFlavor={activeFlavor} />

        <IngredientsSection
          activeFlavor={activeFlavor}
          onSelectFlavor={setActiveFlavor}
          onAddToCart={handleAddToCart}
        />

        <MenuSection
          onAddToCart={handleAddToCart}
          onInspectFlavor={setInspectedFlavor}
        />

        <CraftStorySection />

        <BuildBoxSection onAddBundleToCart={handleAddBundleToCart} />

        <TestimonialsFooter activeFlavor={activeFlavor} />
      </main>

      {/* Flying Berry Arc Particles */}
      {flyingBerries.map((b) => (
        <FlyingBerryParticle key={b.id} berry={b} />
      ))}

      {/* Subtle Floating Toast */}
      {toastMsg && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2">
          <div className="flex items-center gap-2.5 rounded-full bg-[#1D1112] px-5 py-3 text-xs font-bold text-white shadow-xl sm:text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: activeFlavor.theme.bg }}
            />
            {toastMsg}
          </div>
        </div>
      )}

      {/* Overlays */}
      <NavigationDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeFlavor={activeFlavor}
        onSelectFlavor={setActiveFlavor}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClear={() => setCart([])}
        accentColor={activeFlavor.theme.bg}
      />

      <FlavorModal
        flavor={inspectedFlavor}
        onClose={() => setInspectedFlavor(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

const FlyingBerryParticle: React.FC<{ berry: FlyingBerry }> = ({ berry }) => {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      {
        x: berry.startX - 22,
        y: berry.startY - 22,
        scale: 0.7,
        rotation: -30,
        opacity: 1,
      },
      {
        x: berry.endX - 18,
        y: berry.endY - 18,
        scale: 0.35,
        rotation: 260,
        opacity: 0.2,
        duration: 0.66,
        ease: 'power2.inOut',
      }
    );
  }, [berry]);

  return (
    <img
      ref={ref}
      src={berry.src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[120] h-11 w-11 object-contain drop-shadow-lg"
    />
  );
};

export default App;
