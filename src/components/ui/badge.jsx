import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    warning: "bg-status-menunggu text-white",
    info: "bg-status-diproses text-white",
    success: "bg-status-selesai text-white",
    outline: "border border-gray-200 text-gray-700 bg-white",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
