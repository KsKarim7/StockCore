import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, FileText, FileSpreadsheet } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

const returns = [
  { id: "SR-001", date: "25 Feb 2026", customer: "Rahim Ahmed", products: "Wireless Mouse", qty: 1, orderRef: "ORD-0012", status: "returned" as const },
  { id: "SR-002", date: "23 Feb 2026", customer: "Fatima Begum", products: "USB-C Cable", qty: 2, orderRef: "ORD-0008", status: "confirmed" as const },
];

export default function SalesReturnsList() {
  return (
    <PageLayout title="Sales Returns" searchPlaceholder="Search returns...">
      <div className="flex items-center justify-between mb-4">
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel</Button>
        </div>
        <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Return
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Return No", "Date", "Customer", "Products", "Qty", "Order Ref", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {returns.map((r, i) => (
                <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-row-hover transition-colors ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 text-table-body font-medium text-secondary">{r.id}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3 text-table-body">{r.customer}</td>
                  <td className="px-4 py-3 text-table-body">{r.products}</td>
                  <td className="px-4 py-3 text-table-body">{r.qty}</td>
                  <td className="px-4 py-3 text-table-body text-secondary">{r.orderRef}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-table-body text-secondary hover:underline cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {returns.map((r) => (
          <div key={r.id} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-1">
              <p className="font-semibold text-sm text-secondary">{r.id}</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>
            <p className="text-sm text-card-foreground">{r.customer}</p>
            <p className="text-xs text-muted-foreground truncate mb-2">{r.products} (x{r.qty})</p>
            <StatusBadge status={r.status} />
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
