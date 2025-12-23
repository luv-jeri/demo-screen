"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Search, 
  Settings2, 
  Activity, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import { useBentoStore, type WidgetSize } from "@/components/bento-store";
import { cn } from "@/lib/utils";

interface PromoWidgetProps {
    id: string; // Not used but required by interface
    size: WidgetSize;
}

const SLIDES = [
    {
        id: "ask",
        title: "Conversational Search",
        desc: "Ask anything about your assets.",
        icon: Search,
        color: "bg-blue-500",
        actionLabel: "Try asking",
        action: () => console.log("Simulate search")
    },
    {
        id: "edit",
        title: "Widget Customization",
        desc: "Tailor your home screen layout.",
        icon: Settings2,
        color: "bg-emerald-500",
        actionLabel: "Edit Home",
        isEditAction: true
    },
    {
        id: "preview",
        title: "Smart Previews",
        desc: "Crop, download, and share instantly.",
        icon: Eye,
        color: "bg-purple-500",
        actionLabel: "View Demo",
        action: () => console.log("Simulate preview")
    },
    {
        id: "pulse",
        title: "Team Pulse",
        desc: "See what's trending in your team.",
        icon: Activity,
        color: "bg-orange-500",
        actionLabel: "View Activity",
        action: () => console.log("Simulate pulse")
    }
];

export function PromoWidget({ size }: PromoWidgetProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);
    const toggleEditMode = useBentoStore((state) => state.toggleEditMode);

    const nextSlide = React.useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, []);

    const prevSlide = React.useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }, []);

    // Auto-play
    React.useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const handleAction = (slide: typeof SLIDES[0]) => {
        if (slide.isEditAction) {
            toggleEditMode();
        } else if (slide.action) {
            slide.action();
        }
    };

    const currentSlide = SLIDES[currentIndex];

    // Variants for slide animation
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden p-6 group">
            {/* Background Gradient - Dynamic based on slide */}
            <div className={cn(
                "absolute inset-0 opacity-[0.08] transition-colors duration-700",
                currentSlide.color
            )} />
             
            {/* Header / Nav */}
            <div className="flex items-center justify-between relative z-10 mb-2">
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                    <Sparkles className="size-3 text-white/60" />
                    <span className="text-[10px] uppercase tracking-wider font-medium text-white/60">New</span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevSlide} className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <ChevronLeft className="size-4" />
                    </button>
                    <button onClick={nextSlide} className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            {/* Content Carousel */}
            <div className="flex-1 relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex flex-col justify-center gap-3"
                    >
                         <div className={cn(
                             "size-10 rounded-2xl flex items-center justify-center mb-1 transition-colors duration-500",
                             currentSlide.color,
                             "bg-opacity-20 text-white"
                         )}>
                             <currentSlide.icon className="size-5" />
                         </div>

                         <div>
                             <h3 className="text-lg font-medium text-white leading-tight">
                                 {currentSlide.title}
                             </h3>
                             <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                 {currentSlide.desc}
                             </p>
                         </div>

                         {size !== "1x1" && (
                            <button 
                                onClick={() => handleAction(currentSlide)}
                                className="mt-2 w-fit flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white transition-colors group/btn"
                            >
                                {currentSlide.actionLabel}
                                <ArrowRight className="size-3 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                         )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-1.5 mt-auto relative z-10">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/20 hover:bg-white/40"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
