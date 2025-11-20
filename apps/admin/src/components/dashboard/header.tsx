// Dashboard header bar
import { UserNav } from "./user-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/60 px-6 backdrop-blur-md lg:ml-64">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-sm font-medium text-muted-foreground">Dashboard</h1>
      </div>
      <UserNav />
    </header>
  )
}