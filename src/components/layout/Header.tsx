import { useState } from "react";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  searchPlaceholder?: string;
  onMenuClick?: () => void;
}

export function Header({ searchPlaceholder = "Search products, orders, customers...", onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="h-[56px] md:h-[60px] bg-card border-b border-border flex items-center justify-between px-3 md:px-6 flex-shrink-0">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
            onClick={onMenuClick}
          >
            <Menu size={22} />
          </button>

          {/* Search — desktop */}
          <div className="relative w-[300px] hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 bg-muted border-0 h-9 text-sm"
            />
          </div>

          {/* Search icon — mobile */}
          <button
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Date range — hidden on mobile */}
          <div className="hidden md:block">
            <Select defaultValue="7">
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bell */}
          <button className="relative text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 md:top-auto md:-top-1 md:-right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm outline-none min-h-[44px]">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                JD
              </div>
              <span className="hidden md:block font-medium text-foreground">John Doe</span>
              <span className="hidden md:block text-muted-foreground">•</span>
              <span className="hidden md:block text-muted-foreground text-xs">Owner</span>
              <ChevronDown className="hidden md:block h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="fixed top-[56px] left-0 right-0 z-40 bg-card border-b border-border px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 bg-muted border-0 h-9 text-sm"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}
