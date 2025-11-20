// Dashboard sidebar navigation with Apple design
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ShoppingCart, Users, BarChart3, Truck, MapPin, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Órdenes", href: "/orders", icon: ShoppingCart },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Logística", href: "/settings/locations", icon: MapPin },
  { name: "Envíos (Tiers)", href: "/settings/shipping", icon: Truck },
  { name: "Staff", href: "/settings/staff", icon: Users },
  { name: "Auditoría", href: "/settings/audit", icon: ShieldAlert },
]

/**
 * Apple Design System - Sidebar Component
 * Minimalist navigation with smooth active states, hover effects, and staggered animations
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-border bg-background/80 backdrop-blur-xl lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-border px-6 animate-fade-in">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground transition-opacity duration-200 hover:opacity-70">
            <span className="text-lg font-semibold tracking-tight">Mantua</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="grid gap-1 px-3 space-y-1">
            {routes.map((route, index) => {
              const isActive = pathname === route.href || pathname.startsWith(route.href + '/')
              
              return (
                <li key={route.href} className={cn("animate-slide-up", `stagger-item-${index}`)}>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-secondary text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <route.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{route.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 animate-fade-in">
          <div className="text-xs text-muted-foreground">
            v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}