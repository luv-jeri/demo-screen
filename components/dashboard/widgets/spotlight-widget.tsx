"use client";

import { Play, Star, Heart } from "lucide-react";
import { type WidgetSize } from "@/components/bento-store";

interface SpotlightProps {
  size: WidgetSize;
}

export function SpotlightWidget({ size }: SpotlightProps) {
  /* 
     SIZE: 1x1 (Small) - Hero Icon
  */
  if (size === "1x1") {
    return (
      <div className="relative h-full w-full flex items-center justify-center -m-6 p-6 group cursor-pointer overflow-hidden">
         {/* Background Image - Full Bleed */}
         <div 
           className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')" }}
         />
         <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
         
         <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:scale-110 transition-transform shadow-xl">
               <Play className="size-5 text-white fill-white translate-x-0.5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
               Featured
            </span>
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x1 (Medium) - Thumbnail Card
  */
  if (size === "2x1") {
    return (
      <div className="relative h-full w-full flex flex-row -m-6 p-0 group overflow-hidden cursor-pointer">
          {/* Left Image Section */}
          <div className="relative w-1/2 h-full overflow-hidden">
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop')" }}
             />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right Content Section */}
          <div className="w-1/2 h-full p-4 flex flex-col justify-center bg-zinc-900/40 backdrop-blur-sm">
             <div className="flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[9px] font-bold text-purple-300 uppercase tracking-wide">
                   New Arrival
                </span>
             </div>
             <h3 className="text-sm font-bold text-white leading-tight mb-1.5 group-hover:text-purple-400 transition-colors">
                Project Nebula
             </h3>
             <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                Advanced neural interfacing for creative workflows.
             </p>
          </div>
      </div>
    );
  }

  /* 
     SIZE: 2x2, 4x1, 4x2 (Large/Full) - Hero Banner
  */
  return (
    <div className="relative h-full w-full -m-6 p-6 flex flex-col justify-end group overflow-hidden cursor-pointer">
       {/* Full Background */}
       <div 
         className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop')" }}
       />
       
       {/* Gradient Overlay */}
       <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90" />

       {/* Floating Badge */}
       <div className="absolute top-4 right-4 z-10">
          <button className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
             <Heart className="size-4" />
          </button>
       </div>

       {/* Content */}
       <div className="relative z-10 w-full max-w-md space-y-3 p-2">
          <div className="flex items-center gap-2">
             <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Spotlight
             </span>
             <div className="flex items-center gap-1 text-xs text-zinc-300">
                <Star className="size-3 text-yellow-400 fill-yellow-400" />
                <span>4.9 (2k)</span>
             </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white font-heading leading-none drop-shadow-md">
             Future of AI Design
          </h1>
          
          <p className="text-sm text-zinc-200 line-clamp-2 drop-shadow-sm font-medium">
             Explore the next generation of generative tools. Create stunning visuals in seconds with our new engine.
          </p>
          
          <div className="pt-2 flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors">
                <Play className="size-3 fill-black" />
                Watch Demo
             </button>
             <button className="px-5 py-2 bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">
                Details
             </button>
          </div>
       </div>
    </div>
  );
}
