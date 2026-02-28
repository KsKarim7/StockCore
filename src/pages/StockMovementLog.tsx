import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const logs = [
  { date: "26 Feb 2026, 3:45 PM", product: "Wireless Mouse", code: "ELC-001", change: -2, reason: "Sale", before: 50, after: 48, doneBy: "John Doe" },
  { date: "26 Feb 2026, 1:20 PM", product: "USB-C Cable 1m", code: "ELC-002", change: -5, reason: "Sale", before: 10, after: 5, doneBy: "John Doe" },
  { date: "25 Feb 2026, 4:00 PM", product: "Wireless Mouse", code: "ELC-001", change: 50, reason: "Purchase", before: 0, after: 50, doneBy: "John Doe" },
  { date: "25 Feb 2026, 2:30 PM", product: "Cotton T-Shirt", code: "CLT-001", change: -3, reason: "Sales Return", before: 3, after: 0, doneBy: "Staff" },
  { date: "24 Feb 2026, 10:00 AM", product: "A5 Notebook", code: "STN-001", change: 100, reason: "Manual Adjustment", before: 110, after: 210, doneBy: "John Doe" },
];

export default function StockMovementLog() {
  return (
    <PageLayout title="Stock Movement Log" searchPlaceholder="Search by product name or code...">
      <div className="flex items-center justify-between mb-4">
        <div className="hidden md:flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="purchase-return">Purchase Return</SelectItem>
              <SelectItem value="sales-return">Sales Return</SelectItem>
              <SelectItem value="manual">Manual Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel</Button>
        </div>
        {/* Mobile: filter + export in one row */}
        <div className="md:hidden flex items-center gap-2 w-full">
          <Select defaultValue="all">
            <SelectTrigger className="flex-1 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="purchase-return">Purchase Return</SelectItem>
              <SelectItem value="sales-return">Sales Return</SelectItem>
              <SelectItem value="manual">Manual Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Date & Time", "Product", "Code", "Change", "Reason", "Before", "After", "Done By"].map(h => (
                  <th key={h} className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className={`border-b border-border last:border-0 hover:bg-row-hover transition-colors ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{l.date}</td>
                  <td className="px-4 py-3 text-table-body font-medium">{l.product}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{l.code}</td>
                  <td className={cn("px-4 py-3 text-table-body font-bold", l.change > 0 ? "text-success" : "text-destructive")}>
                    {l.change > 0 ? `+${l.change}` : l.change}
                  </td>
                  <td className="px-4 py-3 text-table-body">{l.reason}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{l.before}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{l.after}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{l.doneBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {logs.map((l, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-1">
              <p className="font-semibold text-sm text-card-foreground">{l.product}</p>
              <p className="text-xs text-muted-foreground">{l.date}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("font-bold text-sm", l.change > 0 ? "text-success" : "text-destructive")}>
                  {l.change > 0 ? `+${l.change}` : l.change}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{l.reason}</span>
              </div>
              <p className="text-xs text-muted-foreground">{l.doneBy}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
