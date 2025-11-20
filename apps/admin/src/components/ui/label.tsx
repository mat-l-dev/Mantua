import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-[#000000] transition-colors duration-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-white",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
