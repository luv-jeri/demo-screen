"use client";

import { MoreHorizontal, FileText, Image as ImageIcon, Music } from "lucide-react";
import { type WidgetSize } from "@/components/bento-store";

interface WidgetProps {
  id?: string;
  size: WidgetSize;
}

export function QuickActionsWidget({ size }: WidgetProps) {
  const actions = [
    { label: "New Doc", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Upload", icon: ImageIcon, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Record", icon: Music, color: "text-pink-400", bg: "bg-pink-500/10" },
  ];

  if (size === "1x1") {
     return (
       <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1 -m-6">
          <button className="flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors">
             <FileText className="size-4" />
          </button>
          <button className="flex items-center justify-center bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-purple-400 transition-colors">
             <ImageIcon className="size-4" />
          </button>
          <button className="flex items-center justify-center bg-pink-500/10 hover:bg-pink-500/20 rounded-lg text-pink-400 transition-colors">
             <Music className="size-4" />
          </button>
          <button className="flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground transition-colors">
             <MoreHorizontal className="size-4" />
          </button>
       </div>
     );
  }

  return (
    <div className="h-full flex flex-col justify-center">
       <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MoreHorizontal className="size-3" /> Quick Actions
       </div>
       <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => (
             <button 
               key={action.label}
               className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
             >
                <div className={`p-2 rounded-md ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                   <action.icon className="size-4" />
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-white">{action.label}</span>
             </button>
          ))}
       </div>
    </div>
  );
}
