import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Undo2, Truck,
  RefreshCw, Wallet, Activity, BarChart3, Settings, LogOut, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Orders & Sales", url: "/orders", icon: ShoppingCart },
  { title: "Sales Returns", url: "/sales-returns", icon: Undo2 },
  { title: "Purchases", url: "/purchases", icon: Truck },
  { title: "Purchase Returns", url: "/purchase-returns", icon: RefreshCw },
  { title: "Expenses", url: "/expenses", icon: Wallet },
  { title: "Stock Log", url: "/stock-log", icon: Activity },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebarDrawer({ open, onClose }: MobileSidebarDrawerProps) {
  const location = useLocation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-[260px] bg-sidebar text-sidebar-foreground z-10 flex flex-col animate-in slide-in-from-left duration-300">
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-sidebar-foreground/70 hover:text-sidebar-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-[60px] border-b border-sidebar-border">
          <Package className="h-6 w-6 text-secondary flex-shrink-0" />
          <span className="text-lg font-bold tracking-tight">IMS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.url ||
                (item.url !== "/" && location.pathname.startsWith(item.url));
              return (
                <li key={item.url}>
                  <Link
                    to={item.url}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors min-h-[44px]",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom user */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground flex-shrink-0">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/60">Owner</p>
            </div>
            <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
