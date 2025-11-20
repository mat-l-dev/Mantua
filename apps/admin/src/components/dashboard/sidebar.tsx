// Dashboard sidebar navigation
import Link from "next/link"
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

export function Sidebar() {
  return (
    <div className="hidden border-r border-input bg-background/95 glass lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b border-input px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg tracking-tight">Mantua Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="grid gap-1 px-2">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-smooth",
                    "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}