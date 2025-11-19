import * as React from "react"
import * as FormPrimitive from "@radix-ui/react-form"
import { cn } from "@/lib/utils"

const Form = FormPrimitive.Root

const FormFieldContext = React.createContext<{
  name: string
}>(
  { name: "" }
)

const FormField = ({
  ...props
}: React.ComponentProps<typeof FormPrimitive.Field>) => (
  <FormPrimitive.Field {...props} />
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  return fieldContext
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Label
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Control>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Control>
>(({ ...props }, ref) => (
  <FormPrimitive.Control ref={ref} {...props} />
))
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-destructive", className)}
    {...props}
  />
))
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
