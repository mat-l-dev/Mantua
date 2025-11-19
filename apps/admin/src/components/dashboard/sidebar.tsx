// Dashboard sidebar navigation
import Link from "next/link"
import { Package, ShoppingCart, Users, BarChart3, Settings, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Órdenes", href: "/orders", icon: ShoppingCart },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Envíos (Tiers)", href: "/settings/shipping", icon: Truck },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  return (
    <div className="hidden border-r bg-zinc-50/40 dark:bg-zinc-900/40 backdrop-blur-xl lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-6">
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
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    "text-zinc-600 hover:bg-white hover:text-zinc-900 hover:shadow-sm",
                    "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
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