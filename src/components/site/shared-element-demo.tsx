"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const items = [
    {
        id: "1",
        subtitle: "Product Management",
        title: "Quarterly Roadmap",
        img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
        description: "Deep dive into our strategic goals for Q3, focusing on user retention and expanding our mobile footprint.",
    },
    {
        id: "2",
        subtitle: "Engineering",
        title: "System Architecture",
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
        description: "Detailed breakdown of our microservices migration plan and database optimization strategies.",
    },
    {
        id: "3",
        subtitle: "Design",
        title: "Design System 2.0",
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
        description: "Introducing our new coherent design language, including updated typography, color palettes, and component library.",
    },
    {
        id: "4",
        subtitle: "Marketing",
        title: "Campaign Launch",
        img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop",
        description: "Overview of the upcoming marketing blitz for our flagship product, targeting key demographics across social media.",
    },
];

export function SharedElementDemo() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // When an item is selected, find its data
    const selectedItem = items.find((item) => item.id === selectedId);

    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                        Shared Element Transitions
                    </h1>
                    <p className="mt-4 text-base text-[var(--accents-5)] sm:text-lg">
                        Click on a card to see it seamlessly expand into a detail view using{" "}
                        <code className="rounded bg-[var(--accents-2)] px-1.5 py-0.5 text-sm font-medium text-[var(--foreground)]">
                            layoutId
                        </code>
                        .
                    </p>
                </header>

                {/* Grid of items */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <motion.div
                            layoutId={item.id}
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className="cursor-pointer overflow-hidden rounded-2xl bg-[var(--accents-1)] shadow-sm hover:shadow-md transition-shadow"
                        >
                            <motion.div layoutId={`img-container-${item.id}`} className="aspect-[4/3] w-full overflow-hidden">
                                <motion.img
                                    layoutId={`img-${item.id}`}
                                    src={item.img}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>
                            <motion.div layoutId={`content-${item.id}`} className="p-5">
                                <motion.h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--accents-5)] mb-1">
                                    {item.subtitle}
                                </motion.h5>
                                <motion.h2 className="text-xl font-bold text-[var(--foreground)]">
                                    {item.title}
                                </motion.h2>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal Overlay */}
                <AnimatePresence>
                    {selectedId && selectedItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                            onClick={() => setSelectedId(null)} // Click outside to close
                        >
                            <motion.div
                                layoutId={selectedId}
                                className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--background)] shadow-2xl"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            >
                                {/* Close Button */}
                                <motion.button
                                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
                                    onClick={() => setSelectedId(null)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <X size={16} />
                                </motion.button>

                                <motion.div layoutId={`img-container-${selectedItem.id}`} className="aspect-[16/9] w-full overflow-hidden">
                                    <motion.img
                                        layoutId={`img-${selectedItem.id}`}
                                        src={selectedItem.img}
                                        alt={selectedItem.title}
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>

                                <motion.div layoutId={`content-${selectedItem.id}`} className="p-8">
                                    <motion.h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--accents-5)] mb-2">
                                        {selectedItem.subtitle}
                                    </motion.h5>
                                    <motion.h2 className="text-3xl font-bold text-[var(--foreground)] mb-4 leading-tight">
                                        {selectedItem.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.1 }} // Slight delay for content that wasn't in the card
                                        className="text-[var(--accents-6)] leading-relaxed"
                                    >
                                        {selectedItem.description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-8 pt-6 border-t border-[var(--accents-2)]"
                                    >
                                        <button
                                            className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm font-semibold text-[var(--background)] transition-transform active:scale-[0.98]"
                                            onClick={() => alert("This is a demo action!")}
                                        >
                                            Read Full Article
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
