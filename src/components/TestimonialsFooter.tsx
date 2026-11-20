import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, CheckCircle2, MapPin, Send, Star } from 'lucide-react';
import { FlavorItem } from '../data/flavors';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsFooterProps {
  activeFlavor: FlavorItem;
}

const REVIEWS = [
  {
    name: 'Maya Lin',
    role: 'Santa Monica, CA',
    flavor: 'Strawberry Fantasy',
    quote:
      'It genuinely tastes like biting into sun-warmed strawberries straight from the farmers market. Zero syrup aftertaste—just velvety, vibrant fruit.',
  },
  {
    name: 'Devon Carter',
    role: 'Brooklyn, NY',
    flavor: 'Emerald Glow',
    quote:
      'I used to dread green smoothies until Kylie’s. The kiwi and fresh mint balance the matcha so cleanly that I keep a weekly 6-pack in my fridge.',
  },
  {
    name: 'Sofia Alvarez',
    role: 'Austin, TX',
    flavor: 'Mango Sunrise',
    quote:
      'The heavy glass bottles arrive ice-cold and look gorgeous on the counter. Returning six bottles for a free refill is my favorite Sunday ritual.',
  },
];

export const TestimonialsFooter: React.FC<TestimonialsFooterProps> = ({ activeFlavor }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = reviewsRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-review-card]'),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      {/* Community Reviews */}
      <section className="bg-[#FFF9F6] px-5 pb-20 pt-16 sm:px-9 sm:pb-28 sm:pt-20 lg:px-14">
        <div ref={reviewsRef} className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D92B2B]">
                4.9 / 5 From 2,800+ Sippers
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[#1D1112] sm:text-4xl">
                Loved from first pour.
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[#F39C12]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="ml-2 text-sm font-bold text-[#1D1112]">Verified Fresh</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                data-review-card
                className="flex flex-col justify-between rounded-[2rem] border border-black/6 bg-white p-7 shadow-[0_14px_34px_rgba(29,17,18,0.05)]"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#F39C12]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-[#3E2E2F]">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-black/6 pt-4">
                  <div>
                    <p className="font-display text-sm font-bold text-[#1D1112]">{r.name}</p>
                    <p className="text-xs text-[#8A7374]">{r.role}</p>
                  </div>
                  <span className="rounded-full bg-[#FFF0EF] px-3 py-1 text-[11px] font-bold text-[#D92B2B]">
                    {r.flavor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bold Wavy Kylie's Footer */}
      <footer
        id="footer"
        className="relative overflow-hidden text-white transition-colors duration-700"
        style={{ backgroundColor: activeFlavor.theme.bg }}
      >
        {/* Top wave separator */}
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="block h-10 w-full sm:h-16"
        >
          <path
            d="M0,0 L1440,0 L1440,30 C1220,95 980,10 720,45 C460,80 220,10 0,55 Z"
            fill="#FFF9F6"
          />
        </svg>

        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-9 sm:pt-16 lg:px-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Brand + Newsletter */}
            <div className="lg:col-span-6">
              <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                kylie&apos;s
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/88 sm:text-base">
                Join the Kylie&apos;s Harvest Club for seasonal fruit drops, secret menu tastings, and 15% off your first chilled 6-pack with code{' '}
                <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs font-bold">
                  KYLIE15
                </span>
                .
              </p>

              {subscribed ? (
                <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-white/18 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md">
                  <CheckCircle2 className="h-5 w-5" />
                  Welcome to Kylie&apos;s! Check your inbox for your 15% code.
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 rounded-full border border-white/25 bg-white/15 px-5 py-3.5 text-sm text-white placeholder:text-white/70 backdrop-blur-md focus:border-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-lg transition-transform hover:scale-103 active:scale-95"
                    style={{ color: activeFlavor.theme.pillText }}
                  >
                    Join <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Links & Hours */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Explore
                </h4>
                <ul className="mt-4 space-y-2.5 text-sm font-medium text-white/90">
                  <li>
                    <a href="#ingredients" className="hover:underline">
                      Ingredients Lab
                    </a>
                  </li>
                  <li>
                    <a href="#menu" className="hover:underline">
                      Full Menu
                    </a>
                  </li>
                  <li>
                    <a href="#story" className="hover:underline">
                      Our Craft
                    </a>
                  </li>
                  <li>
                    <a href="#bundle" className="hover:underline">
                      Build a 6-Pack
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Flagship Bars
                </h4>
                <ul className="mt-4 space-y-2.5 text-sm text-white/90">
                  <li className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                    <span>Abbot Kinney Blvd, Venice</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                    <span>SoHo Crosby St, NYC</span>
                  </li>
                  <li className="text-xs text-white/75">Daily 7:30am – 7:00pm</li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Say Hi
                </h4>
                <p className="mt-4 text-sm text-white/90">hello@kyliessmoothies.com</p>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  Back to top <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Giant Editorial Watermark */}
          <div className="mt-12 border-t border-white/18 pt-8">
            <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/75 sm:flex-row">
              <p>© {new Date().getFullYear()} Kylie&apos;s Cold-Blended Smoothies. All rights reserved.</p>
              <p className="font-script text-2xl text-white/90">Made with 100% real fruit</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
