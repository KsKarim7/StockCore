import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({ label, value, subtitle, trend, icon: Icon, iconColor = "text-primary", iconBg = "bg-primary/10" }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-3 md:p-5 shadow-sm border border-border animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-card-foreground truncate">{value}</p>
          {trend && (
            <p className={cn("text-badge mt-1", trend.positive ? "text-success" : "text-destructive")}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
          {subtitle && <p className="text-badge text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
