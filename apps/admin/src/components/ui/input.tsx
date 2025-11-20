import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Apple Design System - Input Component
 * Subtle focus states with proper validation feedback
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[#E5E5EA] bg-white/95 px-3 py-2 text-sm text-[#000000] transition-all duration-200 placeholder:text-[#999999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/30 focus-visible:ring-offset-2 focus-visible:border-[#007AFF] focus-visible:shadow-[0_0_0_3px_rgba(0,122,255,0.1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F5F5F5] dark:border-[#38383A] dark:bg-[#1C1C1E]/95 dark:text-white dark:placeholder:text-[#666666] dark:focus-visible:ring-[#0A84FF]/30 dark:focus-visible:shadow-[0_0_0_3px_rgba(10,132,255,0.1)] dark:disabled:bg-[#2C2C2E]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
