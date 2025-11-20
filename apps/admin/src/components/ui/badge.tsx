import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:ring-offset-2 dark:focus:ring-[#0A84FF]/20",
  {
    variants: {
      variant: {
        default: "border-[#007AFF] bg-[#007AFF] text-white shadow-[0_1px_2px_rgba(0,122,255,0.15)]",
        secondary: "border-[#34C759] bg-[#34C759] text-white shadow-[0_1px_2px_rgba(52,199,89,0.15)]",
        destructive: "border-[#FF3B30] bg-[#FF3B30] text-white shadow-[0_1px_2px_rgba(255,59,48,0.15)]",
        outline: "border-[#E5E5EA] bg-transparent text-[#000000] dark:border-[#38383A] dark:text-white",
        muted: "border-[#D5D5D7] bg-[#F2F2F7] text-[#666666] dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-[#A1A1A6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
