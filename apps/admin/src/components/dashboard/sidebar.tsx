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
 * Minimalist navigation with smooth active states and hover effects
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-[#E5E5EA] bg-white/95 backdrop-blur-md lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 dark:border-[#38383A] dark:bg-[#1C1C1E]/95">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-[#E5E5EA] px-6 dark:border-[#38383A]">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[#000000] transition-opacity duration-200 hover:opacity-70 dark:text-white">
            <span className="text-lg font-semibold tracking-tight">Mantua</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="grid gap-1 px-3 space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.href || pathname.startsWith(route.href + '/')
              
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.25)] dark:shadow-[0_2px_8px_rgba(10,132,255,0.25)]"
                        : "text-[#666666] hover:bg-[#F2F2F7] hover:text-[#000000] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-95 dark:text-[#A1A1A6] dark:hover:bg-[#3A3A3C] dark:hover:text-white dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    )}
                  >
                    <route.icon className="h-5 w-5 shrink-0" />
                    <span>{route.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#E5E5EA] p-4 dark:border-[#38383A]">
          <div className="text-xs text-[#999999] dark:text-[#666666]">
            v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}