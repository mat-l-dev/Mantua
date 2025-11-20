'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Apple Design System - Button Component
 * Refined minimalist button with subtle shadows, smooth transitions, and Apple-style interactions
 * Includes improved focus states, hover effects, and active states with proper visual hierarchy
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 dark:focus-visible:ring-[#0A84FF]/20",
  {
    variants: {
      variant: {
        default:
          "bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.25)] hover:shadow-[0_4px_16px_rgba(0,122,255,0.3)] hover:bg-[#0051D5] active:bg-[#003E9C] active:shadow-[0_1px_4px_rgba(0,122,255,0.2)]",
        secondary:
          "bg-[#34C759] text-white shadow-[0_2px_8px_rgba(52,199,89,0.25)] hover:shadow-[0_4px_16px_rgba(52,199,89,0.3)] hover:bg-[#2EBF50] active:bg-[#25A840] active:shadow-[0_1px_4px_rgba(52,199,89,0.2)]",
        destructive:
          "bg-[#FF3B30] text-white shadow-[0_2px_8px_rgba(255,59,48,0.25)] hover:shadow-[0_4px_16px_rgba(255,59,48,0.3)] hover:bg-[#FF1F0A] active:bg-[#CC0000] active:shadow-[0_1px_4px_rgba(255,59,48,0.2)]",
        outline:
          "border border-[#E5E5EA] bg-white text-[#000000] hover:bg-[#F5F5F5] hover:border-[#D0D0D0] hover:shadow-[0_1px_3px_rgba(0,0,0,0.08)] active:scale-95 dark:border-[#38383A] dark:bg-[#1C1C1E] dark:text-white dark:hover:bg-[#2C2C2E] dark:hover:border-[#48484A]",
        ghost:
          "text-[#000000] hover:bg-[#F2F2F7] hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-95 dark:text-white dark:hover:bg-[#3A3A3C]",
        link: "text-[#007AFF] underline-offset-4 hover:underline dark:text-[#0A84FF]",
      },
      size: {
        xs: "px-2.5 py-1 text-xs",
        sm: "px-3.5 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
