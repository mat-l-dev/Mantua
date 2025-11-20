import { getDashboardStats, getRecentSales } from '@/actions/dashboard'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentSales } from '@/components/dashboard/recent-sales'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentSales = await getRecentSales()

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#000000] dark:text-white">Dashboard</h2>
          <p className="text-sm text-[#666666] dark:text-[#A1A1A6] mt-2">Bienvenido a tu panel de control</p>
        </div>
      </div>
      
      <DashboardStats 
        totalRevenue={stats.totalRevenue}
        pendingOrdersCount={stats.pendingOrdersCount}
        customersCount={stats.customersCount}
        productsCount={stats.productsCount}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-xl">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Ventas Recientes</CardTitle>
            <CardDescription>
              Últimas 5 órdenes registradas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={recentSales} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}