"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Settings2, 
  Activity, 
  Image as ImageIcon, 
  Filter,
  ChevronRight, 
  ChevronLeft,
  Share2,
  Download,
  Crop,
  MessageSquare,
  TrendingUp,
  Eye
} from "lucide-react";
import { useBentoStore, type WidgetSize } from "@/components/bento-store";
import { cn } from "@/lib/utils";

interface PromoWidgetProps {
    id: string;
    size: WidgetSize;
}

// Feature demo slides with Unsplash images and interactive demos
const SLIDES = [
    {
        id: "ask",
        title: "Conversational Search",
        desc: "Ask anything about your assets in natural language",
        icon: MessageSquare,
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
        gradient: "from-blue-600/90 via-blue-500/70 to-transparent",
        accent: "bg-blue-500",
        preview: {
            type: "chat",
            messages: [
                { q: "Find all brand assets from Q4 2024", a: "Found 47 brand assets..." },
                { q: "Show me the latest product photos", a: "Here are 12 product photos..." }
            ]
        },
        actionLabel: "Try Search",
        action: () => console.log("Open search")
    },
    {
        id: "preview",
        title: "Smart Asset Preview",
        desc: "Crop, download, and share instantly with one click",
        icon: ImageIcon,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        gradient: "from-purple-600/90 via-purple-500/70 to-transparent",
        accent: "bg-purple-500",
        preview: {
            type: "actions",
            actions: [
                { icon: Share2, label: "Share" },
                { icon: Download, label: "Download" },
                { icon: Crop, label: "Crop" }
            ]
        },
        actionLabel: "View Demo",
        action: () => console.log("Open preview")
    },
    {
        id: "pulse",
        title: "Team Pulse",
        desc: "See what's trending across your workspace",
        icon: Activity,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        gradient: "from-orange-600/90 via-orange-500/70 to-transparent",
        accent: "bg-orange-500",
        preview: {
            type: "stats",
            stats: [
                { label: "Top Searched", value: "Brand Guidelines" },
                { label: "Most Viewed", value: "Product Photos" }
            ]
        },
        actionLabel: "View Activity",
        action: () => console.log("Open activity")
    },
    {
        id: "customize",
        title: "Widget Customization",
        desc: "Tailor your dashboard to your workflow",
        icon: Settings2,
        image: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&auto=format&fit=crop&q=80",
        gradient: "from-emerald-600/90 via-emerald-500/70 to-transparent",
        accent: "bg-emerald-500",
        preview: {
            type: "customize"
        },
        actionLabel: "Customize",
        isEditAction: true
    },
    {
        id: "filters",
        title: "Smart Filters",
        desc: "Find exactly what you need with powerful filters",
        icon: Filter,
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80",
        gradient: "from-pink-600/90 via-pink-500/70 to-transparent",
        accent: "bg-pink-500",
        preview: {
            type: "filters",
            filters: ["Images", "Last 7 days", "Approved"]
        },
        actionLabel: "Apply Filters",
        action: () => console.log("Open filters")
    }
];

export function PromoWidget({ size }: PromoWidgetProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const toggleEditMode = useBentoStore((state) => state.toggleEditMode);

    const nextSlide = React.useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prevSlide = React.useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }, []);

    // Auto-play with pause on hover
    React.useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused]);

    const handleAction = (slide: typeof SLIDES[0]) => {
        if (slide.isEditAction) {
            toggleEditMode();
        } else if (slide.action) {
            slide.action();
        }
    };

    const currentSlide = SLIDES[currentIndex];
    const isCompact = size === "1x1";
    const isWide = size === "4x1" || size === "4x2" || size === "2x1";
    const isTall = size === "1x2" || size === "2x2" || size === "4x2";

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        })
    };

    // Compact 1x1 size - just icon and title
    if (isCompact) {
        return (
            <div 
                className="relative w-full h-full overflow-hidden cursor-pointer group"
                onClick={() => handleAction(currentSlide)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${currentSlide.image})` }}
                />
                <div className={cn("absolute inset-0 bg-gradient-to-t", currentSlide.gradient)} />
                
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className={cn("p-2.5 rounded-xl mb-2", currentSlide.accent, "bg-opacity-80")}>
                        <currentSlide.icon className="size-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white/90 line-clamp-2">{currentSlide.title}</span>
                </div>

                {/* Dots */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {SLIDES.map((_, idx) => (
                        <div key={idx} className={cn(
                            "h-1 rounded-full transition-all",
                            idx === currentIndex ? "w-3 bg-white" : "w-1 bg-white/30"
                        )} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div 
            className="relative w-full h-full overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url(${currentSlide.image})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-r",
                        currentSlide.gradient
                    )} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Content */}
                    <div className={cn(
                        "relative h-full flex p-6",
                        isWide ? "flex-row items-center gap-8" : "flex-col justify-end"
                    )}>
                        {/* Text Content */}
                        <div className={cn("flex-1", isWide && "max-w-md")}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className={cn("p-2 rounded-xl", currentSlide.accent)}>
                                    <currentSlide.icon className="size-4 text-white" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Discover</span>
                            </div>
                            
                            <h3 className={cn(
                                "font-semibold text-white leading-tight mb-2",
                                isTall ? "text-2xl" : "text-lg"
                            )}>
                                {currentSlide.title}
                            </h3>
                            
                            <p className="text-sm text-white/70 mb-4 line-clamp-2">
                                {currentSlide.desc}
                            </p>

                            {/* CTA Button */}
                            <button 
                                onClick={() => handleAction(currentSlide)}
                                className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    "bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95"
                                )}
                            >
                                {currentSlide.actionLabel}
                                <ChevronRight className="size-4" />
                            </button>
                        </div>

                        {/* Preview Demo Card - Only on larger sizes */}
                        {(isTall || isWide) && (
                            <div className={cn(
                                "flex-shrink-0 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-4",
                                isWide ? "w-64" : "w-full mt-4"
                            )}>
                                {/* Chat Preview */}
                                {currentSlide.preview.type === "chat" && (
                                    <div className="space-y-3">
                                        {currentSlide.preview.messages?.slice(0, 2).map((msg, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex items-start gap-2">
                                                    <Search className="size-3 text-blue-400 mt-0.5 shrink-0" />
                                                    <span className="text-xs text-white/90">{msg.q}</span>
                                                </div>
                                                <div className="pl-5 text-[11px] text-white/50">{msg.a}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions Preview */}
                                {currentSlide.preview.type === "actions" && (
                                    <div className="flex justify-around">
                                        {currentSlide.preview.actions?.map((action, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer group/action">
                                                <div className="p-3 bg-white/10 rounded-xl group-hover/action:bg-white/20 transition-colors">
                                                    <action.icon className="size-4 text-white" />
                                                </div>
                                                <span className="text-[10px] text-white/60">{action.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Stats Preview */}
                                {currentSlide.preview.type === "stats" && (
                                    <div className="space-y-3">
                                        {currentSlide.preview.stats?.map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="size-3 text-orange-400" />
                                                    <span className="text-[11px] text-white/60">{stat.label}</span>
                                                </div>
                                                <span className="text-xs text-white font-medium">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Customize Preview */}
                                {currentSlide.preview.type === "customize" && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1,2,3,4,5,6].map((i) => (
                                            <div key={i} className={cn(
                                                "aspect-square rounded-lg",
                                                i <= 3 ? "bg-emerald-500/30" : "bg-white/10"
                                            )} />
                                        ))}
                                    </div>
                                )}

                                {/* Filters Preview */}
                                {currentSlide.preview.type === "filters" && (
                                    <div className="flex flex-wrap gap-2">
                                        {currentSlide.preview.filters?.map((filter, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-[11px] text-pink-300">
                                                {filter}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={prevSlide}
                    className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
                >
                    <ChevronLeft className="size-4 text-white" />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={nextSlide}
                    className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
                >
                    <ChevronRight className="size-4 text-white" />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {SLIDES.map((slide, idx) => (
                    <button
                        key={slide.id}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            idx === currentIndex 
                                ? "w-6 bg-white" 
                                : "w-1.5 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>

            {/* Feature Chips - Bottom row on wide layouts */}
            {isWide && (
                <div className="absolute bottom-12 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {SLIDES.map((slide, idx) => (
                        <button
                            key={slide.id}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all",
                                idx === currentIndex 
                                    ? "bg-white text-black" 
                                    : "bg-white/10 text-white/70 hover:bg-white/20"
                            )}
                        >
                            <slide.icon className="size-3" />
                            <span className="hidden sm:inline">{slide.title.split(" ")[0]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
