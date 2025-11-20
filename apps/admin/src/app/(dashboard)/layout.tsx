// Dashboard layout with sidebar
import { ReactNode } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <Sidebar />
      <Header />
      <main className="lg:ml-64">
        <div className="container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  )
}