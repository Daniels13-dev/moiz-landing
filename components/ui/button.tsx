import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buttonVariants = ({ variant = "default", size = "default", className }: { variant?: "default" | "outline" | "ghost" | "icon", size?: "default" | "sm" | "lg" | "icon", className?: string } = {}) => {
  return cn(
    "inline-flex items-center justify-center rounded-full text-sm font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-[var(--moiz-green)] text-white hover:bg-[#5b7a24] hover:scale-105 active:scale-95 shadow-lg shadow-[#6A8E2A]/20": variant === "default",
      "border-2 border-gray-200 bg-white text-[var(--moiz-dark)] hover:border-[var(--moiz-green)] hover:text-[var(--moiz-green)]": variant === "outline",
      "bg-transparent text-[var(--moiz-text)] hover:bg-gray-100": variant === "ghost",
      "p-3 bg-white text-[var(--moiz-green)] shadow-md hover:text-white hover:bg-[var(--moiz-green)] hover:scale-105": variant === "icon",
      "h-12 px-6": size === "default",
      "h-10 px-4 text-xs": size === "sm",
      "h-14 px-8 text-lg": size === "lg",
      "h-auto w-auto": size === "icon",
    },
    className
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
