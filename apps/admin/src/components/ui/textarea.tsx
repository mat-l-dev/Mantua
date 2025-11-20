import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-lg border border-[#E5E5EA] bg-white/95 px-3 py-2 text-sm text-[#000000] ring-offset-white transition-all duration-200 placeholder:text-[#999999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/30 focus-visible:ring-offset-2 focus-visible:border-[#007AFF] focus-visible:shadow-[0_0_0_3px_rgba(0,122,255,0.1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F5F5F5] dark:border-[#38383A] dark:bg-[#1C1C1E]/95 dark:text-white dark:placeholder:text-[#666666] dark:ring-offset-[#1C1C1E] dark:focus-visible:ring-[#0A84FF]/30 dark:focus-visible:shadow-[0_0_0_3px_rgba(10,132,255,0.1)] dark:disabled:bg-[#2C2C2E]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
