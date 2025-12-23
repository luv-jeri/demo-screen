"use client"

import React, { useId } from "react"

import { cn } from "@/lib/utils"

/**
 *  DotPattern Component Props
 *
 * @param {number} [width=16] - The horizontal spacing between dots
 * @param {number} [height=16] - The vertical spacing between dots
 * @param {number} [x=0] - The x-offset of the entire pattern
 * @param {number} [y=0] - The y-offset of the entire pattern
 * @param {number} [cx=1] - The x-offset of individual dots
 * @param {number} [cy=1] - The y-offset of individual dots
 * @param {number} [cr=1] - The radius of each dot
 * @param {string} [className] - Additional CSS classes to apply to the SVG container
 * @param {boolean} [glow=false] - Whether dots should have a subtle glow effect (CSS-based, performant)
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  glow?: boolean
  [key: string]: unknown
}

/**
 * DotPattern Component (Performance Optimized)
 *
 * Uses SVG <pattern> element for efficient rendering instead of individual circles.
 * This approach renders only ONE circle definition that gets repeated via the pattern,
 * eliminating the need for thousands of DOM elements.
 *
 * @component
 */
export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      )}
      {...props}
    >
      <defs>
        {/* Single pattern definition - GPU-efficient */}
        <pattern
          id={`${id}-pattern`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle 
            cx={cx} 
            cy={cy} 
            r={cr} 
            fill="currentColor"
            className={glow ? "opacity-60" : undefined}
          />
        </pattern>

        {/* Glow filter - optional, CSS-based for performance */}
        {glow && (
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Single rect that uses the pattern - renders all dots efficiently */}
      <rect 
        width="100%" 
        height="100%" 
        fill={`url(#${id}-pattern)`}
        filter={glow ? `url(#${id}-glow)` : undefined}
      />
    </svg>
  )
}
