import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Truck, DollarSign, AlertCircle, Plus, FileText, FileSpreadsheet } from "lucide-react";

const purchases = [
  { id: "PUR-001", date: "25 Feb 2026", products: "Wireless Mouse (50), USB Cable (100)", net: 85000, paid: 85000, due: 0 },
  { id: "PUR-002", date: "22 Feb 2026", products: "Cotton T-Shirt (200)", net: 65000, paid: 40000, due: 25000 },
  { id: "PUR-003", date: "18 Feb 2026", products: "Rice Miniket (500kg)", net: 42500, paid: 42500, due: 0 },
];

export default function PurchasesList() {
  return (
    <PageLayout title="Purchases" searchPlaceholder="Search purchases...">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard label="Total Purchases" value={formatCurrency(192500)} icon={Truck} iconColor="text-primary" iconBg="bg-primary/10" />
        <StatCard label="Total Paid" value={formatCurrency(167500)} icon={DollarSign} iconColor="text-success" iconBg="bg-success/10" />
        <StatCard label="Total Due" value={formatCurrency(25000)} icon={AlertCircle} iconColor="text-warning" iconBg="bg-warning/10" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel</Button>
        </div>
        <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Purchase
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Purchase No", "Date", "Products", "Net Amount", "Paid", "Due", "Actions"].map(h => (
                  <th key={h} className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map((p, i) => (
                <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-row-hover transition-colors ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 text-table-body font-medium text-secondary">{p.id}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3 text-table-body text-card-foreground max-w-xs truncate">{p.products}</td>
                  <td className="px-4 py-3 text-table-body font-medium">{formatCurrency(p.net)}</td>
                  <td className="px-4 py-3 text-table-body text-success">{formatCurrency(p.paid)}</td>
                  <td className="px-4 py-3 text-table-body text-destructive font-medium">{p.due > 0 ? formatCurrency(p.due) : "—"}</td>
                  <td className="px-4 py-3 text-table-body text-secondary hover:underline cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {purchases.map((p) => (
          <div key={p.id} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-1">
              <p className="font-semibold text-sm text-secondary">{p.id}</p>
              <p className="text-xs text-muted-foreground">{p.date}</p>
            </div>
            <p className="text-xs text-muted-foreground truncate mb-2">{p.products}</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">{formatCurrency(p.net)}</p>
              {p.due > 0 ? (
                <p className="text-xs text-destructive font-medium">Due: {formatCurrency(p.due)}</p>
              ) : (
                <p className="text-xs text-success font-medium">Paid</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
