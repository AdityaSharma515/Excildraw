import Link from "next/link"
import { ThemeSwitcher } from "../app/ThemeSwitcher"
import { LayoutDashboard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TopBar = () => {
  return (
    <div className="font-sans flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 items-center px-6 md:px-10 max-w-7xl mx-auto w-full justify-between">
          
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            {/* Force SketchFlow Violet here! */}
            <div className="bg-violet-600 p-1.5 rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
                SketchFlow
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border focus-visible:ring-violet-500">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt="User" />
                    {/* Force a soft violet tint for the avatar */}
                    <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 font-bold">U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56 rounded-xl border-border bg-popover text-popover-foreground shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">My Account</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md my-1">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/me">
                  <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md my-1">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
        </div>
      </header>
    </div>
  )
}

export default TopBar