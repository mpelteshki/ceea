"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const locales = [
    { code: "en", label: "English" },
    { code: "it", label: "Italiano" },
    { code: "bg", label: "Български" },
] as const;

export function LanguagePicker() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleCreateSelection = (nextLocale: string) => {
        setIsOpen(false);
        router.replace(pathname, { locale: nextLocale });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuId = useId();

    return (
        <div className="relative z-50" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={menuId}
                aria-label="Select language"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--accents-5)] transition-colors hover:bg-[var(--accents-1)] hover:text-[var(--foreground)]"
            >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{locale}</span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id={menuId}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-lg border border-[var(--accents-2)] bg-[var(--background)] shadow-lg"
                    >
                        <div className="p-1" role="listbox" aria-label="Available languages">
                            {locales.map((l) => (
                                <button
                                    key={l.code}
                                    role="option"
                                    aria-selected={locale === l.code}
                                    onClick={() => handleCreateSelection(l.code)}
                                    className={cn(
                                        "relative flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--accents-1)]",
                                        locale === l.code && "bg-[var(--accents-1)] font-medium"
                                    )}
                                >
                                    {l.label}
                                    {locale === l.code && <Check className="h-3 w-3" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
