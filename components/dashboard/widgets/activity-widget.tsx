"use client";

import { FileText } from "lucide-react";
import { type WidgetSize } from "@/components/bento-store";

interface WidgetProps {
  id?: string;
  size: WidgetSize;
}

export function ActivityWidget({ size }: WidgetProps) {
  const activities = [
    { user: "Sarah", action: "edited", file: "Q3_Report.pdf", time: "2m ago" },
    { user: "Mike", action: "uploaded", file: "Hero_Image_v2.png", time: "15m ago" },
    { user: "Anna", action: "commented", file: "Project_Nebula", time: "1h ago" },
  ];

  if (size === "1x1") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-1">
         <div className="text-2xl font-bold text-white">12</div>
         <div className="text-[10px] text-muted-foreground uppercase text-center leading-tight">New<br/>Updates</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center gap-2 mb-3">
          <FileText className="size-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-300">Recent Activity</span>
       </div>
       <div className="space-y-3">
          {activities.map((item, i) => (
             <div key={i} className="flex items-start gap-2 text-xs">
                 <div className="size-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                 <div>
                    <span className="text-zinc-300 font-medium">{item.user}</span>
                    <span className="text-muted-foreground"> {item.action} </span>
                    <span className="text-white">{item.file}</span>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
}
