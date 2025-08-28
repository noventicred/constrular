import * as React from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formatters"

interface PixBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number
  originalPrice?: number
}

function PixBadge({ price, originalPrice, className, ...props }: PixBadgeProps) {
  const discount = originalPrice ? ((originalPrice - price) / originalPrice * 100) : 0
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
        "bg-gradient-to-r from-blue-600 to-purple-600",
        "text-white text-sm font-semibold shadow-lg",
        "border border-white/20",
        className
      )} 
      {...props}
    >
      <Zap className="w-3.5 h-3.5 fill-current" />
      <span>{formatCurrency(price)} no PIX</span>
      {discount > 0 && (
        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
          -{discount.toFixed(0)}%
        </span>
      )}
    </div>
  )
}

export { PixBadge }