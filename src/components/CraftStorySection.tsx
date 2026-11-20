import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Recycle, Sun } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    num: '01',
    icon: Sun,
    title: 'Picked at Dawn Ripeness',
    body: 'We partner directly with family berry growers in Watsonville and organic tropical orchards. Fruit is harvested at peak natural sweetness—never artificially ripened in cold storage.',
  },
  {
    num: '02',
    icon: Clock,
    title: 'Cold-Blended Within 6 Hours',
    body: 'Instead of heat pasteurization that dulls flavor and destroys Vitamin C, Kylie’s blends chilled fruit slowly under low-oxygen vacuum so every sip tastes freshly poured.',
  },
  {
    num: '03',
    icon: Recycle,
    title: 'Bottled in Reusable Glass',
    body: 'Plastic steals aroma. Our thick vintage glass bottles keep every strawberry seed and mint oil vibrant—bring back 6 empty bottles at Kylie’s for a complimentary smoothie.',
  },
];

export const CraftStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Trio of bottles fans out dynamically as you scroll!
      gsap.fromTo(
        el.querySelector('[data-trio-left]'),
        { x: 40, y: 40, rotation: -6, opacity: 0.5 },
        {
          x: -22,
          y: -14,
          rotation: -18,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 25%',
            scrub: 0.75,
          },
        }
      );

      gsap.fromTo(
        el.querySelector('[data-trio-right]'),
        { x: -40, y: 40, rotation: 6, opacity: 0.5 },
        {
          x: 22,
          y: -10,
          rotation: 16,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 25%',
            scrub: 0.75,
          },
        }
      );

      gsap.fromTo(
        el.querySelector('[data-trio-center]'),
        { y: 36, scale: 0.94 },
        {
          y: -22,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 25%',
            scrub: 0.75,
          },
        }
      );

      // Orbiting floating berries parallax
      el.querySelectorAll('[data-story-fruit]').forEach((node, i) => {
        gsap.fromTo(
          node,
          { y: 40 * (i % 2 === 0 ? 1 : -1), rotation: -20 },
          {
            y: -48 * (i % 2 === 0 ? 1 : -0.7),
            rotation: 26 * (i % 2 === 0 ? 1 : -1),
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      });

      // Vertical spine progress line
      gsap.fromTo(
        el.querySelector('[data-story-line]'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el.querySelector('[data-chapters]'),
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 0.5,
          },
        }
      );

      // Chapter reveals
      gsap.fromTo(
        el.querySelectorAll('[data-chapter-item]'),
        { x: 28, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el.querySelector('[data-chapters]'),
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FFF9F6] px-4 py-16 sm:px-8 sm:py-24 lg:px-14"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#1C1011] px-6 py-14 text-white shadow-[0_30px_80px_rgba(29,17,18,0.22)] sm:px-12 sm:py-20 lg:rounded-[3rem] lg:px-16 lg:py-24">
        {/* Ambient berry glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#EC3E3D]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#F39C12]/20 blur-3xl"
        />

        <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Left: Dynamic Scroll-Fanned Bottle Trio + Flying Fruits */}
          <div className="relative flex h-[340px] items-center justify-center sm:h-[420px] lg:col-span-5">
            {/* Giant watermark script */}
            <span
              aria-hidden="true"
              className="font-script pointer-events-none absolute select-none text-[8rem] text-white/[0.06] sm:text-[11rem]"
            >
              kylie&apos;s
            </span>

            {/* Floating fruits */}
            <img
              data-story-fruit
              src="/assets/fruit-strawberry-whole.webp"
              alt=""
              aria-hidden="true"
              className="fruit-shadow pointer-events-none absolute left-4 top-6 z-30 h-14 w-14 object-contain sm:h-18 sm:w-18"
            />
            <img
              data-story-fruit
              src="/assets/fruit-banana-slice.webp"
              alt=""
              aria-hidden="true"
              className="fruit-shadow pointer-events-none absolute right-5 top-10 z-30 h-14 w-14 object-contain sm:h-18 sm:w-18"
            />
            <img
              data-story-fruit
              src="/assets/fruit-mint-leaf.webp"
              alt=""
              aria-hidden="true"
              className="fruit-shadow pointer-events-none absolute bottom-10 left-8 z-30 h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
            <img
              data-story-fruit
              src="/assets/fruit-kiwi-slice.webp"
              alt=""
              aria-hidden="true"
              className="fruit-shadow pointer-events-none absolute bottom-6 right-8 z-30 h-14 w-14 object-contain sm:h-16 sm:w-16"
            />

            {/* Fanned Bottle Trio */}
            <img
              data-trio-left
              src="/assets/bottle-green.webp"
              alt="Kylie's Emerald Glow"
              className="bottle-shadow absolute z-10 h-56 w-auto object-contain sm:h-68"
            />
            <img
              data-trio-right
              src="/assets/bottle-mango.webp"
              alt="Kylie's Mango Sunrise"
              className="bottle-shadow absolute z-10 h-56 w-auto object-contain sm:h-68"
            />
            <img
              data-trio-center
              src="/assets/bottle-strawberry.webp"
              alt="Kylie's Strawberry Fantasy"
              className="bottle-shadow relative z-20 h-68 w-auto object-contain sm:h-82"
            />
          </div>

          {/* Right: Editorial Chapters */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#FF8A89]">
              The Kylie&apos;s Craft
            </span>
            <h2 className="font-display mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Crafted like a morning orchard, poured into glass.
            </h2>

            <div data-chapters className="relative mt-10 space-y-8 pl-8 sm:pl-10">
              {/* Background static track */}
              <div className="absolute bottom-2 left-2.5 top-2 w-[2px] rounded-full bg-white/15" />
              {/* Scroll-animated glowing fill line */}
              <div
                data-story-line
                className="absolute bottom-2 left-2.5 top-2 w-[2px] origin-top rounded-full bg-gradient-to-b from-[#FF7B7A] via-[#F39C12] to-[#34D399]"
              />

              {CHAPTERS.map((chap) => {
                const Icon = chap.icon;
                return (
                  <div key={chap.num} data-chapter-item className="relative">
                    <span className="absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#EC3E3D] text-[10px] font-extrabold text-white ring-4 ring-[#1C1011] sm:-left-[41px]">
                      {chap.num}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#FF8A89]" />
                      <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                        {chap.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/72 sm:text-base">
                      {chap.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
