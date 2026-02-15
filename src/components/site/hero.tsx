"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

export function Hero() {
  return (
    <section className="relative pt-10 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] bg-[radial-gradient(circle,var(--danube)_0%,transparent_70%)] opacity-20 blur-[100px]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-1/4 -top-1/2 h-[600px] w-[600px] bg-[radial-gradient(circle,var(--carmine)_0%,transparent_70%)] opacity-20 blur-[100px]"
        />
      </div>

      <div className="grid gap-12 border-b border-black/10 pb-16 dark:border-white/10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <FadeInStagger className="space-y-8">
          <FadeIn>
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
              <span className="h-px w-8 bg-black/20 dark:bg-white/20" />
              <span>Milan</span>
              <span className="h-1 w-1 rounded-full bg-black/20 dark:bg-white/20" />
              <span>Est. 2024</span>
            </div>
          </FadeIn>

          <FadeIn>
            <h1 className="font-display text-6xl leading-[0.9] tracking-tighter sm:text-7xl lg:text-8xl">
              Build the bridge.
              <span className="block text-black/40 dark:text-white/40">
                Culture. Careers.
                <br />
                Community.
              </span>
            </h1>
          </FadeIn>

          <FadeIn>
            <p className="max-w-xl text-lg leading-relaxed text-black/70 dark:text-white/70">
              The central hub for students connected to Central & Eastern Europe at
              Bocconi University. Flagship events, career acceleration, and a network
              that spans the region.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/events"
                className="group inline-flex items-center justify-center bg-black px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Upcoming events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center border border-black/10 px-8 py-4 text-sm font-medium text-black transition-colors hover:border-black hover:bg-transparent dark:border-white/10 dark:text-white dark:hover:border-white"
              >
                Sponsor us
              </Link>
            </div>
          </FadeIn>
        </FadeInStagger>

        <FadeIn delay={0.3} className="relative hidden lg:block">
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-black/10 via-black/5 to-transparent dark:from-white/10 dark:via-white/5" />

          <div className="pl-12 pt-4">
            <h2 className="mb-8 font-mono text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
              Core Pillars
            </h2>
            <div className="space-y-12">
              <Pillar
                number="01"
                title="Flagship Events"
                desc="Signature nights and panels that define the semester."
              />
              <Pillar
                number="02"
                title="Career Bridge"
                desc="Direct line to companies and alumni across the CEE region."
              />
              <Pillar
                number="03"
                title="Culture & Belonging"
                desc="A home away from home. Dinners, trips, and community."
              />
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Mobile Pillars */}
      <FadeIn delay={0.4} className="mt-12 lg:hidden">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
          Core Pillars
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <Pillar
            number="01"
            title="Flagship"
            desc="Signature nights and panels."
          />
          <Pillar
            number="02"
            title="Careers"
            desc="Direct line to companies."
          />
          <Pillar
            number="03"
            title="Community"
            desc="A home away from home."
          />
        </div>
      </FadeIn>
    </section>
  );
}

function Pillar({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group">
      <div className="mb-2 font-mono text-xs text-black/30 dark:text-white/30">
        {number}
      </div>
      <div className="font-display text-xl leading-none group-hover:text-[color:var(--danube)] transition-colors">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
        {desc}
      </p>
    </div>
  );
}



