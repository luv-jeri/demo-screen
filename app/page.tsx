import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Hero card */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex flex-col items-center gap-6 rounded-2xl border bg-card p-12 shadow-sm transition-all duration-300 hover:shadow-lg">
          {/* Icon */}
          <div className="flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
            <Sparkles className="size-8 text-primary" />
          </div>
          
          {/* Text content */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to your dashboard
            </h1>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Select a page from the sidebar to get started. This modern app shell 
              is ready for you to build something amazing.
            </p>
          </div>
          
          {/* CTA hint */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
            <ArrowRight className="size-4 animate-pulse" />
            <span>Navigate using the sidebar</span>
          </div>
        </div>
      </div>

      {/* Quick stats placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
        {[
          { label: "Total Projects", value: "12" },
          { label: "Active Users", value: "847" },
          { label: "Revenue", value: "$24.5k" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 p-4 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-card hover:shadow-sm"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
