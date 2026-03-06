"use client";

import { SlideIn, ScrollScale, MagneticHover } from "@/components/ui/scroll-animations";
import { FintechCard } from "@/components/site/fintech-card";
import type { Doc } from "../../../convex/_generated/dataModel";

type FintechDoc = Doc<"fintech">;

export function FintechAnimated({ fintech }: { fintech: FintechDoc[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {fintech.map((item, idx) => (
        <SlideIn
          key={item._id}
          from={idx % 2 === 0 ? "left" : "right"}
          distance={60}
          delay={Math.min(idx * 0.08, 0.3)}
          rotate={idx % 2 === 0 ? -1 : 1}
          scale={0.93}
          blur
        >
          <ScrollScale from={0.95} to={1}>
            <MagneticHover strength={0.1}>
              <FintechCard
                fintech={item}
                index={idx}
                featured={idx === 0 && fintech.length > 1}
              />
            </MagneticHover>
          </ScrollScale>
        </SlideIn>
      ))}
    </div>
  );
}
