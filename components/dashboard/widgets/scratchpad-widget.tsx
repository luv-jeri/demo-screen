"use client";

import { Sparkles, History, Send, Bot } from "lucide-react";

import { type WidgetSize } from "@/components/bento-store";

interface ScratchpadProps {
  size: WidgetSize;
}

export function ScratchpadWidget({ size }: ScratchpadProps) {
  /* 
     SIZE: 1x1 (Small) - Icon Only / Shortcut
  */
  if (size === "1x1") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3 cursor-pointer group -m-6 p-6 overflow-hidden relative">
         <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         
         <div className="relative p-3.5 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-indigo-500/40">
            <Sparkles className="size-6 text-white" />
         </div>
         <span className="relative text-[10px] font-bold text-indigo-300 uppercase tracking-wide group-hover:text-white transition-colors">
            Ask AI
         </span>
      </div>
    );
  }

  /* 
     SIZE: 2x1 (Medium) - Input Bar
  */
  if (size === "2x1") {
    return (
      <div className="h-full flex flex-col justify-center">
         <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">Quick Prompt</span>
         </div>
         <div className="relative">
            <input 
               type="text" 
               placeholder="Draft an email to..."
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-colors">
               <Send className="size-3" />
            </button>
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x2, 4x1, etc (Large) - History + Input
  */
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <Bot className="size-5 text-indigo-500" />
             <h3 className="text-sm font-bold text-white">AI Scratchpad</h3>
          </div>
          <button className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
             <History className="size-3" />
             History
          </button>
       </div>

       <div className="flex-1 bg-white/5 rounded-xl p-3 mb-3 overflow-y-auto space-y-3 custom-scrollbar">
          <div className="text-xs text-right">
             <span className="bg-indigo-500/20 text-indigo-200 px-3 py-1.5 rounded-lg inline-block rounded-tr-none">
                Summarize the Q3 report
             </span>
          </div>
          <div className="text-xs">
             <span className="bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg inline-block rounded-tl-none leading-relaxed">
                <span className="text-indigo-400 font-bold block mb-1">AI Assistant</span>
                Q3 revenue increased by 15% YoY, driven primarily by enterprise adoption...
             </span>
          </div>
       </div>

       <div className="relative mt-auto">
          <input 
             type="text" 
             placeholder="Ask anything..."
             className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button className="absolute right-2 top-2 p-1.5 text-indigo-400 hover:text-indigo-300 transition-colors">
             <Sparkles className="size-4" />
          </button>
       </div>
    </div>
  );
}
