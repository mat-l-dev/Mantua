// Dashboard header bar
import { UserNav } from "./user-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-[#E5E5EA] bg-white/95 px-6 backdrop-blur-md lg:ml-64 dark:border-[#38383A] dark:bg-[#1C1C1E]/95">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-sm font-medium text-[#666666] dark:text-[#A1A1A6]">Dashboard</h1>
      </div>
      <UserNav />
    </header>
  )
}