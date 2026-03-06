const fs = require('fs');
const content = fs.readFileSync('src/components/site/hero.tsx', 'utf8');

const newContent = content.replace(
  /<div className="flex flex-col items-center gap-6 relative">.*?<\/h1>\n\s*<\/div>/s,
  `<div className="flex flex-col items-center gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[var(--brand-teal)]/10 blur-3xl -z-10 rounded-full mix-blend-screen" />
            <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-balance text-foreground sm:leading-[1.02] sm:tracking-[-0.04em] max-w-5xl mx-auto drop-shadow-sm">
              <span className="block">Central &amp; Eastern European</span>
              <span className="block text-gradient pb-2 relative">Association</span>
            </h1>
          </div>`
);

fs.writeFileSync('src/components/site/hero.tsx', newContent);
