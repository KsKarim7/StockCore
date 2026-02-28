import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { ShoppingCart, DollarSign, AlertCircle, Plus, FileText, FileSpreadsheet, MoreVertical } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const orders = [
  { id: "ORD-0012", date: "26 Feb 2026, 3:45 PM", customer: "Rahim Ahmed", items: 3, total: 4500, received: 4500, due: 0, status: "paid" as const },
  { id: "ORD-0011", date: "26 Feb 2026, 1:20 PM", customer: "Fatima Begum", items: 5, total: 12300, received: 8000, due: 4300, status: "partial" as const },
  { id: "ORD-0010", date: "25 Feb 2026, 6:10 PM", customer: "Kamal Hossain", items: 1, total: 870, received: 0, due: 870, status: "confirmed" as const },
  { id: "ORD-0009", date: "25 Feb 2026, 2:30 PM", customer: "Nasreen Akter", items: 2, total: 6200, received: 6200, due: 0, status: "paid" as const },
  { id: "ORD-0008", date: "24 Feb 2026, 11:00 AM", customer: "Tariq Islam", items: 4, total: 3100, received: 0, due: 3100, status: "cancelled" as const },
];

export default function OrdersList() {
  return (
    <PageLayout title="Orders & Sales" searchPlaceholder="Search by order no or customer...">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard label="Total Orders" value="384" trend={{ value: "12% this month", positive: true }} icon={ShoppingCart} iconColor="text-primary" iconBg="bg-primary/10" />
        <StatCard label="Total Revenue" value={formatCurrency(285400)} trend={{ value: "8% this month", positive: true }} icon={DollarSign} iconColor="text-success" iconBg="bg-success/10" />
        <StatCard label="Pending Due" value={formatCurrency(42300)} subtitle="23 orders" icon={AlertCircle} iconColor="text-warning" iconBg="bg-warning/10" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel</Button>
        </div>
        <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Create Order
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Order No", "Date & Time", "Customer", "Items", "Total", "Received", "Due", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className={`border-b border-border last:border-0 hover:bg-row-hover transition-colors ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 text-table-body font-medium text-secondary">{o.id}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3 text-table-body text-card-foreground">{o.customer}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{o.items}</td>
                  <td className="px-4 py-3 text-table-body font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 text-table-body text-success">{formatCurrency(o.received)}</td>
                  <td className="px-4 py-3 text-table-body text-destructive font-medium">{o.due > 0 ? formatCurrency(o.due) : "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-table-body text-secondary hover:underline cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm text-secondary">{o.id}</p>
                <p className="text-xs text-muted-foreground">{o.customer}</p>
              </div>
              <p className="text-xs text-muted-foreground">{o.date}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">{formatCurrency(o.total)}</p>
                {o.due > 0 && <p className="text-xs text-destructive font-medium">Due: {formatCurrency(o.due)}</p>}
              </div>
              <StatusBadge status={o.status} />
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
