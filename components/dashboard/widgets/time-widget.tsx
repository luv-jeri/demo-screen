"use client";

import * as React from "react";
import { type WidgetSize } from "@/components/bento-store";

interface WidgetProps {
  id?: string;
  size: WidgetSize;
}

export function TimeWidget({ size }: WidgetProps) {
  const [time, setTime] = React.useState<string>("");
  const isExpanded = size === "2x1";

  React.useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  if (isExpanded) {
     return (
        <div className="h-full flex flex-col justify-center">
            <div className="flex items-center justify-between px-2">
                <div>
                    <div className="text-4xl font-light text-foreground tracking-widest leading-none">{time}</div>
                    <div className="text-xs text-muted-foreground mt-1">New Delhi, IN</div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-emerald-500">+5:30</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Ahead</div>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-3xl font-light text-foreground tracking-widest">{time}</div>
      <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Local Time</div>
    </div>
  );
}
