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
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
        "bg-gradient-to-r from-construction-orange to-primary",
        "text-white text-sm font-bold shadow-lg",
        "border border-white/10 backdrop-blur-sm",
        "transition-all duration-300 hover:shadow-xl hover:scale-105",
        className
      )} 
      {...props}
    >
      <Zap className="w-4 h-4 fill-current drop-shadow-sm" />
      <div className="flex items-center gap-2">
        <span className="font-bold">{formatCurrency(price)}</span>
        <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
          PIX
        </span>
      </div>
      {discount > 0 && (
        <span className="text-xs font-bold bg-white/25 px-2 py-0.5 rounded-full border border-white/20">
          -{discount.toFixed(0)}%
        </span>
      )}
    </div>
  )
}

export { PixBadge }