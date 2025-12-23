import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden border border-border bg-background p-2 px-6 text-center font-semibold",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-accent transition-all duration-500 ease-out group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-500 ease-out group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-accent-foreground opacity-0 transition-all duration-500 ease-out group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="size-4" />
      </div>
    </button>
  )
}
