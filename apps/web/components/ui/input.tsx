import * as React from "react"

import { cn } from "~/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-[#bcc3bb] bg-[#fbfcfa] px-3 py-1 text-base text-[#191c1b] shadow-sm backdrop-blur transition-[background-color,border-color,color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#7b857d] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#edf1ec] disabled:opacity-60 md:text-sm dark:bg-[#fbfcfa]",
        "focus-visible:border-[#2f3b32] focus-visible:bg-white focus-visible:ring-[3px] focus-visible:ring-[#2f3b32]/14",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
